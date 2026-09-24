# SaluteNav — Navigatore Sanitario

## Overview
Flusso lineare a 3 passi (IT) per capire i diritti dopo una diagnosi (Legge 104 / Invalidità Civile). Design minimale soft blue / white, tono empatico, sync backend anonimo.

## Screens
1. **Home** (`app/index.tsx`)
   - **Pillola regione** (default Liguria) top-left con sheet 10 regioni
   - **Icone login social** Google/Apple top-right (chip post-login, mock)
   - Titolo "Navigatore Sanitario — La tua guida passo-passo ai diritti in {regione}"
   - Bottone "Inizia il percorso"
   - **4 step** (Diagnosi / Lavoro / Documenti / Patronato) con badge attivo brand
   - Box "Offrici un caffè €3"

2. **Wizard** (`app/valutazione.tsx`)
   - Passo 1: chi + quando la diagnosi
   - Passo 2: situazione lavorativa (Privato / Pubblico / Autonomo / Inoccupato-Pensionato)
   - Passo 3: certificato INPS (Sì / No / Non so cos'è)
   - Modale d'avviso salva-tempo "Ho capito, prosegui" prima dei risultati

3. **Risultati** (`app/risultati/[id].tsx`)
   - Intro empatico personalizzato con data diagnosi + situazione lavorativa
   - Avviso 90 giorni (banner giallo)
   - 3 sezioni categorizzate: Permessi & Congedo / Sede & Smart Working / Esenzioni & Fiscali
   - Bottone "Scarica PDF" (expo-print + expo-sharing)
   - Bottone "Condividi Famiglia" → modal con **QR code** + link + copy + native share
   - **NUOVO — Patronati e Sportelli Territoriali** (componente `src/components/PatronatiSection.tsx`)
     - Checklist gialla "Prima di andare al Patronato" (Codice Fiscale, Documento d'Identità, Certificato Medico Introduttivo)
     - Campo di ricerca per CAP o città con ordinamento per prossimità
     - 3 patronati Sarzana in evidenza (INCA CGIL Via XXI Luglio, ACLI Via Lucri, ITAL UIL Via Landinelli) con badge stella
     - Ogni card: bottone "**Prenota Slot**" → modale con 5 slot orari (stile Calendly) → conferma con box verde "Prenotato: ..."
     - Pannello "Indirizzo e contatti" con azioni Chiama / Email / Mappa
     - 10 patronati totali (Sarzana, La Spezia, Genova, Milano, Roma, Napoli, Torino, Bologna)
   - Box AI "Fai una domanda alla Legge 104" con 4 suggerimenti rapidi + risposta Claude Sonnet 4.6
   - Card **Cassaforte Referti** (€4,99): tap → **modale Stripe** placeholder → "Paga ora" sblocca l'upload dei referti (Referto_1.pdf, Referto_2.pdf…)
   - Link "Checklist documenti"
   - Sezione pieghevole "Cosa fare se la domanda viene respinta" (5 step di ricorso INPS)

4. **Checklist** (`app/checklist.tsx`)
   - 4 caselle (certificato, ricevuta, ID, referti originali + copie)
   - Progress bar 0-100 %, salvataggio locale, tip giallo "Porta sempre le fotocopie"

## Backend (`backend/server.py`)
- `POST /api/reports` — salva/upsert per `deviceId`, restituisce `shareToken`
- `GET /api/reports/share/{token}` — visualizza report condiviso
- `GET /api/reports/device/{device_id}` — lista report del dispositivo
- `POST /api/assistant` — Claude Sonnet 4.6 (Emergent LLM key) con system prompt italiano su L.104 + contesto risposte utente

## Sync
- **Silent cloud sync** via `deviceId` anonimo salvato in `SecureStore` alla prima app-open
- Ogni valutazione viene upserted lato backend senza account
- QR code condivisibile puntando direttamente all'endpoint `share/{token}`
- ⚠️ Google/Apple login social non implementato in questa iterazione (richiesta esplicita futura)

## Design tokens
- Palette: `#2C6496` brand, `#EBF2FA` brandSecondary, `#FFFFFF`, `#111827`
- Warnings: `#D97706` + `#FEF3C7`
- Success: `#059669`
- Radius: pill / lg / md, min touch 44/56 pt

## Removed / Cleaned up
- Dashboard con 4 feature cards, banner Percorso guidato
- Search bar, feature detail screens, storico, confronto, patronato, promemoria
- i18n toggle (app solo IT)

## Aggiornamento (Giugno 2026 - fork post-ricarica)
- Rebranding "TutelApp" VERIFICATO: logo scudo/spunta, palette blu ceruleo #2A75D3 + arancio #F59E0B, home renderizza correttamente
- Google Auth reale + Cloud Sync attivi (backend 22/22 test passati)
- Problema "non vedo più niente" post-ricarica: risolto con riavvio servizi nel nuovo ambiente forkato
- Prossimi step: Stripe reale per Cassaforte Referti (P1), refactor risultati/[id].tsx (P2)

## Iterazione 5-6 (Giugno 2026)
- Stripe REALE (emergentintegrations proxy) per Cassaforte €4,99: /api/payments/checkout + /api/payments/status, pagina /payment-success, sblocco persistito
- Cassaforte sbloccata: salva report PDF + carica documenti (expo-document-picker/file-system), persistiti
- Rimossa data fittizia diagnosi (intro/PDF mostrano solo il bucket temporale)
- DeadlineCard: promemoria 90gg con data reale inserita dall'utente (GG/MM/AAAA), countdown persistito
- NextStepsSection: percorso 5 passi, spiegazione Certificato Introduttivo, possibilità Legge 104, tabella percentuali invalidità
- Inoccupato/Pensionato: rimosse sezioni permessi/sede → sezione "Prestazioni economiche"; suggerimenti AI dedicati
- Nota partner/convivente di fatto (D.Lgs 105/2022) nel wizard e nei risultati
- Fix ricerca CAP patronati (prefisso CAP, 1 cifra ok) + 8 nuove sedi nazionali
- Nuovo logo mano-cuore (MCI hand-heart), palette topics per argomento, card regione grande in home
- PracticalHelpSection nei risultati: 4 schede espandibili (Trasporti, ADI/SAD, Fisioterapia, RSA/sollievo) + PDF "Guida ai Servizi Sociali del Comune"
- Test: backend 27/27 pytest, frontend E2E validato (iteration_5.json)

## Iterazione 6 (Giugno 2026) — tutti i suggerimenti implementati
- Storico valutazioni in home (LE TUE VALUTAZIONI, max 3, riapribili) — home ora scrollabile
- Promemoria regionali negli Aiuti Pratici: banner regione + link portale ufficiale (10 regioni) + contatti trasporti dinamici per regione
- Guida Servizi Sociali salvata anche in Cassaforte se sbloccata (nome Guida_Servizi_Sociali_{regione}.pdf)
- Refactor: risultati/[id].tsx 1067→~400 righe; estratti AssistantCard, ShareModal, AppealSection, RightsSectionCard; nuova lib condivisa src/lib/vault.ts (usata da VaultSection, payment-success, PracticalHelpSection)
- Test: frontend E2E completo validato senza bug (iteration_6.json)

## Iterazione 7 (Giugno 2026) — UX wizard e riposizionamento blocchi
- RIMOSSO il modal "Attenzione, salva-tempo" nel wizard (passo 3): l'avviso è ora un banner inline giallo sotto le opzioni della Domanda 3; "Vedi i tuoi diritti" porta direttamente ai risultati (warn-continue-btn non esiste più)
- Card "IL PERCORSO — Hai la diagnosi in mano: e adesso?" SPOSTATA dai Risultati alla HOME, subito sotto "Inizia il percorso" (componente GuideStepsCard esportato da NextStepsSection)
- Rimosso l'indicatore 4-step dalla home; ordine home: branding → regione → Inizia il percorso → Percorso 5 passi → storico → box sostegno
- Risultati invariati per il resto (Patronati, cert explainer, 104/invalidità, vault, AI)
- Verificato con screenshot E2E: wizard 3 step senza modal, banner inline presente, percorso in home, risultati integri

## Iterazione 8 (Giugno 2026) — Pagine dedicate + immagini
- NUOVA pagina /territorio: "Aiuti sul Territorio" in grande, hero image, banner regione + portale, 4 schede con immagini di testata, download guida (salva anche in cassaforte)
- NUOVA pagina /patronati: "Dove inviare la pratica" con hero image e ricerca CAP + NUOVO tasto "Continua" sotto il campo CAP (fix "finestra non funziona")
- Risultati: Patronati e Territorio sostituiti da entry-card con immagini che portano alle nuove pagine; banner immagine "Diritti e Permessi — Legge 104" sopra le sezioni; Riepilogo (Scarica PDF/Condividi) SPOSTATO IN FONDO in card dedicata
- PDF arricchito: sezioni "Dove inviare la pratica" e "Aiuti pratici sul territorio"
- IMMAGINI: hero empatica in home ("Nessuno dovrebbe orientarsi da solo"), immagini nei 3 step del wizard (diagnosi/lavoro/certificato), banner nelle macro-categorie; tutte con angoli arrotondati 12-16, palette invariata — src/lib/images.ts (Unsplash CDN)
- Refactor: PracticalHelpSection eliminato → logica in src/lib/territorio.ts
- Verificato con screenshot E2E su home, wizard, risultati, patronati e territorio

## Iterazione 9 (Giugno 2026) — Logo ufficiale + mono + ordine home
- LOGO UFFICIALE dell'utente (nodo triangolare teal) integrato: assets/images/brand/mark.png (ritaglio quadrato) e lockup.png (logo+nome+payoff); Brand.tsx riscritto → Logo/Wordmark usano il mark, nuovo BrandLockup usato nella home al posto di titolo/sottotitolo
- "Inizia il percorso" SPOSTATO SOTTO la card "Il Percorso" in home (ordine: hero foto → lockup → desc → regione → percorso → inizia → storico → sostegno)
- IMMAGINI MONOCOLORE: Unsplash con &sat=-100 (grigio lato CDN) + velo blu brand — nuovo componente MonoImage usato in wizard (3 step), card territorio, entry-card risultati; gli hero ImageBackground diventano mono con l'overlay esistente
- NESSUN DEPLOY effettuato (richiesta esplicita utente)
- Verificato con screenshot: home, wizard, percorso

## Iterazione 10 (Giugno 2026) — Contatti Utili + 20 regioni
- NUOVA pagina /contatti "Contatti Utili": INPS (803 164 fisso, 06 164 164 mobile, inps.it, app INPS Mobile), Patronati (ACLI, INCA, INAS, ITAL con siti), Altri (Agenzia Entrate 800 909 696, Min. Salute 1500) — righe tappabili tel:/https
- Entry card "Contatti Utili" in home sotto "Inizia il percorso" (testID home-contatti-link)
- TUTTE le 20 REGIONI italiane: REGIONAL_PORTALS completato in territorio.ts (fonte unica, export REGIONI); modal regione in home ora scrollabile (maxHeight 420)
- Verificato con screenshot: selezione Sardegna→Liguria ok, pagina contatti completa

## Iterazione 11 (Giugno 2026) — Illustrazioni italiane su misura
- Generato con Gemini Nano Banana (EMERGENT_LLM_KEY) un set di 11 ILLUSTRAZIONI flat su misura, ambientazione ITALIANA, palette brand (ceruleo/navy/teal/ambra), niente testo: home_hero, 3 wizard, diritti104, patronati, territorio, trasporti, domiciliare, fisioterapia, rsa
- Script riusabile: /app/scripts/gen_illustrations.py (accetta nomi come argomenti per rigenerare singole immagini)
- Asset locali compressi (~40-80KB jpg) in frontend/assets/images/illustrations/ — RIMOSSE tutte le foto stock Unsplash "americane"
- images.ts ora usa require() locali (ImageSourcePropType); MonoImage prende `source` con velo blu leggerissimo (0.06)
- Aggiornati: home hero, 3 step wizard, banner diritti 104, entry-card patronati/territorio, hero pagine patronati e territorio, card territorio
- Suggerimenti estetici del design agent salvati in /app/design_guidelines.json (font Plus Jakarta Sans 16pt, touch 48pt, topic colors solo come accenti) — NON ancora applicati, in attesa di conferma utente
- Verificato con screenshot: home, wizard, risultati, territorio

## Iterazione 12 (Giugno 2026) — Fix Expo Go + contenuti remoti + FAQ/Glossario/Importi/Verbale
- FIX BUG utente ("rettangoli azzurri" su Expo Go): illustrazioni ora servite dal backend via /api/assets/illustrations/*.jpg (FastAPI StaticFiles, jpg copiati in /app/backend/static/illustrations); images.ts usa {uri} remoti → funziona anche su Expo Go
- Contenuti AGGIORNABILI dal server: GET /api/content (seed idempotente in /app/backend/app_content.py, collezione app_content) — importi 2026, 10 FAQ, 12 glossario, 7 passi dopoVerbale; frontend con cache offline in src/lib/remoteContent.ts
- NUOVE pagine: /importi (badge "Dati aggiornati al 01 giugno 2026" + link INPS per voce) e /faq (FAQ accordion + glossario)
- NUOVA sezione risultati: "Verbale in mano: e ora?" (VerbaleSection, come attivare ogni beneficio: esenzione ASL, permessi HR, IVA 4%, bollo, AP70, collocamento, contrassegno)
- Home: card "Domande Frequenti" + "Importi Aggiornati" sotto Contatti Utili
- Logo: mark ripulito su FONDO BIANCO, in home ora Wordmark grande (logo accanto al nome) + tagline — il lockup grande è stato rimosso perché occupava troppo spazio
- Per aggiornare gli importi: modificare il doc Mongo app_content key="main" (o il seed + cancellare il doc)
- TESTING AGENT: 15/15 backend + tutti i flussi frontend PASSED (iteration_7.json) — bug immagini confermato chiuso

## Iterazione 13 (Giugno 2026) — Sentinella AI dei contenuti
- NUOVA "Sentinella AI": GPT-5 con web_search (Emergent LLM key, OpenAI Responses API via proxy) verifica gli importi INPS del DB contro le fonti ufficiali sul web
- Backend /app/backend/sentinel.py: POST /api/sentinel/check (avvia check async in background, 1 chiamata LLM per importo in parallelo), GET /api/sentinel/latest (polling), POST /api/sentinel/resolve ({checkId, nome, azione: applica|ignora} — "applica" aggiorna il doc app_content e updatedAt)
- Collezione Mongo: sentinel_checks {check_id, status running|done|errore, startedAt, finishedAt, results[]}
- Ogni result: {nome, importoAttuale/redditoAttuale, importoTrovato/redditoTrovato, stato ok|discrepanza|non_verificato, nota, fonte URL, esito in_attesa|applicato|ignorato}
- Frontend /app/frontend/app/sentinella.tsx: pagina admin nascosta — accesso con LONG PRESS (600ms) sul badge "Dati aggiornati al..." nella pagina /importi; bottone "Avvia controllo AI", polling 4s, card risultati con badge colorati, bottoni Applica/Ignora, link fonte
- VERIFICATO E2E: check reale ha trovato discrepanza vera (accompagnamento 2026: € 551,53 da Messaggio INPS n. 628 vs € 552,27 in DB) → applicata → /api/content aggiornato
- TODO memorizzato: Mini Pannello Admin (riproporre PRIMA della pubblicazione, richiesta esplicita utente)

## Iterazione 14 (Giugno 2026) — Cassaforte gratuita (paywall rimosso)
- Su richiesta utente: RIMOSSO il pagamento €4,99 dalla Cassaforte Referti — ora GRATUITA e subito attiva (badge "Inclusa", bottoni Salva report PDF / Carica documento visibili senza checkout)
- VaultSection.tsx ripulito da tutta la logica Stripe (checkout, polling, stati paying/checking); vault.ts: isVaultUnlocked() ritorna sempre true
- Il codice Stripe RESTA PRONTO per riattivazione futura: backend /api/payments/* intatto, payments.ts e payment-success.tsx conservati (dormienti)
- NOTA UTENTE: il pagamento potrà essere reintrodotto "in un secondo momento" — richiesta esplicita
- Verificato E2E con screenshot: wizard completo → risultati → card cassaforte senza bottone Stripe, upload disponibile
- Ribadito dall'utente: MAI fare deploy senza autorizzazione esplicita

## Iterazione 15 (Giugno 2026) — Fix logo scudo + refusi + prontezza deploy
- FIX "logo ha perso lo scudo": il mark locale (require) non veniva caricato (riquadro bianco header, sagoma tagliata al centro) — ora servito dal BACKEND come le illustrazioni: /api/assets/brand/mark.png (copiato in /app/backend/static/brand/), Brand.tsx usa {uri} + resizeMode contain; mark.png ri-estratto dal lockup preservando la sagoma a scudo
- FIX refusi "semplice" ripetuto in home: "Un percorso guidato in 4 passi…" e "Risposte chiare e glossario" (la tagline ufficiale con "semplice" resta: è il payoff del lockup)
- DEPLOY READINESS (deployment_agent): 2 BLOCKER RISOLTI — httpx==0.28.1 aggiunto a requirements.txt; rimosse le righe .env/.env.*/*.env dal .gitignore root. Ora status=warn
- WARN residui prima della pubblicazione: 1) prenotazione slot patronati è MOCK (PatronatiSection.tsx:385) — da rimuovere/rietichettare o integrare davvero; 2) manca cancellazione account in-app (richiesta Apple per store, esiste solo logout); 3) URL Emergent hardcoded (auth+LLM proxy) = costanti di piattaforma, non bloccanti
- PENDING: riproporre Mini Pannello Admin PRIMA della pubblicazione (promessa all'utente)

## Iterazione 16 (Giugno 2026) — Pre-pubblicazione: scelte utente applicate
- Utente ha deciso: pubblicare SENZA Mini Pannello Admin (resta in backlog)
- RIMOSSO il bottone "Prenota Slot" (mock) dai patronati: eliminati modal slot, stati booking e stili relativi da PatronatiSection.tsx — restano Chiama/Email/Mappa reali
- CANCELLAZIONE ACCOUNT in-app (requisito Apple): DELETE /api/auth/account (auth bearer, cancella users+user_sessions+user_data), deleteAccountRemote in auth.ts, deleteAccount in AuthContext, UI nel menu utente della home sotto "Esci" (bottone "Elimina account" → conferma inline rossa "Elimina definitivamente"/"Annulla", testID home-delete-account-btn / home-delete-confirm-btn / home-delete-cancel-btn) — backend verificato E2E (200, dati rimossi, token invalidato 401)
- LOGO SCUDO: rimossa l'ombra dal mark, sfondo bianco puro (filtro saturazione PIL), aggiornato sia frontend asset sia /app/backend/static/brand/mark.png
- Verificato con screenshot: home (scudo pulito), /patronati (0 bottoni Prenota Slot, contatti presenti)

## Iterazione 17 (Giugno 2026) — Prototipo White-Label "TutelAPP Comune" (HTML unico)
- CONTESTO: utente ha segnalato la Riforma Disabilità D.Lgs. 62/2024 (sperimentazione in 60 province nel 2026, entrata a regime 1/1/2027; ricerca web fatta con fonti INPS) e ha chiesto un prototipo white-label per enti comunali
- CREATO file HTML autonomo (stili+script inclusi): /app/backend/static/white-label/sarzana.html (servito su /api/assets/white-label/sarzana.html) + copia /app/tutelapp-sarzana-whitelabel.html
- Architettura white-label: oggetto globale CONFIGURAZIONE_COMUNE a inizio <script> (nome ente, logo, settore, assessore Sara Viola, email, telefono, sede, colori istituzionali via CSS vars, elenco patronati) — dati pilota Comune di Sarzana
- Funzioni: bivio onboarding (Nuova Diagnosi 2027 / Salvaguardia 104), select 4 livelli sostegno con agevolazioni fiscali+lavoro dinamiche, sezione salvaguardia + Progetto di Vita, upload simulato referti con OTP 6 cifre e timer 10 min, dashboard admin (sblocco fascicolo con OTP, referti cronologici, barre ICF OMS, export SISDA simulato), patronati ordinati per km con nota canone manutenzione
- Testato E2E via screenshot: tutti i flussi OK (OTP generato → fascicolo sbloccato → SISDA)
- PENDING APERTI: 1) app mobile da aggiornare per la riforma 2027 (province in sperimentazione — utente dice che i contenuti attuali "non sono corretti" per quelle province); 2) decisione web app slot replacement (utente informato dei costi, non ha ancora dato ok definitivo); 3) link Buy Me a Coffee reale da ricevere dall'utente (attuale = 404)

