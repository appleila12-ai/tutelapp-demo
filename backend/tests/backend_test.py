"""Backend regression tests for TutelApp (senza account né sincronizzazione).

Covers:
- Regression: /api/reports (create + share + device list), /api/assistant.
"""
import os
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest
import requests
from dotenv import load_dotenv
from pymongo import MongoClient

# Load backend .env to get MONGO_URL / DB_NAME
BACKEND_ENV = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(BACKEND_ENV)

# Public base URL (Kubernetes ingress -> :8001 for /api)
FRONTEND_ENV = Path(__file__).resolve().parents[2] / "frontend" / ".env"
load_dotenv(FRONTEND_ENV, override=False)

BASE_URL = (
    os.environ.get("EXPO_PUBLIC_BACKEND_URL")
    or os.environ.get("EXPO_BACKEND_URL")
).rstrip("/")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]

API = f"{BASE_URL}/api"


# ---------- Fixtures ----------
@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def mongo_db():
    client = MongoClient(MONGO_URL)
    try:
        yield client[DB_NAME]
    finally:
        client.close()


# ---------- Root / smoke ----------
class TestRoot:
    def test_root(self, api_client):
        r = api_client.get(f"{API}/")
        assert r.status_code == 200
        assert r.json().get("message") == "SaluteNav API"


# ---------- Regression: reports & assistant ----------
class TestReportsRegression:
    @pytest.fixture(scope="class")
    def created(self, api_client, mongo_db):
        rid = f"TEST_r_{uuid.uuid4().hex[:8]}"
        did = f"TEST_dev_{uuid.uuid4().hex[:6]}"
        payload = {
            "id": rid,
            "answers": {"who": "Io stesso", "work": "Dipendente"},
            "sections": [{"title": "Legge 104", "items": ["step1"]}],
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "deviceId": did,
        }
        r = api_client.post(f"{API}/reports", json=payload)
        assert r.status_code == 200, r.text
        body = r.json()
        yield body, did
        # Cleanup
        mongo_db.reports.delete_many({"id": rid})

    def test_create_report_returns_share_token(self, created):
        body, _ = created
        assert body["id"].startswith("TEST_r_")
        assert isinstance(body.get("shareToken"), str) and len(body["shareToken"]) > 5
        assert body["answers"]["who"] == "Io stesso"

    def test_get_report_by_share_token(self, api_client, created):
        body, _ = created
        r = api_client.get(f"{API}/reports/share/{body['shareToken']}")
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["id"] == body["id"]
        assert "_id" not in data  # ObjectId excluded

    def test_list_reports_by_device(self, api_client, created):
        _, did = created
        r = api_client.get(f"{API}/reports/device/{did}")
        assert r.status_code == 200
        data = r.json()
        assert "items" in data
        assert len(data["items"]) >= 1
        assert all("_id" not in it for it in data["items"])

    def test_share_token_not_found_404(self, api_client):
        r = api_client.get(f"{API}/reports/share/DOES_NOT_EXIST_xyz")
        assert r.status_code == 404


class TestAssistantRegression:
    def test_assistant_valid_question(self, api_client):
        r = api_client.post(
            f"{API}/assistant",
            json={"question": "Cos'è la Legge 104 in una frase?"},
            timeout=90,
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert isinstance(body.get("answer"), str)
        assert len(body["answer"]) > 10
        # Prompt is Italian TutelApp -> answer should be Italian (heuristic: contains at least one Italian stop word)
        low = body["answer"].lower()
        assert any(w in low for w in [" e ", " la ", " il ", " di ", " che ", "104", "invalidit"])

    def test_assistant_empty_question_400(self, api_client):
        r = api_client.post(f"{API}/assistant", json={"question": "   "})
        assert r.status_code == 400
