# TutelApp multi-Comune (white-label)

Un'unica app che serve più Comuni. Ogni Comune ha il suo link, il suo stemma, i suoi colori, i suoi contatti e i suoi punti di supporto. I dati dei cittadini restano separati per Comune.

## I link dedicati

| Comune | Link | Alternativa |
|---|---|---|
| Sarzana | `<indirizzo-app>/sarzana` | `<indirizzo-app>/?comune=sarzana` |
| Erba (CO) | `<indirizzo-app>/erba` | `<indirizzo-app>/?comune=erba` |
| Unione Collinare Vigne e Vini (AT) | `<indirizzo-app>/vigne-e-vini` | `<indirizzo-app>/?comune=vigne-e-vini` |
| Ventimiglia (IM) | `<indirizzo-app>/ventimiglia` | `<indirizzo-app>/?comune=ventimiglia` |
| Mediglia (MI) | `<indirizzo-app>/mediglia` | `<indirizzo-app>/?comune=mediglia` |

**Comuni dimostrativi (20):** Lerici, Chiavari, Alba, Pinerolo, Lecco, Bassano del Grappa, Castelfranco Veneto, Rovereto, Carpi, Imola, Pontedera, Empoli, Frascati, Civitavecchia, Fano, Città di Castello, Battipaglia, Monopoli, Marsala, Olbia. Stanno in `frontend/src/config/comuni/demo/`, link `<indirizzo-app>/<slug>` (es. `/lerici`, `/citta-di-castello`). Sono enti reali che **non hanno aderito**: la pagina iniziale mostra "Versione dimostrativa" con l'avviso, la scritta "In collaborazione con" diventa "Esempio per", l'elenco li segna "demo" e l'anteprima WhatsApp dice "(versione dimostrativa)". I recapiti vengono dai siti ufficiali (settembre 2026) e vanno riverificati. Nessuno stemma ufficiale.
- Per nasconderli (es. nella versione ufficiale): variabile `EXPO_PUBLIC_COMUNI_DEMO=no` su Netlify.
- Quando uno aderisce: sposta il file da `demo/` a `comuni/`, togli `dimostrativo: true`, aggiungilo a `COMUNI_ADERENTI` in `comuni/index.ts` e toglilo da `demo/index.ts`.

Funziona anche con un sottodominio (`erba.tutelapp.it`) quando ci sarà un dominio proprio.
**Primo accesso:** con il link semplice (senza Comune) l'app apre "Benvenuto in TutelApp" con la ricerca del Comune; con il link dedicato va dritta al Comune. L'app ricorda l'ultimo Comune scelto. In fondo alla pagina iniziale c'è "Scegli il tuo Comune" (pagina `/comuni`), utile anche nelle demo.
La pagina `/comuni` ha una ricerca (nome, provincia, regione, anche i paesi delle Unioni) e raggruppa gli enti per regione: pensata per centinaia di Comuni.

**Anteprima su WhatsApp/email:** ogni link mostra "TutelApp · Comune di …" con un'immagine nei colori del Comune (`frontend/public/og/<slug>.png`). Le pagine di anteprima vengono create da `yarn build`. Per un nuovo Comune basta aggiungere la sua immagine 1200×630 in `public/og/`; se manca, viene usata quella generica.

## Aggiungere un nuovo Comune

1. In `frontend/src/config/comuni/` copia `_modello.ts` (es. `lerici.ts`) e compila i campi.
2. Aggiungilo all'elenco in `frontend/src/config/comuni/index.ts`.
3. Stemma: metti il file in `frontend/assets/images/comuni/` e scrivi `logo: require("@/assets/images/comuni/lerici.png")`.
   Senza logo l'app mostra uno stemma provvisorio con l'iniziale.

Non serve cambiare nessun'altra pagina.

## Cosa cambia per ogni Comune

