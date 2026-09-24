# TutelApp

La tua guida semplice ai diritti, alla Legge 104 e alla Riforma della disabilità (D.Lgs. 62/2024).
TutelApp è offerta ai cittadini dai Comuni (modello white-label, più Comuni con la stessa app).

## Struttura

- `frontend/`: app Expo (web, iOS, Android)
  - `app/`: le pagine (Home, percorso, Progetto di Vita, la mia pratica, punti di supporto...)
  - `src/config/comuni/`: **una scheda per ogni Comune** (contatti, colori, stemma, servizi)
  - `scripts/anteprime-comuni.js`: crea le anteprime dei link per WhatsApp/email a ogni build
- `backend/`: API FastAPI + MongoDB (assistente sulla 104, contenuti, Sentinella, statistiche anonime). Nessun account: i dati dei cittadini restano sul loro dispositivo
- `plan/plan.md`: elenco delle funzionalità
- `MULTI-COMUNE.md`: come funziona il multi-Comune, come aggiungere un Comune, statistiche e cruscotto
- `DEMO-NETLIFY.md`: come pubblicare la demo su Netlify

## Link per Comune

`<indirizzo-app>/sarzana` · `<indirizzo-app>/erba` · `<indirizzo-app>/vigne-e-vini` · `<indirizzo-app>/ventimiglia` · `<indirizzo-app>/mediglia`
