# Vicky Draw

Piccola web app offline-first per disegnare nel browser.

## Funzioni della prima versione

- Disegno con mouse, dito o penna.
- Colori, dimensione tratto e gomma.
- Undo e redo.
- Salvataggio automatico locale.
- Galleria locale con apertura/eliminazione dei disegni.
- Export PNG.
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
