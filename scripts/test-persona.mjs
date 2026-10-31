import assert from 'node:assert/strict';
import {aggiornaPersonaSession, azzeraPersonaSession, getPersonaSession, nomePerModulo, subscribePersonaSession} from '../src/state/personaSession.ts';
azzeraPersonaSession();
aggiornaPersonaSession({nome:' Anna ',cognome:'D’Amico',destinatario:'me'});
assert.equal(nomePerModulo(),'Anna D’Amico');
aggiornaPersonaSession({destinatario:'altra'});
assert.equal(nomePerModulo(),''); // Non usare il nome del caregiver come beneficiario.
assert.equal(getPersonaSession().nome,' Anna ');
let notifications=0;const unsubscribe=subscribePersonaSession(()=>notifications++);
aggiornaPersonaSession({nome:'Éléonore'});assert.equal(notifications,1);
unsubscribe();azzeraPersonaSession();assert.equal(notifications,1);
assert.deepEqual(getPersonaSession(),{nome:'',cognome:'',destinatario:null});
console.log('PASS: nome completo, distinzione beneficiario/caregiver, aggiornamento condiviso e cancellazione sessione');