- **Pagina iniziale**: stemma (piccolo, accanto al nome) e nome del Comune in alto, colori dell'ente, contatti dei Servizi Sociali. Per le Unioni compare anche l'elenco dei Comuni aderenti.
- **La mia pratica**: scheda dell'ente che segue la pratica (chiama, email, sede, orari).
- **Punti di supporto**: i servizi del territorio presi dalla scheda del Comune.
- **Primi passi**: sportello sociale e ASL/ATS per l'esenzione ticket.
- **Regione predefinita** (diritti, aiuti sul territorio) e riferimento per il trasporto sociale.
- **PDF del Progetto di Vita**: "Da consegnare a" riporta l'ente giusto (e, per le Unioni, il Comune di residenza).
- **Unioni di Comuni**: il cittadino sceglie "In quale Comune abiti?" e ritrova telefono, email e sito del suo municipio in Home e in Punti di supporto. I recapiti sono nel campo `paesi` della scheda.

## Dati separati per Comune

- **Sul telefono/browser**: pratica, Progetto di Vita, valutazioni, documenti e regione vengono salvati a parte per ogni Comune. Sarzana usa le stesse chiavi di prima, quindi chi usa già l'app non perde niente.
- **Nessun account e nessun cloud**: i dati personali (pratica, Progetto di Vita, documenti) restano solo sul dispositivo del cittadino. Sul server arrivano solo le statistiche anonime.

## Da verificare prima dei piloti

I dati di **Erba**, **Vigne e Vini**, **Ventimiglia** e **Mediglia** vengono dai siti ufficiali (settembre 2026) e hanno `daVerificare: true`:

- **Erba**: orari dello sportello, responsabile di riferimento, eventuali servizi dedicati alla disabilità, link ATS per le esenzioni.
- **Vigne e Vini**: per Cortiglione mancano telefono e indirizzo del municipio (c'è solo il sito). Come contatto principale c'è il Consorzio C.I.S.A. Asti Sud, che gestisce i servizi sociali del territorio. Va confermato con l'Unione chi debba essere il riferimento, e con quali orari.
- **Ventimiglia**: sul sito non c'è un'email ordinaria dei Servizi Sociali, per ora è indicata la PEC del Comune; confermare responsabile e punti di supporto ASL1.
- **Mediglia**: confermare i riferimenti sanitari del territorio (ASST Melegnano e Martesana) e il link ATS per le esenzioni.
- **Stemmi ufficiali**: vanno chiesti ai singoli enti insieme all'autorizzazione a usarli.

## Pubblicazione

- **Frontend**: imposta `SITE_URL` (es. `https://tutelapp.it`) così le immagini di anteprima hanno un indirizzo completo. `netlify.toml` ora gestisce i link diretti (`/erba`, `/tracker`, ...).
  `EXPO_PUBLIC_COMUNE=erba` (facoltativo) fissa un Comune per tutta l'installazione: in quel caso non compare la scelta iniziale.
- **Backend**: basta ridistribuirlo. La migrazione dei dati parte da sola all'avvio.

## Statistiche anonime e cruscotto del Comune

- L'app conta in forma anonima alcune categorie predefinite: in che momento è la persona, la tappa della pratica, le aree e i desideri suggeriti del Progetto di Vita, le risposte del questionario, le sezioni consultate e, per le Unioni, il paese. Non registra mai nomi, testi scritti dalle persone o identificativi. Ogni categoria conta al massimo una volta al mese per dispositivo.
- Il backend salva solo contatori (Comune, mese, categoria), non eventi singoli. I valori da 1 a 4 non vengono mostrati.
- Cruscotto: `<indirizzo-app>/cruscotto`, riservato. Si apre con il codice del Comune, impostato sul backend come `STATS_CODE_<SLUG>` (es. `STATS_CODE_ERBA`) oppure `STATS_CODE_ADMIN` per tutti i Comuni. "Guarda con dati di esempio" funziona senza codice, per le demo.
- In fondo alla pagina iniziale una frase informa i cittadini del conteggio anonimo. Prima del pilota, fai verificare il testo dell'informativa privacy al DPO del Comune.
