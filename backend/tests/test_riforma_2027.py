"""Backend tests for TutelApp Riforma 2027 refactor.

Verifies:
- GET /api/content: 'riforma' block does NOT contain 'fasi', intro contains 'in tutta Italia dal 2027'.
- POST /api/assistant: returns text using EMERGENT_LLM_KEY.
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("EXPO_PUBLIC_BACKEND_URL") or os.environ.get(
    "EXPO_BACKEND_URL"
) or "https://fullstack-mobile-hub-2.preview.emergentagent.com"
BASE_URL = BASE_URL.rstrip("/")


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


class TestContent:
    def test_content_200(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/content", timeout=15)
        assert r.status_code == 200, r.text
        self.__class__._data = r.json()

    def test_riforma_no_fasi(self, api_client):
        d = self._data
        assert "riforma" in d
        riforma = d["riforma"]
        assert "fasi" not in riforma, f"'fasi' should be removed. keys={list(riforma.keys())}"

    def test_riforma_intro_2027(self, api_client):
        riforma = self._data["riforma"]
        intro = riforma.get("intro", "")
        assert "in tutta Italia dal 2027" in intro, f"intro missing text: {intro[:200]}"

    def test_riforma_has_expected_fields(self, api_client):
        riforma = self._data["riforma"]
        for key in ("intro", "cosaCambia", "salvaguardia", "fonteUrl"):
            assert key in riforma, f"missing key {key}"
        assert isinstance(riforma["cosaCambia"], list) and len(riforma["cosaCambia"]) > 0

    def test_faq_and_glossario_present(self, api_client):
        d = self._data
        assert isinstance(d.get("faq"), list) and len(d["faq"]) > 0
        assert isinstance(d.get("glossario"), list) and len(d["glossario"]) > 0

    def test_importi_present(self, api_client):
        d = self._data
        assert isinstance(d.get("importi"), list) and len(d["importi"]) > 0


class TestAssistant:
    def test_assistant_returns_text(self, api_client):
        payload = {"question": "Cosa è la Legge 104?"}
        r = api_client.post(f"{BASE_URL}/api/assistant", json=payload, timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "answer" in data
        assert isinstance(data["answer"], str) and len(data["answer"]) > 20

    def test_assistant_empty_question_400(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/assistant", json={"question": ""}, timeout=15
        )
        assert r.status_code == 400
