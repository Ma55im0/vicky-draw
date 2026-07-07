const canvas = document.querySelector("#drawingCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const brushButton = document.querySelector("#brushButton");
const eraserButton = document.querySelector("#eraserButton");
const colorPicker = document.querySelector("#colorPicker");
const sizePicker = document.querySelector("#sizePicker");
const undoButton = document.querySelector("#undoButton");
const redoButton = document.querySelector("#redoButton");
const saveButton = document.querySelector("#saveButton");
const galleryButton = document.querySelector("#galleryButton");
const exportButton = document.querySelector("#exportButton");
const clearButton = document.querySelector("#clearButton");
const installButton = document.querySelector("#installButton");
const saveStatus = document.querySelector("#saveStatus");
const galleryDialog = document.querySelector("#galleryDialog");
const galleryGrid = document.querySelector("#galleryGrid");
const emptyGallery = document.querySelector("#emptyGallery");

const DB_NAME = "vicky-draw";
const STORE_NAME = "drawings";
const AUTOSAVE_ID = "autosave";
const MAX_HISTORY = 30;

let currentTool = "brush";
let isDrawing = false;
let lastPoint = null;
let undoStack = [];
let redoStack = [];
let autosaveTimer = null;
let deferredInstallPrompt = null;
let hasLoadedAutosave = false;

function setStatus(message) {
  saveStatus.textContent = message;
}

function getPointerPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * window.devicePixelRatio,
    y: (event.clientY - rect.top) * window.devicePixelRatio,
    pressure: event.pressure || 0.5,
  };
}

function configureStroke() {
  ctx.lineWidth = Number(sizePicker.value) * window.devicePixelRatio;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = colorPicker.value;
  ctx.globalCompositeOperation = currentTool === "eraser" ? "destination-out" : "source-over";
}

function resizeCanvas() {
  const previous = document.createElement("canvas");
  previous.width = canvas.width;
  previous.height = canvas.height;

  if (canvas.width && canvas.height) {
    previous.getContext("2d").drawImage(canvas, 0, 0);
  }

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (previous.width && previous.height) {
    ctx.drawImage(previous, 0, 0, canvas.width, canvas.height);
  }
}

function snapshot() {
  return canvas.toDataURL("image/png");
}

function drawImageFromDataUrl(dataUrl) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve();
    };
    image.src = dataUrl;
  });
}

function pushHistory() {
  undoStack.push(snapshot());
  if (undoStack.length > MAX_HISTORY) {
    undoStack.shift();
  }
  redoStack = [];
  updateHistoryButtons();
}

function updateHistoryButtons() {
  undoButton.disabled = undoStack.length === 0;
  redoButton.disabled = redoStack.length === 0;
}

function setTool(tool) {
  currentTool = tool;
  brushButton.classList.toggle("is-active", tool === "brush");
  eraserButton.classList.toggle("is-active", tool === "eraser");
  brushButton.setAttribute("aria-pressed", String(tool === "brush"));
  eraserButton.setAttribute("aria-pressed", String(tool === "eraser"));
}

function drawLine(from, to) {
  configureStroke();
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  ctx.quadraticCurveTo(from.x, from.y, midX, midY);
  ctx.stroke();
}

