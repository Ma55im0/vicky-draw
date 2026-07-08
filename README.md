# Vicky Draw

Piccola web app offline-first per disegnare nel browser.

## Funzioni

- Disegno con mouse, dito o penna.
- Tratto continuo anche quando si disegna velocemente.
- Colori, dimensione tratto e gomma.
- Sticker ricercabili, spostabili e ridimensionabili.
- Sfondi ricercabili e applicabili al foglio.
- Zoom in/out, reset zoom e modalità Sposta per muovere la board; su mobile in modalità Sposta funziona anche il pinch-to-zoom.
- Undo e redo anche su sticker e sfondi.
- Salvataggio automatico locale.
- Galleria locale con apertura/eliminazione dei disegni.
- Export PNG con disegno, sticker e sfondo.
- PWA installabile e utilizzabile offline dopo il primo caricamento.

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