## Iterazione 18 (Giugno 2026) — App mobile aggiornata all'iter 2027 (FATTO)
- RISOLTO pending #1: app aggiornata alla Riforma D.Lgs. 62/2024
- Backend app_content.py: nuovo blocco "riforma" nel seed (regimeNazionale 2027-01-01, intro, 4 card cosaCambia, salvaguardia, 3 fasi con 59 territori verificati da fonti INPS: 9 dal 1/1/2025, 11 dal 30/9/2025, 39 dal 1/3/2026) + 3 nuove FAQ riforma + glossario aggiornato; MIGRAZIONE eseguita sul doc Mongo live ($set riforma/faq/glossario)
- remoteContent.ts: tipi Riforma/RiformaFase/RiformaCambio, AppContent.riforma opzionale
- NUOVA pagina /riforma (riforma.tsx): verifica provincia con ricerca normalizzata (match: già attiva con fase/data, oppure "dal 1/1/2027"), sezioni Cosa Cambia, banner Salvaguardia verde, link fonte INPS — tutto da contenuto remoto (aggiornabile senza update app)
- Home: banner arancione "Novità · Riforma 2027" (testID home-riforma-banner) → /riforma
- Wizard step 3: nota blu "Riforma 2027" (testID wizard-riforma-note) → /riforma
- Verificato E2E via screenshot: Genova→attiva 2ª fase, Napoli→dal 2027, La Spezia→attiva 3ª fase; banner home naviga; nota wizard visibile
- PENDING RESIDUI: Buy Me a Coffee link (404), decisione web app, redeploy per portare tutto in produzione

