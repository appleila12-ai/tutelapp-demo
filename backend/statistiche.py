"""Statistiche anonime per i Comuni.

L'app invia solo CONTEGGI per categoria (es. "momento = diagnosi"), mai dati
personali, identificativi dell'utente o del dispositivo, testi liberi.
Nel database non esistono eventi singoli: solo contatori aggregati per
(Comune, mese, metrica, valore).

Il cruscotto di ogni Comune è protetto da un codice di accesso impostato
come variabile d'ambiente sul backend:
    STATS_CODE_ERBA=...            → solo il Comune di Erba
    STATS_CODE_VIGNE_E_VINI=...    → solo l'Unione Vigne e Vini
    STATS_CODE_ADMIN=...           → tutti i Comuni (per il team TutelApp)
I valori inferiori a SOGLIA vengono nascosti, per non rendere riconoscibile
nessuno nei Comuni piccoli.
"""

import os
import re
import secrets
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

SOGLIA = 5
MAX_EVENTI = 40
MAX_MESI = 12

# Metriche ammesse. Per le metriche con elenco, sono ammessi solo quei valori;
# per le altre, un testo breve che l'app prende da elenchi predefiniti.
METRICHE = {
    "visita": {"mese"},
    "momento": {"diagnosi", "iter", "diritti"},
    "tappa": {"richiesta", "presa_carico", "uvm", "progetto", "completato"},
    "area_progetto": {"casa", "salute", "relazioni", "lavoro", "tempo", "autonomia"},
    "progetto_pdf": {"creato"},
    "questionario": {"completato"},
    "chi": None,
    "quando": None,
    "lavoro": None,
    "certificato": None,
    "desiderio": None,
    "sezione": None,
    "paese": None,
    "verbale": {"No, non ancora", "Domanda già presentata", "Sì, ho già un verbale", "Non lo so"},
}

SLUG_RE = re.compile(r"^[a-z0-9-]{1,64}$")
VALORE_RE = re.compile(r"^[\w\s'’/\-àèéìòùÀÈÉÌÒÙ.,()…]{1,120}$")


class Evento(BaseModel):
    m: str
    v: str


class EventiIn(BaseModel):
    comune: str
    eventi: List[Evento]


def _mese(dt: Optional[datetime] = None) -> str:
    return (dt or datetime.now(timezone.utc)).strftime("%Y-%m")


def _mesi_indietro(n: int) -> List[str]:
    now = datetime.now(timezone.utc)
    y, m = now.year, now.month
    out = []
    for _ in range(n):
        out.append(f"{y:04d}-{m:02d}")
        m -= 1
        if m == 0:
            y, m = y - 1, 12
    return list(reversed(out))


def _valido(ev: Evento) -> bool:
    if ev.m not in METRICHE:
        return False
    ammessi = METRICHE[ev.m]
    if ammessi is not None:
        return ev.v in ammessi
    return bool(VALORE_RE.match(ev.v))


def _codice_ok(slug: str, codice: Optional[str]) -> bool:
    if not codice:
        return False
    attesi = [
        os.environ.get("STATS_CODE_" + slug.upper().replace("-", "_"), ""),
        os.environ.get("STATS_CODE_ADMIN", ""),
    ]
    return any(a and secrets.compare_digest(a, codice) for a in attesi)


def create_statistiche_router(db) -> APIRouter:
    router = APIRouter(prefix="/api/stats")

    @router.post("/eventi")
    async def registra_eventi(payload: EventiIn):
        slug = payload.comune.strip().lower()
        if not SLUG_RE.match(slug):
            raise HTTPException(status_code=400, detail="Comune non valido")
        mese = _mese()
        accettati = 0
        for ev in payload.eventi[:MAX_EVENTI]:
            if not _valido(ev):
                continue
            await db.stats_contatori.update_one(
                {"comune": slug, "mese": mese, "m": ev.m, "v": ev.v},
                {"$inc": {"n": 1}},
                upsert=True,
            )
            accettati += 1
        return {"ok": True, "accettati": accettati}

    @router.get("/{comune}")
    async def cruscotto(
        comune: str,
        mesi: int = 6,
        x_codice: Optional[str] = Header(None),
    ):
        slug = comune.strip().lower()
        if not SLUG_RE.match(slug):
            raise HTTPException(status_code=400, detail="Comune non valido")
        if not _codice_ok(slug, x_codice):
            raise HTTPException(status_code=401, detail="Codice di accesso non valido")

        mesi = max(1, min(MAX_MESI, mesi))
        elenco_mesi = _mesi_indietro(mesi)
        cursor = db.stats_contatori.find(
            {"comune": slug, "mese": {"$in": elenco_mesi}}, {"_id": 0}
        )
        totali: dict = {}
        visite_mese = {m: 0 for m in elenco_mesi}
        async for doc in cursor:
            key = (doc["m"], doc["v"])
            totali[key] = totali.get(key, 0) + int(doc.get("n", 0))
            if doc["m"] == "visita":
                visite_mese[doc["mese"]] = visite_mese.get(doc["mese"], 0) + int(doc.get("n", 0))

        def nascondi(n: int) -> Optional[int]:
            # 0 si può mostrare; da 1 a SOGLIA-1 no (persone riconoscibili)
            return n if n == 0 or n >= SOGLIA else None

        per_metrica: dict = {}
        for (m, v), n in totali.items():
            per_metrica.setdefault(m, []).append({"v": v, "n": nascondi(n)})
        for m in per_metrica:
            per_metrica[m].sort(key=lambda x: -(x["n"] or 0))

        return {
            "comune": slug,
            "mesi": elenco_mesi,
            "soglia": SOGLIA,
            "visitePerMese": [{"mese": m, "n": nascondi(visite_mese.get(m, 0))} for m in elenco_mesi],
            "metriche": per_metrica,
        }

    return router


async def crea_indici_statistiche(db):
    await db.stats_contatori.create_index(
        [("comune", 1), ("mese", 1), ("m", 1), ("v", 1)], unique=True
    )
