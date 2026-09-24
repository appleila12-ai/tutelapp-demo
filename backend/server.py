from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import secrets
from pathlib import Path
from pydantic import BaseModel
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
    question: str
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
SYSTEM_PROMPT = (
    "Sei l'assistente esperto di TutelApp, un'app italiana che aiuta i cittadini "
    "a orientarsi tra Legge 104/1992 e Invalidità Civile.\n\n"
    "Regole:\n"
    "1. Rispondi SEMPRE in italiano, con tono empatico, chiaro e diretto.\n"
    "2. Fonda ogni risposta sulla normativa vigente (L. 104/1992, L. 68/1999, art. 42 D.Lgs. 151/2001, "
    "D.Lgs. 105/2022, D.Lgs. 62/2024 — Riforma della disabilità in vigore in tutta Italia, procedure INPS aggiornate).\n"
    "3. Ricorda: dal D.Lgs. 105/2022 il convivente di fatto (L. 76/2016, convivenza registrata all'anagrafe) "
    "è equiparato al coniuge e all'unito civilmente per i permessi art. 33 e il congedo straordinario.\n"
    "4. Sii SINTETICO: max 6 frasi, vai al punto. Se serve elenca 2-3 passi pratici.\n"
    "5. Se la domanda è troppo specifica per rispondere senza dati clinici, indica cosa chiedere all'INPS o ai Servizi Sociali del Comune.\n"
    "6. Non dare mai indicazioni mediche. Solo procedurali e legali.\n"
    "7. Non inventare cifre né date. Se non sei certo di un importo, scrivi 'consulta l'INPS'.\n"
    "8. Se l'utente è inoccupato o pensionato, NON parlare di permessi lavorativi: orienta su prestazioni "
    "economiche (assegno mensile, pensione di inabilità, indennità di accompagnamento) ed esenzioni.\n"
    "9. Chiudi sempre con una frase incoraggiante e con l'invito a rivolgersi all'INPS o ai Servizi Sociali del Comune per la conferma."
)


@api_router.post("/assistant", response_model=AssistantOut)
async def assistant(payload: AssistantIn):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key mancante")
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Domanda vuota")

    context_msg = ""
    if payload.context:
        who = payload.context.get("who")
        work = payload.context.get("work")
        cert = payload.context.get("cert")
        when = payload.context.get("when")
        parts = []
        if who:
            parts.append(f"chi ha ricevuto la diagnosi: {who}")
        if when:
            parts.append(f"quando: {when}")
        if work:
            parts.append(f"situazione lavorativa: {work}")
        if cert:
            parts.append(f"certificato INPS: {cert}")
        if parts:
            context_msg = "\n\n[Contesto utente] " + "; ".join(parts) + "."

    session_id = f"salutenav-{uuid.uuid4()}"
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=SYSTEM_PROMPT,
    ).with_model("anthropic", "claude-sonnet-4-6")

    try:
        response: Any = await chat.send_message(
            UserMessage(text=question + context_msg)
        )
        text = str(response).strip() if response else ""
    except Exception as e:
        logging.exception("assistant call failed")
        raise HTTPException(status_code=502, detail=f"Errore assistente: {e}")

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
