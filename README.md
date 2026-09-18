# Split Selector

Estrattore casuale di circuiti per le sfide a Split/Second tra **Pisto** e **Fatto**, con punteggio e bonus.

Pagina statica senza dipendenze: basta aprire `index.html` nel browser.

## Come si gioca

| Azione | Effetto |
| --- | --- |
| `Invio` | Rullo di tamburi ed estrazione di un circuito (con possibilità di bonus x2 / x3) |
| `Backspace` | Estrazione senza bonus |
| Click sinistro su una card | Assegna il punto a Pisto |
| Click destro su una card | Assegna il punto a Fatto |
| Click su una card già assegnata | Annulla il punto |

Quando tutti i circuiti sono stati assegnati viene proclamato il vincitore. In caso di parità si azzera il punteggio e si estrae un circuito di spareggio: vince chi segna per primo.

## Struttura

- `index.html` – markup, elenco dei circuiti e audio
- `css/style.css` – stili (griglia fluida che si adatta allo schermo, stati delle card, bonus, schermata vincitore)
- `js/data.js` – percentuali per circuito (mostrate sulla card estratta)
- `js/main.js` – logica di gioco
