# TutelApp — Funzionalità attualmente implementate

Richiesta: solo elenco testuale, nessuna modifica all'app, nessun codice.

## 1. Home
- Logo TutelApp con claim "Nessuno dovrebbe orientarsi da solo." e immagine (bosco) larga quanto le card, con velo ivory/terracotta.
- Card in evidenza "La mia pratica" (apre il tracker della pratica).
- Bottone "Orientarsi insieme" (ingresso principale al percorso).
- Bottone "Le domande sulla 104" (pagina dedicata all'assistente sulla normativa).

## 2. Orientarsi insieme (navigatore)
- Domanda filtro "In che momento sei?" con tre risposte, memorizzate sul dispositivo:
  - "Ho appena ricevuto una diagnosi" → Il percorso per il riconoscimento.
  - "Sto seguendo un iter" → La mia pratica.
  - "Voglio capire i miei diritti" → ultimo risultato salvato ("I tuoi diritti"), altrimenti il questionario.
- Griglia delle sezioni principali: Il mio Progetto di Vita, La mia pratica, Primi passi dopo una diagnosi, Punti di supporto.
- Bottoni sempre visibili: Il percorso per il riconoscimento, Cosa cambia con la riforma, Domande Frequenti, Importi Aggiornati.
- Area "Impostazioni": scelta della regione (modale con tutte le regioni); nessun account, i dati restano sul dispositivo.
- Box informativo "Questa guida fa per te?" (a scomparsa) e storico delle ultime valutazioni salvate.

## 3. Il percorso per il riconoscimento
- Nota introduttiva, scelta della regione, tappe numerate dalla diagnosi al Progetto di Vita.
- Questionario di valutazione su un'unica schermata (chi ha ricevuto la diagnosi, quando, situazione lavorativa, certificato medico introduttivo) con nota "Buono a sapersi" sulla Riforma 2027 e bottone "Vedi i tuoi diritti".

## 4. I tuoi diritti (risultati)
- Intro personalizzata in base alle risposte.
- Percorso passo-passo (prossimi passi, certificato, possibilità 104/invalidità).
- Sezioni sui diritti: Legge 104, invalidità civile per percentuale, documenti, ecc.
- "Verbale in mano: come attivare i benefici" e sezione sui livelli di disabilità.
- Rimando alla pagina "Aiuti pratici sul territorio".
- Riepilogo completo: download PDF e condivisione con la famiglia (link + QR).
- Assistente AI "Fai una domanda alla Legge 104".
- Sezione ricorso/riesame.
- Tasti Indietro e Home.

## 5. Le domande sulla 104 (assistente AI)
- Domanda libera o suggerimenti rapidi; risposta immediata basata sulla normativa (D.Lgs. 62/2024, L. 104/1992 ecc.), con contesto dall'ultima valutazione se presente.

## 6. Il mio Progetto di Vita (Pilastro 2)
- Avviso "strumento di preparazione, non la domanda ufficiale".
- Nome facoltativo; tutte le aree della vita su un'unica pagina, ciascuna con desideri suggeriti (selezionabili) e campo libero; contatore desideri.
- Salvataggio automatico sul dispositivo.
- Sezione interna "Come attivare il Progetto di Vita": le due strade ufficiali (SISDA online / ATS di persona) e bottone "Vai al portale INPS".
- Bottone fisso "Crea il riepilogo PDF" da portare all'UVM o al Comune.

## 7. La mia pratica (Pilastro 3 — tracker)
- Scheda del Comune (Sarzana): chiama, email, sede su mappa, orari.
- Timeline a 4 tappe (Richiesta inviata, Presa in carico, Convocazione UVM, Progetto di Vita attivo) con stato completata/in corso/futura.
- Per ogni tappa: data e nota personale, bottone "Tappa completata / Riapri tappa"; la tappa in corso avanza automaticamente.
- Tempi di attesa stimati calcolati dalla data della tappa precedente, prossimo passo consigliato, azione utile.
- Avvisi e promemoria in-app generati dallo stato reale (campanella con badge non letti).
- Cassaforte referti: caricamento documenti, salvataggio del PDF del report, apertura ed eliminazione file.
- Ponte verso il Progetto di Vita.
- Dati salvati solo sul dispositivo.

## 8. Primi passi dopo una diagnosi
- Schede a scomparsa: esenzione ticket per patologia, congedo per malattia, sportello sociale del Comune (con chiamata diretta), punti di supporto.
- Card "Orientarsi insieme" per accedere al percorso completo.

## 9. Punti di supporto (contatti)
- Recapiti INPS e servizi reali del Comune di Sarzana (Segretariato/SAD, Punto Servizi Disabilità La Spezia, Amministratore di Sostegno – Tribunale della Spezia), con chiamata, email e link.

## 10. Altre pagine informative
- Cosa cambia con la riforma (D.Lgs. 62/2024): valutazione unica INPS, criteri OMS, Progetto di Vita, tutele per chi ha già un verbale.
- Domande Frequenti e glossario (contenuti dal backend).
- Importi Aggiornati: cifre e limiti di reddito, con "Sentinella" che verifica gli importi INPS sul web.
- Aiuti pratici sul territorio: assistenza domiciliare, trasporti, fisioterapia, RSA e sollievo, filtrati per regione, con guida PDF scaricabile.

## 11. Trasversali
- Barra delle 4 sezioni (Orientarsi insieme, Progetto di Vita, La mia pratica, Supporto) in fondo alle pagine principali.
- Nessun account né sincronizzazione cloud: tutti i dati personali restano sul dispositivo.
- Generazione e condivisione PDF (report diritti, Progetto di Vita, guida territorio).
- Stile uniforme: sfondo avorio, testo unico #332F26, terracotta e ambra, icone outline; configurazione white-label per Comune.
- Backend: contenuti Riforma 2027, assistente AI (Emergent LLM), report condivisibili, Sentinella (protetta da codice), statistiche anonime; cassaforte referti gratuita (nessun pagamento).

## 12. Multi-Comune (white-label)
- Una scheda per Comune in `frontend/src/config/comuni/` (Sarzana, Erba, Unione Collinare Vigne e Vini) con stemma, colori, contatti, punti di supporto, ASL, regione.
- Link dedicati per Comune (`/erba`, `?comune=erba`, sottodominio) e pagina "Scegli il tuo Comune".
- Stemma del Comune nella pagina iniziale e nella scheda della pratica.
- Anteprima dei link (WhatsApp/email) con nome e colori del Comune.
- Per le Unioni: scelta del proprio paese con recapiti del municipio.
- Dati dell'utente separati per Comune sul dispositivo.

## 13. Statistiche anonime per i Comuni
- Conteggi anonimi e aggregati per Comune/mese (nessun dato personale, valori sotto 5 nascosti).
- Cruscotto riservato `/cruscotto` con codice per Comune: persone al mese, momento del percorso, tappe della pratica, aree e desideri del Progetto di Vita, risposte al questionario, sezioni più consultate, paesi dell'Unione. Modalità "dati di esempio" per le demo.
- Rimosso il pagamento Stripe: la cassaforte referti è gratuita per tutti.
