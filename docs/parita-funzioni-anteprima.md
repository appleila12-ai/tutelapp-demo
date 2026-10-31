# Conservare le funzioni esistenti nella proposta

Vincolo dell’utente, 31 ottobre 2026: tutte le funzioni della versione online devono restare comprese nella proposta e nell’anteprima. Le migliorie e INAIL si aggiungono a TutelApp; non sostituiscono l’app con un prodotto ridotto. L’ingresso resta dal Comune, senza login obbligatorio per i cittadini.

Questa mappa è ricavata dal codice disponibile di tutelapp-demo. Non certifica la completezza rispetto al deployment: alcuni moduli importati mancano, e il comportamento della produzione non è stato collaudato. Ogni funzione va confrontata con la versione effettivamente pubblicata prima di dichiarare raggiunta la parità.

| Funzione da conservare | Sorgenti individuati | Stato nell’anteprima estesa |
| --- | --- | --- |
| Scelta Comune, cambiamento e link dedicati | app/comuni.tsx, app/[comune].tsx, src/config/comune.ts | Scelta locale di prova; configurazioni, link e sottodomini non replicati tecnicamente |
| Home del Comune, orientamento e storico | app/index.tsx, app/hub.tsx, app/cittadino.tsx | Navigazione rappresentata; storico persistente non collegato |
| Primo orientamento dopo la diagnosi | app/primi-passi.tsx | Scelta locale, passo e pausa; senza referto |
| Percorso per riconoscimento e Regione | app/percorso.tsx | Percorso rappresentato, selezione Regione locale; iter corrente da verificare |
| Questionario | app/valutazione.tsx, src/components/QuestionarioValutazione.tsx | Campi di esempio e validazione locale, accesso senza questionario al catalogo |
| Risultati, diritti e prossimo passo | app/risultati/[id].tsx | Riepilogo locale; motore originale mancante non ricostruito come affidabile |
| Verbale, livelli, azioni dopo verbale | componenti importati dalla pagina risultati, dati contenuti | Funzioni rappresentate; i componenti originali assenti restano da recuperare |
| Riesame e ricorso | AppealSection importato nei risultati | Funzione rappresentata, senza calcolare termini o accertamenti |
| Costruttore del Progetto di Vita | app/progetto.tsx | Compilazione di prova su sei aree, riepilogo ed esportazione testuale locale |
| Attivazione del Progetto con i servizi | AttivaProgettoSection importato in app/progetto.tsx | Passaggio rappresentato; nessuna istanza inviata |
| Pratica con tappe, date e note | app/tracker.tsx | Controlli modificabili nella sessione, senza sincronizzazione con enti |
| Avvisi e promemoria interni | app/tracker.tsx | Avvisi di prova basati sulle tappe; niente notifiche push |
| Cassaforte, acquisizione, apertura, rimozione e condivisione file | src/components/VaultSection.tsx | Elenco titoli di prova aggiungibili/rimuovibili; acquisizione e file reali non collegati |
| PDF report, progetto e guida territoriale | risultati, progetto e territorio | Funzioni da conservare; esportazione PDF nativa non collegata, non dichiarata riuscita |
| Condivisione report e QR | risultati, ShareModal, libreria reports | Funzioni rappresentate; nessun link pubblico o servizio QR remoto attivato |
| Territorio: trasporti, domicilio, riabilitazione, RSA, patronati | app/territorio.tsx | Categorie esplorabili; dettaglio locale e guida originale da collaudare |
| Contatti: telefono, email, sito, indirizzo, orari, mappa | home, contatti e schede dei Comuni | Punti di accesso rappresentati; contatti specifici non presentati come appena verificati |
| Località/frazioni o Comuni appartenenti a Unioni | PaeseCard e configurazioni paesi | Da conservare: selettore configurato non replicato nell’anteprima |
| FAQ e glossario | app/faq.tsx, contenuti-base.json | Esempi orientativi; intero contenuto originale da verificare e riallineare |
| Importi, limiti economici e fonte | app/importi.tsx, contenuti-base.json, backend/app_content.py | Struttura presente; cifre divergenti non dichiarate aggiornate |
| Riforma, cambiamenti e tutele esistenti | app/riforma.tsx | Informazioni di orientamento, link governativo; procedure e contenuti da collaudare |
| Assistente sulla 104 e contesto del report | app/domande-104.tsx, AssistantCard, backend/server.py | Preparazione domanda senza invio; modello AI non collegato |
| Cruscotto operatori e dati aggregati | app/cruscotto.tsx, backend/statistiche.py | Funzione rappresentata, nessun dato reale o numero sintetico spacciato per statistica |
| Sentinella: controllo, discrepanze, applica/ignora | app/sentinella.tsx, backend/sentinel.py | Funzione rappresentata; nessuna chiamata, spesa o aggiornamento reale |
| Catalogo comune e vista INAIL | app/benefici.tsx, app/inail.tsx | Dodici schede navigabili condivise con fonti e condizioni da verificare |

## Criterio di completamento

La presenza di una schermata o di una voce di menu non equivale alla funzione operativa. La parità completa richiede recupero dei moduli originali compatibili, build e prova dei flussi su una versione privata prima del rilascio. Non rimuovere una funzione solo perché non riprodotta nell’anteprima; segnalarla come mancante fino al collaudo.

Le funzioni remote devono restare facoltative per i cittadini e richiedono informazioni chiare sui dati trasmessi. La protezione dell’area operatori è separata e non obbliga il cittadino a creare un account.