function beginDrawing(event) {
  event.preventDefault();
  canvas.setPointerCapture(event.pointerId);
  pushHistory();
  isDrawing = true;
  lastPoint = getPointerPoint(event);
  configureStroke();
  ctx.beginPath();
  ctx.arc(lastPoint.x, lastPoint.y, ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.fillStyle = currentTool === "eraser" ? "rgba(0,0,0,1)" : colorPicker.value;
  if (currentTool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
  }
  ctx.fill();
}

function continueDrawing(event) {
  if (!isDrawing || !lastPoint) {
    return;
  }

  event.preventDefault();
  const events = event.getCoalescedEvents ? event.getCoalescedEvents() : [event];

  for (const pointerEvent of events) {
    const nextPoint = getPointerPoint(pointerEvent);
    drawLine(lastPoint, nextPoint);
    lastPoint = nextPoint;
  }
}

function finishDrawing(event) {
  if (!isDrawing) {
    return;
  }

  event.preventDefault();
  isDrawing = false;
  lastPoint = null;
  ctx.globalCompositeOperation = "source-over";
  scheduleAutosave();
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function requestFromStore(mode, callback) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = callback(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

async function commitToStore(callback) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    callback(store);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

async function putDrawing(record) {
  await commitToStore((store) => store.put(record));
}

async function getDrawing(id) {
  return requestFromStore("readonly", (store) => store.get(id));
}

async function getAllDrawings() {
  return requestFromStore("readonly", (store) => store.getAll());
}

async function deleteDrawing(id) {
  await commitToStore((store) => store.delete(id));
}

function scheduleAutosave() {
  window.clearTimeout(autosaveTimer);
  autosaveTimer = window.setTimeout(async () => {
    await putDrawing({
      id: AUTOSAVE_ID,
      title: "Autosave",
      createdAt: new Date().toISOString(),
      dataUrl: snapshot(),
    });
    setStatus("Salvato automaticamente");
  }, 350);
}

async function loadAutosave() {
  if (hasLoadedAutosave) {
    return;
  }

  hasLoadedAutosave = true;
  const record = await getDrawing(AUTOSAVE_ID).catch(() => null);

  if (record?.dataUrl) {
    await drawImageFromDataUrl(record.dataUrl);
    setStatus("Disegno ripristinato");
  }
}

async function saveCurrentDrawing() {
  const now = new Date();
  await putDrawing({
    id: `drawing-${now.getTime()}`,
    title: `Disegno ${now.toLocaleDateString("it-IT")} ${now.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    createdAt: now.toISOString(),
    dataUrl: snapshot(),
  });
  setStatus("Disegno salvato in galleria");
}

async function renderGallery() {
  galleryGrid.innerHTML = "";
  const records = (await getAllDrawings())
    .filter((record) => record.id !== AUTOSAVE_ID)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  emptyGallery.hidden = records.length > 0;

  for (const record of records) {
    const card = document.createElement("article");
    card.className = "gallery-card";

    const image = document.createElement("img");
    image.src = record.dataUrl;
    image.alt = record.title;

    const title = document.createElement("strong");
    title.textContent = record.title;

    const date = document.createElement("small");
    date.textContent = new Date(record.createdAt).toLocaleString("it-IT");

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const loadButton = document.createElement("button");
    loadButton.type = "button";
    loadButton.textContent = "Apri";
    loadButton.addEventListener("click", async () => {
      pushHistory();
      await drawImageFromDataUrl(record.dataUrl);
      galleryDialog.close();
      scheduleAutosave();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Elimina";
    deleteButton.addEventListener("click", async () => {
      if (!window.confirm("Eliminare questo disegno?")) {
        return;
      }
      await deleteDrawing(record.id);
      await renderGallery();
    });

    actions.append(loadButton, deleteButton);
    card.append(image, title, date, actions);
    galleryGrid.append(card);
  }
}

async function undo() {
  if (undoStack.length === 0) {
    return;
  }

  redoStack.push(snapshot());
  const previous = undoStack.pop();
  await drawImageFromDataUrl(previous);
  updateHistoryButtons();
  scheduleAutosave();
}

async function redo() {
  if (redoStack.length === 0) {
    return;
  }

  undoStack.push(snapshot());
  const next = redoStack.pop();
  await drawImageFromDataUrl(next);
  updateHistoryButtons();
  scheduleAutosave();
}

function clearCanvas() {
  if (!window.confirm("Pulire tutto il foglio?")) {
    return;
  }

  pushHistory();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  scheduleAutosave();
}

function exportPNG() {
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  link.download = `vicky-draw-${stamp}.png`;
  link.href = snapshot();
  link.click();
  setStatus("PNG esportato");
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker.register("sw.js").catch(() => {
    setStatus("Offline non disponibile in questo browser");
  });
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) {
    return;
  }

  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installButton.hidden = true;
});

brushButton.addEventListener("click", () => setTool("brush"));
eraserButton.addEventListener("click", () => setTool("eraser"));
undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);
saveButton.addEventListener("click", saveCurrentDrawing);
galleryButton.addEventListener("click", async () => {
  await renderGallery();
  galleryDialog.showModal();
});
exportButton.addEventListener("click", exportPNG);
clearButton.addEventListener("click", clearCanvas);

canvas.addEventListener("pointerdown", beginDrawing);
canvas.addEventListener("pointermove", continueDrawing);
canvas.addEventListener("pointerup", finishDrawing);
canvas.addEventListener("pointercancel", finishDrawing);
canvas.addEventListener("pointerleave", finishDrawing);

window.addEventListener("resize", () => {
  resizeCanvas();
  scheduleAutosave();
});

resizeCanvas();
loadAutosave();
updateHistoryButtons();
registerServiceWorker();