## Iterazione 19 (Giugno 2026) — Livelli di Sostegno nei risultati
- app_content.py: nuovo blocco "livelliSostegno" (intro + 4 livelli: Lieve verde/Medio ambra/Grave arancio/Gravissimo rosso, ciascuno con descrizione, fisco[] e lavoro[]) — MIGRATO sul doc Mongo live
- remoteContent.ts: tipi LivelloSostegno/LivelliSostegno, AppContent.livelliSostegno opzionale
- NUOVO componente LivelliSection.tsx (accordion esterno stile VerbaleSection, accent #C2410C, accordion interno per livello con pallino colorato + liste agevolazioni + nota prudenziale + link a /riforma) — inserito in risultati/[id].tsx subito dopo VerbaleSection
- Verificato E2E: wizard→risultati→sezione presente, livello Grave espanso mostra bollo/IVA 4%/congedo, link riforma ok
- REDEPLOY: utente vuole portare in produzione (riforma 2027 + livelli + logo + cancellazione account) — azione UTENTE via Publish, ricordato

## Iterazione 20 (Giugno 2026) — Wizard 2027 + Sentinella Riforma
- WIZARD 2027: reports.ts Answers + provincia?/nuovoIter?; remoteContent.ts esporta normalizzaTesto/trovaProvincia (riusati anche in riforma.tsx); valutazione.tsx step 3 ha card "In quale provincia presenterete la domanda? (facoltativo)" (testID wizard-prov-input) con esito verde (nuovo iter attivo) o blu (dal 2027); risposta salvata nel report
- RISULTATI: NextStepsSection accetta provincia/nuovoIter e mostra banner verde "Iter semplificato 2027 attivo a X" (testID iter-2027-banner) — salta domanda amministrativa
- SENTINELLA RIFORMA: sentinel.py _check_riforma (web_search su elenco province+data regime, tipo:"riforma", niente auto-apply: solo bottone "Ho preso nota" → esito ignorato/"presa in carico"); i result importi hanno ora tipo:"importo"
- SUCCESSO REALE: primo check ha trovato che mancava BOLZANO nella 3ª fase → aggiunto a seed+DB (ora 60 territori, allineati a INPS)
- Verificato E2E: wizard (Genova verde, Napoli blu, La Spezia→banner nei risultati), sentinella card riforma con presa in carico

## Iterazione 21 (Giugno 2026) — Bottone caffè → Stripe Payment Link reale
- Utente ha fornito chiavi Stripe LIVE proprie (pk/sk in chat) — usate UNA TANTUM via API per creare: prodotto "Offrici un caffè ☕ · TutelApp", prezzo a importo libero (preset €3, min €1, max €50), payment link https://buy.stripe.com/fZu00k5s759GgXs3hP3gk00
- COFFEE_URL in index.tsx aggiornato (prima era buymeacoffee 404) — link verificato HTTP 200
- La sk_live NON è salvata in codice/.env; consigliato all'utente di ruotarla per sicurezza (condivisa in chat)
- NOTA: la Cassaforte resta gratuita (Stripe Emergent test dormiente, indipendente da questo link)

## Import da GitHub (Giugno 2026)
- Progetto TutelApp importato dal repository pubblico https://github.com/appleila12-ai/Salute nel nuovo ambiente Emergent
- Ripristinati backend (server.py, app_content.py, sentinel.py, static/), frontend completo (app/, src/, constants/, assets/), memory/, scripts/, design_guidelines.json
- .env protetti preservati (MONGO_URL, EXPO_PACKAGER_*); aggiunta EMERGENT_LLM_KEY per AI (Claude assistant + Sentinella) e STRIPE_API_KEY vuota (Cassaforte gratuita)
- Verificato: home renderizza (logo scudo, hero, Riforma 2027, percorso), /api/content seed importi 2026 OK, /api/assistant risponde con Claude in italiano, /api/auth/me risponde "Non autenticato" (Google Auth Emergent-managed)
- Google login (richiesta utente) già presente e attivo via auth.emergentagent.com

## Iterazione 22 (Giugno 2026) — Pilastro 3: Tracker della pratica (white-label)
- CONTESTO: evoluzione verso app white-label per Comuni su 4 pilastri (1 Navigatore Transizione, 2 Costruttore Progetto di Vita, 3 Tracker pratica, 4 Modulo Connessione Comune). Iniziato dal Pilastro 3. Tutto STATICO/teorico, nessun backend/dati reali.
- NUOVA pagina /tracker (app/tracker.tsx): tracker visivo a tappe stile "tracking spedizione" basato sulla Riforma 2027 — 4 tappe: 1) Richiesta inviata, 2) Presa in carico Servizi Sociali, 3) Convocazione UVM, 4) Progetto di Vita attivo. Ogni tappa: icona + titolo + descrizione di una riga in linguaggio semplice/rassicurante
- Stati: completate (check verde), in corso (nodo ambra con animazione pulsante reanimated + badge "In corso" + box "Prossimo passo consigliato"), future (grigie/disattivate). Dati statici: utente a metà percorso, tappe 1-2 completate, tappa 3 (UVM) in corso, tappa 4 futura. Nessuna barra di avanzamento (scelta utente)
- Interazione: l'utente può aggiungere Data (GG/MM/AAAA) e Nota a ogni tappa, salvate SOLO sul dispositivo (storage key tutelapp:tracker); date demo pre-compilate su tappe 1-2
- WHITE-LABEL: nuovo file src/config/comune.ts (UNICO file da modificare per rivendere ad altri Comuni): nome, logo (logoUri con segnaposto icona), ente Servizi Sociali, recapiti (tel/email/sede/orari/web), tema colori caldi. Card Comune "in prima linea" in cima al tracker con logo + nome + Chiama/Email/Sede tappabili. Comune pilota = Comune di Sarzana
- Stile: palette calda/rassicurante (crema #FFFBF5, ambra #D97706) non fredda/istituzionale, coerente col resto app; tastiera gestita con react-native-keyboard-controller (KeyboardProvider in _layout + KeyboardAwareScrollView)
- Home: nuova card ambra "Segui la tua pratica" (testID home-tracker-link) sotto "Inizia il percorso" → /tracker
- Verificato E2E via screenshot: home card, tracker (comune in prima linea, timeline stati, nodo pulsante, prossimo passo, tappa futura grigia, editor data/nota, nota rassicurante)
- BACKLOG: Pilastro 1 (Navigatore Transizione), Pilastro 2 (Costruttore Progetto di Vita), Pilastro 4 (Modulo Connessione Comune)

## Iterazione 23 (Giugno 2026) — Tracker: avvisi/promemoria rassicuranti + campanella
- DATI REALI COMUNE PILOTA: src/config/comune.ts aggiornato con i contatti ufficiali dei Servizi Sociali di Sarzana (ricerca web): Servizi Sociali e Welfare, Piazza Don Ricchetti 19038 Sarzana (SP), tel 0187 614456, email servizi.sociali@comune.sarzana.sp.it, orari Lun–Ven 9:00–12:30 · Gio 14:30–16:30
- ATTESA STIMATA (tappa in corso): card blu con tempo stimato "La Convocazione UVM arriva di solito entro 30–45 giorni" + messaggio di rassicurazione se ci si avvicina alla scadenza (testID tracker-wait-card)
- AZIONE UTENTE (tono amichevole, non allarmante): card "Un piccolo passo per te" con prossimo documento da preparare (verbale ASL + documento d'identità), tono rassicurante (testID tracker-action-card)
- CAMPANELLA NOTIFICHE: icona campanella nell'header del tracker con badge rosso conteggio non letti (testID tracker-bell-btn/-badge) → apre pannello (Modal bottom-sheet) con 3 avvisi statici coerenti (Presa in carico completata ✓ / Convocazione UVM in arrivo / Puoi già prepararti), toni ok/info/action, timestamp; stato "letto" persistito (storage tutelapp:tracker:notifsRead) → badge sparisce dopo lettura
- HOME: campanella con pallino rosso sulla card "Segui la tua pratica" (testID home-tracker-badge) che riflette lo stato non letto (letto/non letto letto da storage su focus)
- Nessuna notifica push reale: tutto resta dentro la UI (footer esplicito nel pannello)
- Dati statici coerenti con utente esempio (tappa 2 completata, tappa 3 in corso)
- Verificato E2E via screenshot: header con badge 3, card attesa+rassicurazione, azione amichevole, pannello avvisi, card home con campanella

## Iterazione 24 (Giugno 2026) — BUG FIX Expo Go + refactor totale Riforma 2027
- BUG "anteprima non corretta" su Expo Go: causato da react-native-keyboard-controller (modulo nativo NON supportato in Expo Go) avvolto nel root _layout → crash intera app. RIMOSSO il pacchetto e KeyboardProvider; tracker.tsx ora usa KeyboardAvoidingView + ScrollView nativi (compatibili Expo Go). Verificato: app carica di nuovo.
- REFACTOR Riforma 2027 (richiesta utente: togliere la "vecchia modalità", app attiva dal 2027 con tutte le province riformate):
  - RIMOSSO ovunque la transizione per province/fasi/salvaguardia-branching: wizard (input provincia + nota riforma), NextStepsSection (iter-2027-banner + props provincia/nuovoIter), risultati (DeadlineCard regola 90 giorni), reports.ts (Answers.provincia/nuovoIter)
  - /riforma riscritta come "Come funziona" (rimossa verifica provincia + conteggio territori); mostra intro + cosaCambia + salvaguardia
  - content.ts NEXT_STEPS + CERT_EXPLAINER riscritti secondo la riforma: certificato avvia da solo la valutazione unica INPS (invalidità + disabilità insieme), verbale unico con livello di sostegno, valutazione multidimensionale UVM → Progetto di Vita; niente più "90 giorni/domanda telematica/Commissione ASL"
  - Home: banner "Novità · Riforma 2027 / verifica provincia" → "Come funziona · Riforma 2027"; tagline e descrizione aggiornate alla riforma
  - PDF (buildReportHtml): warn e sezione "Dove chiedere aiuto" riscritti (no 90 giorni)
  - Backend app_content.py: blocco riforma senza 'fasi', intro "in tutta Italia dal 2027"; FAQ e glossario riscritti (verbale unico, Valutazione di Base, UVM/Progetto di Vita). remoteContent.ts: Riforma.fasi ora opzionale
  - MIGRAZIONE Mongo doc live eseguita ($set riforma/faq/glossario, niente fasi)
- TESTING AGENT: backend 8/8 + frontend 7/7 PASSED (nuovo test_riforma_2027.py). Note non bloccanti: warning deprecation shadow* su RN Web; alcuni StyleSheet keys morti da potare in futuro; DeadlineCard.tsx resta file non importato

## Iterazione 25 (Giugno 2026) — Upgrade Expo SDK 54 → 57
- Eseguito via skill expo-version-upgrade: `expo install expo@latest` + `expo install --fix` → expo 57.0.20, react-native 0.86.3, react 19.2.3, reanimated 4.5.1, expo-router 57
- BREAKING SDK 55: rimossi `newArchEnabled` e `android.edgeToEdgeEnabled` da app.json
- BREAKING SDK 56: migrazione icone @expo/vector-icons → @react-native-vector-icons/ionicons (solo Ionicons, 24 file): import `{ Ionicons } from "@expo/vector-icons"` → `Ionicons from "@react-native-vector-icons/ionicons"`; plugin config aggiunto automaticamente in app.json
- use-icon-fonts.ts riscritto: carica il font 'Ionicons' dal CDN @react-native-vector-icons/ionicons@13.1.3 solo su Expo Go (StoreClient); nativo/web via autolink. Preservata la logica di prewarming in _layout.tsx
- Fix lint (eslint-config-expo 57 più severo): escape apostrofi in importi.tsx e patronati.tsx
- expo-doctor: 20/20 passati. TESTING AGENT: backend 8/8 + frontend 7/7 PASSED (iteration_9); icone confermate renderizzate (document.fonts Ionicons loaded, nessun tofu)
- Note non bloccanti: warning deprecation RN Web shadow*/textShadow* (cosmetici)

## Iterazione 26 (Giugno 2026) — Nuova identità visiva calda + ristrutturazione Home
- NUOVA PALETTE (via token centrali src/theme.ts, propagata a tutte le schermate):
  - background pagina avorio #EDE6D8, card/surface #FBF7EF, testo primario #332F26, secondario #79746A
  - brand/identità terracotta #C1602F (gradiente #E08A5C→#8A3F1A), accento ambra/senape #E3A94A (scuro #A86F1F) per bottoni/badge/stato "in corso"
  - stati: verde completato, ambra in corso, grigio da iniziare; border card 0.5px #E6DDC9; radius 14-16
  - tipografia: titoli serif (fonts.serif = Georgia/serif di sistema, editoriale), corpo sans di sistema
  - sfondo pagina impostato su colors.background in 12 schermate (root safe); tracker cream=#EDE6D8
- BRAND: nuovo componente BrandShield (Brand.tsx) — scudo terracotta con gradiente LinearGradient + luce riflessa + icona shield-checkmark; Wordmark ora serif
- RISTRUTTURAZIONE HOME (richiesta utente):
  - index.tsx ora è WELCOME minimale: solo scudo brand + wordmark serif + disclaimer caldo + CTA ambra 'Inizia il percorso' (welcome-start-btn) → /hub
  - Creato app/hub.tsx = ex contenuto home (regione, banner Riforma, percorso, Inizia valutazione, tracker, contatti, faq, importi, storico) con hub-back-btn per tornare al welcome
  - RIMOSSO completamente il box 'buy me a coffee' (supportBox/coffee)
  - Colori hardcoded blu/viola dell'hub riallineati a caldi (terracotta/ambra)
- Serif applicato ai titoli header di riforma/tracker/risultati/importi/faq/checklist/patronati/contatti/territorio
- TESTING AGENT iteration_10: backend 8/8 + frontend 100% PASS (welcome, hub, wizard→risultati, tracker, tutte le pagine). Non bloccanti: warning shadow* RN-Web; StyleSheet keys coffee residue in hub.tsx (pulizia opzionale)
- NOTA: Pilastro 2 (Progetto di Vita) richiesto ma messo in pausa a favore di questo redesign; resta nel backlog

## Iterazione 27 (Giugno 2026) — Nuova Home a 4 pilastri + Pilastro 2 + sfondo chiaro
- HOME (index.tsx) riscritta: BrandShield (scudo terracotta originale, NON modificato) + wordmark serif; banner illustrato con claim "Nessuno dovrebbe orientarsi da solo."; titolo/testo di benvenuto; card "Novità · Riforma 2027" (badge ambra, → /riforma); griglia 2x2 con le 4 sezioni: "Dove mi trovo" → /hub, "Il mio Progetto di Vita" → /progetto, "La mia pratica" → /tracker, "Punti di supporto" → /contatti (testID home-card-*)
- PILASTRO 2 COSTRUITO: src/lib/progetto.ts (6 aree di vita: casa, salute, relazioni, lavoro/formazione, tempo libero, autonomia; 4 suggerimenti per area + testo libero; storage locale tutelapp:progetto; buildProgettoHtml) + app/progetto.tsx (accordion aree, chip selezionabili, nome facoltativo, contatore desideri, CTA "Crea il riepilogo PDF" via expo-print/sharing con intestazione Comune). Nessuna riscrittura AI. Link anche dal tracker (tracker-progetto-link)
- HUB: hero/wordmark/desc sostituiti da titolo serif "Dove mi trovo"; puliti gli style morti (coffee/support/hero)
- SFONDO PIÙ CHIARO (richiesta utente: #EDE6D8 troppo scuro → avorio chiaro e caldo, mai grigio): background #F7F3EA, surface #FFFDF9, surfaceSecondary #F5EFE3, border #E9E1D2; comune.theme.cream allineato
- SERIF esteso alle schermate rimaste: valutazione (domanda), sentinella (header), payment-success (titolo)
- PATRONATI RIMOSSI da tutte le schermate: entry-card nei risultati, gruppo "PATRONATI (GRATUITI)" in /contatti, blocco patronato nel PDF; eliminati app/patronati.tsx, PatronatiSection.tsx, data/patronati.ts, IMAGES.patronati
- RIFERIMENTI RIFORMA OBSOLETA rimossi (sperimentazione/province/2026): prompt AI backend, prompt e nome check Sentinella riforma, testo intro sentinella, fonteUrl INPS (seed + doc Mongo → dossier riforma generale)
- RIPETIZIONI: rimosso il doppio "passo dopo passo" nei titoli consecutivi del PDF report
- Su richiesta utente NESSUN testing agent eseguito; verificato solo con screenshot (home, progetto, contatti)

## Iterazione 28 — Logo terracotta + icone outline (commit 2ed9eb8)
- LOGO: ricreato il mark ufficiale (scudo intrecciato dell'immagine utente) ricolorato in terracotta con gradiente #E08A5C→#8A3F1A, PNG trasparente 512px in backend/static/brand/mark.png (+ copia in assets/images/brand). Brand.tsx: Logo = immagine senza box bianco; BrandShield = stesso mark (rimosso lo scudo Ionicons su gradiente). URL con ?v=terracotta per cache
- ICONE: convertite a variante "-outline" (stile riferimento utente) in tutta l'app; esclusi chevron/arrow/checkmark/close/logo-*
- REGOLA UTENTE: niente script bash / sostituzioni in blocco sui sorgenti; un file alla volta con gli strumenti di editing, verificare compilazione, poi commit. Niente test automatici, niente nuove funzionalità
- Stile di riferimento (mood.webp) ancora da completare: colori/radius/ombre del tema e hero Home a gradiente terracotta — da fare file per file

## Iterazione 29 — Fix errori di compilazione (commit a294848)
- Utente: errore all'apertura su Expo Go. `npx tsc --noEmit` dava 17 errori: `keyof typeof Ionicons.glyphMap` (non esiste in @react-native-vector-icons) e `StyleSheet.absoluteFillObject` (rimosso in RN 0.86)
- Fix, un file alla volta: tipo `IoniconsIconName` (export del pacchetto) in tracker.tsx, contatti.tsx, lib/progetto.ts, lib/territorio.ts, RightsSectionCard.tsx; `StyleSheet.absoluteFill` in index.tsx, risultati/[id].tsx, territorio.tsx
- Risultato: tsc 0 errori, bundle iOS/Android 200. Smoke test minimo (iteration_11) PASS

## Iterazione 30 — Consolidamento "Come funziona" → "Dove mi trovo", filtri, Primi passi
- ELIMINATA app/riforma.tsx. Contenuti (cosa cambia, salvaguardia, fonte) spostati in hub.tsx ("Dove mi trovo"), caricati da loadAppContent(). Link Home "Novità · Riforma 2027" e LivelliSection → /hub
- HUB: domanda filtro "Hai già un verbale…?" Sì/No (storage tutelapp:hub:verbale). SÌ → card ok + due strade (SISDA online con SPID/CIE/CNS; ATS in forma libera) + bottone portale INPS (SISDA_URL) + rimando /progetto. NO → info "prima serve il riconoscimento" + regione + GuideStepsCard + "Inizia il percorso". Poi per entrambi: "Cosa cambia", salvaguardia, fonte, card FAQ/Importi, accordion "Questa guida fa per te?" (testo esatto utente: INAIL / causa di servizio). Rimosse card "Segui la tua pratica" e "Contatti Utili" dall'hub
- CONTATTI (= "Punti di supporto"): header rinominato, blocco "Contatti Utili" in testa, nuovo gruppo "Servizi del Comune di Sarzana": Segretariato Sociale, Sportello CAAD, SAD, Sportello Amministratore di Sostegno
- PROGETTO: avviso in cima (non sostituisce domanda SISDA né colloquio ATS)
- NextStepsSection: nota cecità/sordità civile sotto la tabella percentuali invalidità
- HOME: domanda a 3 risposte dopo il banner (storage tutelapp:home:riconoscimento). "Sì" → Home invariata; altre → sezione "Primi passi dopo una diagnosi" (accordion: Esenzione ticket con link ASL5; Congedo per malattia con link INPS; Sportello sociale Comune con tel; Punti di supporto → /contatti) + intro "Se in futuro…" prima delle 4 sezioni
- Nessun test automatico (richiesta utente); verificato con tsc + screenshot

## Iterazioni 31-33 — Navigazione a schermate, stile soffuso, logo bicolore (commit 9bf161a, be55b2a)
- NAVIGAZIONE: hub torna a bottoni che aprono pagine: /riforma ripristinata ("Cosa cambia con la riforma"), nuova /attiva-progetto (SISDA/ATS + bottone INPS + rimando /progetto), nuova /percorso (info, regione, GuideStepsCard, Inizia il percorso). In hub restano: filtro Sì/No, 3 bottoni, FAQ/Importi, area "Account e impostazioni" (regione + accesso Google, spostati fuori dalla top bar), accordion guida
- STILE: theme.ts → background #EDE6D8, surface #F7F2E9, brandPrimary #C1602F, accent #E3A94A, TUTTI i token testo = #332F26 (onSurface*, muted, onAccent, accentDark, onBrand*, topics.dark); stati attenuati; spacing md14/lg20/xl28/xxl40; radius lg 20. Colori testo hardcoded sostituiti in hub.tsx e tracker.tsx (restano da fare: progetto, valutazione, territorio, risultati, checklist, DeadlineCard, AppealSection, VerbaleSection, VaultSection, NextStepsSection). Banner Home = pannello brandSecondary con solo claim (niente foto, niente icona)
- LOGO: mark.png bicolore #C1602F + #F1DDCB (ricolorazione della forma originale), cache-buster ?v=duotone in Brand.tsx
- CONTATTI: recapiti reali verificati — Segretariato/SAD 0187 614454 (servizi.sociali@comune.sarzana.sp.it, pagina SAD ufficiale); CAAD → riferimento provinciale Punto Servizi Disabilità La Spezia, via Gramsci 211, 0187 702556 Lun–Ven 8:30–12:30 (nessuno sportello CAAD specifico a Sarzana trovato); Amministratore di Sostegno → Tribunale della Spezia, Volontaria Giurisdizione 0187 595403/595410, Lun–Sab 12:00–13:30

- HOME (sess. corrente): immagine hero (assets/images/brand/hero.jpg, foto bosco fornita dall'utente, ritagliata dallo screenshot) sotto il pannello claim, larga quanto le card, proporzioni originali 604x474, velo ivory/terracotta via MonoImage (tint aggiornato, fix fill su web). 'Dove mi trovo' rinominato 'Orientarsi insieme' ovunque (index, hub, SezioniBar, LivelliSection). Card 'Orientarsi insieme' aggiunta in /primi-passi. Flusso domanda: Sì→/hub, Non ancora/Non rispondo→/primi-passi.

- RISTRUTTURAZIONE (sess. corrente): HOME = logo+claim+immagine, card 'La mia pratica', bottone 'Orientarsi insieme' (/hub), bottone 'Le domande sulla 104' (/domande-104, nuova pagina con AssistantCard, answers opzionali). Rimossi da Home: card riforma, domanda filtro, testo benvenuto, griglia, disclaimer. HUB = domanda 'In che momento sei?' (diagnosi→/primi-passi, iter→/tracker, diritti→ultimo /risultati/id oppure /valutazione; key tutelapp:hub:momento), griglia 4 sezioni (Progetto, Pratica, Primi passi, Supporto), poi bottoni sempre visibili Attiva Progetto/Percorso/Riforma + FAQ/Importi; SezioniBar rimossa dal hub. PROGETTO: tutte le aree sempre aperte (niente accordion). CHECKLIST: app/checklist.tsx eliminata + link rimosso da risultati. CASSAFORTE (VaultSection, report opzionale) spostata in tracker; rimossa da risultati. RISULTATI: riepilogo PDF subito dopo 'Aiuti pratici sul territorio', poi Assistente e Ricorso.
- 'Come attivare il Progetto di Vita' spostata dentro /progetto come sezione (src/components/AttivaProgettoSection.tsx); app/attiva-progetto.tsx eliminata e bottone rimosso dal hub.
- 'Ho appena ricevuto una diagnosi' → /percorso. Questionario valutazione estratto in src/components/QuestionarioValutazione.tsx (tutte le domande su una schermata + CTA 'Vedi i tuoi diritti' → router.push /risultati/id); usato in /percorso (al posto del bottone 'Inizia il percorso') e in /valutazione (wrapper singola pagina, niente step). Aggiunto tasto Indietro (results-back-btn, canGoBack ? back : replace('/')) in /risultati, Home spostata a destra.
- TRACKER REALE: rimossi dati demo (DEMO/CURRENT_INDEX/NOTIFICATIONS statici). Entry = {date, note, done}; tappa in corso = prima non completata; bottone "Tappa completata/Riapri tappa" nell'editor; scadenza attesa calcolata dalla data della tappa precedente (attesaGiorni 30/45); notifiche generate dallo stato (buildNotifications), badge letto tramite firma. Sync cloud per utente: campo `tracker` aggiunto a CloudBundle (frontend), a readLocalBundle/writeLocalBundle (key tutelapp:tracker) e a SyncPayload/SyncDownload + db.user_data (backend).
- PATRONATO: rimossa la parola da tutti i testi frontend (risultati, faq, territorio PDF, reports PDF, NextSteps, Appeal, Assistant) e backend (app_content seed, prompt assistente, fallback). GET /api/content ora sovrascrive sempre il documento Mongo con il seed del codice.
