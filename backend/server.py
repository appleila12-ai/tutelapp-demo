from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import secrets
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Any, Optional
import uuid
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class ReportIn(BaseModel):
    id: str
    answers: dict
    sections: list
    createdAt: str
    deviceId: Optional[str] = None


class ReportOut(BaseModel):
    id: str
    answers: dict
    sections: list
    createdAt: str
    shareToken: str


class AssistantIn(BaseModel):
    question: str = Field(max_length=2000)
    context: Optional[dict] = None


class AssistantOut(BaseModel):
    answer: str


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "SaluteNav API"}


# ---------- Reports (legacy device-based) ----------
@api_router.post("/reports", response_model=ReportOut)
async def create_report(report: ReportIn):
    doc = report.dict()
    doc["shareToken"] = secrets.token_urlsafe(12)
    doc["updatedAt"] = datetime.now(timezone.utc).isoformat()
    # Upsert by device id + report id so re-saves don't duplicate
    await db.reports.update_one(
        {"id": report.id},
        {"$set": doc},
        upsert=True,
    )
    return ReportOut(
        id=doc["id"],
        answers=doc["answers"],
        sections=doc["sections"],
        createdAt=doc["createdAt"],
        shareToken=doc["shareToken"],
    )


@api_router.get("/reports/device/{device_id}")
async def list_reports(device_id: str):
    cursor = db.reports.find({"deviceId": device_id}, {"_id": 0}).sort("createdAt", -1)
    items = await cursor.to_list(50)
    return {"items": items}


@api_router.get("/reports/share/{share_token}")
async def get_shared_report(share_token: str):
    doc = await db.reports.find_one({"shareToken": share_token}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Report non trovato")
    return doc


# ---------- AI Assistant ----------
from assistant_policy import build_system_prompt, user_message



@api_router.post("/assistant", response_model=AssistantOut)
async def assistant(payload: AssistantIn):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key mancante")
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Domanda vuota")

    session_id = f"salutenav-{uuid.uuid4()}"
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=build_system_prompt(datetime.now(timezone.utc).date()),
    ).with_model("anthropic", "claude-sonnet-4-6")

    try:
        response: Any = await chat.send_message(
            UserMessage(text=user_message(question, payload.context))
        )
        text = str(response).strip() if response else ""
    except Exception:
        logging.error("assistant provider call failed")
        raise HTTPException(status_code=502, detail="Assistente temporaneamente non disponibile")

    if not text:
        text = (
            "Mi dispiace, al momento non riesco a rispondere. "
            "Per un caso così specifico ti consiglio di contattare i Servizi Sociali "
            "del Comune o l'INPS: l'orientamento è gratuito."
        )
    return AssistantOut(answer=text)


# ---------- Contenuti aggiornabili (importi, FAQ, glossario, dopo-verbale) ----------
from app_content import APP_CONTENT_SEED


@api_router.get("/content")
async def get_app_content():
    # Vale la versione più recente tra quella nel database (che la Sentinella
    # può aggiornare) e il seed nel codice (aggiornato a ogni deploy).
    # Prima il seed sovrascriveva sempre il database, cancellando gli
    # aggiornamenti approvati dalla Sentinella.
    doc = await db.app_content.find_one({"key": "main"}, {"_id": 0})
    if not doc or str(APP_CONTENT_SEED.get("updatedAt", "")) > str(doc.get("updatedAt", "")):
        await db.app_content.replace_one(
            {"key": "main"}, dict(APP_CONTENT_SEED), upsert=True
        )
        doc = dict(APP_CONTENT_SEED)
    return {k: v for k, v in doc.items() if k not in ("_id", "key")}


# ---------- Sentinella AI (verifica importi INPS sul web) ----------
from sentinel import create_sentinel_router
from statistiche import create_statistiche_router, crea_indici_statistiche

app.include_router(api_router)
app.include_router(create_sentinel_router(db))
app.include_router(create_statistiche_router(db))

# Static assets (illustrazioni servite al client, funziona anche su Expo Go)
from fastapi.staticfiles import StaticFiles

app.mount("/api/assets", StaticFiles(directory=str(ROOT_DIR / "static")), name="assets")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def create_indexes():
    try:
        await crea_indici_statistiche(db)
        logger.info("Mongo indexes created/verified")
    except Exception as e:
        logger.warning(f"Index creation warning: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
