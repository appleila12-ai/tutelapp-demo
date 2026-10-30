# TutelApp: utilizzo senza account

Vincolo di prodotto confermato il 30 ottobre 2026: le persone devono poter utilizzare TutelApp senza registrazione, account o login. Non introdurre autenticazione obbligatoria per orientamento e percorsi.

## Criteri di implementazione

- Privilegiare elaborazione locale e uso senza salvataggio; rendere facoltativo e trasparente il salvataggio sul dispositivo, con cancellazione accessibile.
- Non inviare automaticamente risposte, diagnosi o referti a server, analytics o fornitori AI. Per funzionalità remote spiegare dati, destinatario e finalità prima della scelta di invio; offrire il percorso essenziale senza AI.
- Non sincronizzare profili sanitari per impostazione predefinita. Eventuali funzioni amministrative devono essere protette separatamente dall'accesso pubblico dei cittadini.
- Non descrivere storage web come cifrato solo perché il metodo si chiama secureSet; verificare l'implementazione reale.
- Non promettere privacy completa o anonimato garantito dalla sola assenza di login. Verificare anche log, identificatori del dispositivo, hosting, richieste di rete e conservazione dei fornitori.

## Verifiche necessarie prima del rilascio

Provare il percorso essenziale in una sessione pulita senza credenziali, ispezionare richieste di rete e dati locali, verificare pausa senza invio, scelta esplicita per servizi remoti e cancellazione. Questi requisiti sono criteri da verificare, non una certificazione della versione attuale.

Il backend attuale espone endpoint legacy per report e assistente remoto; la loro presenza non prova che i flussi siano attivi sul sito, ma richiede verifica prima di dichiarare che tutti i dati restano sul dispositivo. Nel checkout mancano moduli client necessari a completare questa verifica.
