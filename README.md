# Vicky Draw v4

Piccola web app offline-first per disegnare nel browser, pensata per bambini e pubblicabile come sito statico.

## Novità v4

- Lettura di una libreria remota controllata da `vicky-draw-library`.
- Cache locale della libreria extra: dopo il primo caricamento, sticker e sfondi restano disponibili anche offline.
- Sticker remoti in SVG spostabili, ridimensionabili e ruotabili.
- Sfondi remoti applicabili al foglio ed esportabili nel PNG.
- Bottone `Aggiorna libreria` nel pannello Sticker/Sfondi.

## Libreria remota

L'app legge:

```txt
https://ma55im0.github.io/vicky-draw-library/library.json
```

Per aggiungere contenuti nuovi, aggiorna il repository `vicky-draw-library`. Non è necessario ripubblicare l'app, salvo modifiche al codice.

## Privacy e sicurezza

- Nessun login.
- Nessun tracciamento.
- Nessuna ricerca libera su internet.
- Nessuna API key nel browser.
- La libreria mostra solo asset elencati nel tuo `library.json`.
- I disegni restano nel browser del dispositivo tramite IndexedDB.

## Uso locale

```bash
python3 -m http.server 5173
```

Poi visita:

```txt
http://localhost:5173
```



## v5
- Ricerca tema tramite API Vercel
- Safety check lato server
- Creazione dinamica di pack sticker/sfondi


## v6
- Adds delete controls for remote/imported packs.
- Text updated for external provider import instead of procedural generation.


## v7 manual library mode
- Removed online/AI generation.
- Added manual upload of stickers and backgrounds into IndexedDB.
- Uploaded assets can be deleted instantly from the UI and work offline on the same device.
