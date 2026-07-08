# Vicky Draw

Piccola web app offline-first per disegnare nel browser, pensata per bambini e pubblicabile come sito statico.

## Funzioni

- Disegno con mouse, dito o penna.
- Tratto continuo anche quando si disegna velocemente.
- Colori, dimensione tratto e gomma.
- Libreria ampliata di sticker ricercabili.
- Sticker spostabili, ridimensionabili e ruotabili.
- Sfondi ricercabili e applicabili al foglio.
- Zoom in/out da 100% a 300%, reset zoom e modalità Sposta; su mobile in modalità Sposta funziona anche il pinch-to-zoom.
- Undo e redo anche su sticker e sfondi.
- Salvataggio automatico locale.
- Galleria locale con apertura/eliminazione dei disegni.
- Export PNG con disegno, sticker ruotati e sfondo.
- PWA installabile e utilizzabile offline dopo il primo caricamento.

## Privacy e sicurezza

- Nessun login.
- Nessuna API esterna.
- Nessun tracciamento.
- Nessuna chiave o token nel codice.
- I disegni restano nel browser del dispositivo tramite IndexedDB.
- La pagina include una Content Security Policy via meta tag, utile come difesa aggiuntiva per una app statica su GitHub Pages.

## Uso locale

Apri la cartella con un piccolo server statico. Esempio:

```bash
python3 -m http.server 5173
```

Poi visita:

```txt
http://localhost:5173
```

## Pubblicazione

Il progetto non richiede build. Puoi pubblicare direttamente questi file su GitHub Pages, Netlify o Vercel.
