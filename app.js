const canvas = document.querySelector("#drawingCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const drawingStage = document.querySelector("#drawingStage");
const board = document.querySelector("#board");
const stickerLayer = document.querySelector("#stickerLayer");

const brushButton = document.querySelector("#brushButton");
const eraserButton = document.querySelector("#eraserButton");
const handButton = document.querySelector("#handButton");
const colorPicker = document.querySelector("#colorPicker");
const sizePicker = document.querySelector("#sizePicker");
const assetsButton = document.querySelector("#assetsButton");
const zoomOutButton = document.querySelector("#zoomOutButton");
const zoomResetButton = document.querySelector("#zoomResetButton");
const zoomInButton = document.querySelector("#zoomInButton");
const undoButton = document.querySelector("#undoButton");
const redoButton = document.querySelector("#redoButton");
const saveButton = document.querySelector("#saveButton");
const galleryButton = document.querySelector("#galleryButton");
const exportButton = document.querySelector("#exportButton");
const clearButton = document.querySelector("#clearButton");
const installButton = document.querySelector("#installButton");
const saveStatus = document.querySelector("#saveStatus");

const assetsDialog = document.querySelector("#assetsDialog");
const assetSearch = document.querySelector("#assetSearch");
const stickersTab = document.querySelector("#stickersTab");
const backgroundsTab = document.querySelector("#backgroundsTab");
const assetGrid = document.querySelector("#assetGrid");
const emptyAssets = document.querySelector("#emptyAssets");

const galleryDialog = document.querySelector("#galleryDialog");
const galleryGrid = document.querySelector("#galleryGrid");
const emptyGallery = document.querySelector("#emptyGallery");

const DB_NAME = "vicky-draw";
const STORE_NAME = "drawings";
const AUTOSAVE_ID = "autosave";
const MAX_HISTORY = 40;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.2;
const EMOJI_FONT = "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif";

const STICKERS = [
  { name: "Cuore", value: "❤️", keywords: "cuore amore heart love rosso" },
  { name: "Cuori", value: "💕", keywords: "cuori amore heart love rosa" },
  { name: "Stella", value: "⭐", keywords: "stella star magia giallo" },
  { name: "Scintille", value: "✨", keywords: "scintille magia glitter sparkles stelle" },
  { name: "Arcobaleno", value: "🌈", keywords: "arcobaleno rainbow colore cielo" },
  { name: "Sole", value: "☀️", keywords: "sole sun estate caldo cielo" },
  { name: "Luna", value: "🌙", keywords: "luna moon notte cielo" },
  { name: "Nuvola", value: "☁️", keywords: "nuvola cloud cielo meteo" },
  { name: "Fiore", value: "🌸", keywords: "fiore flower rosa primavera" },
  { name: "Tulipano", value: "🌷", keywords: "tulipano fiore flower primavera" },
  { name: "Albero", value: "🌳", keywords: "albero tree natura bosco" },
  { name: "Gatto", value: "🐱", keywords: "gatto cat animale miao" },
  { name: "Cane", value: "🐶", keywords: "cane dog animale bau" },
  { name: "Unicorno", value: "🦄", keywords: "unicorno unicorn magia cavallo" },
  { name: "Farfalla", value: "🦋", keywords: "farfalla butterfly animale insetto" },
  { name: "Pesce", value: "🐠", keywords: "pesce fish mare acqua" },
  { name: "Delfino", value: "🐬", keywords: "delfino dolphin mare acqua" },
  { name: "Tartaruga", value: "🐢", keywords: "tartaruga turtle animale" },
  { name: "Dinosauro", value: "🦖", keywords: "dinosauro dino rex animale" },
  { name: "Drago", value: "🐉", keywords: "drago dragon fantasy" },
  { name: "Principessa", value: "👑", keywords: "principessa corona queen re regina princess" },
  { name: "Castello", value: "🏰", keywords: "castello castle principessa favola" },
  { name: "Casa", value: "🏠", keywords: "casa home house" },
  { name: "Auto", value: "🚗", keywords: "auto car macchina veicolo" },
  { name: "Razzo", value: "🚀", keywords: "razzo rocket spazio luna" },
  { name: "Ufo", value: "🛸", keywords: "ufo alieno spazio" },
  { name: "Palla", value: "⚽", keywords: "palla calcio football sport" },
  { name: "Basket", value: "🏀", keywords: "basket sport palla" },
  { name: "Pizza", value: "🍕", keywords: "pizza cibo food" },
  { name: "Gelato", value: "🍦", keywords: "gelato ice cream dolce estate" },
  { name: "Cupcake", value: "🧁", keywords: "cupcake torta dolce cake" },
  { name: "Regalo", value: "🎁", keywords: "regalo gift festa compleanno" },
  { name: "Palloncino", value: "🎈", keywords: "palloncino balloon festa compleanno" },
  { name: "Musica", value: "🎵", keywords: "musica note song canzone" },
  { name: "Pennello", value: "🖌️", keywords: "pennello arte disegno paint" },
  { name: "Sorriso", value: "😊", keywords: "sorriso smile felice faccina" },
  { name: "Wow", value: "🤩", keywords: "wow stelle occhi faccina" },
  { name: "Fuoco", value: "🔥", keywords: "fuoco fire caldo" },
  { name: "Fulmine", value: "⚡", keywords: "fulmine lightning energia" },
  { name: "Diamante", value: "💎", keywords: "diamante gemma brillante jewel" },
];

const BACKGROUNDS = [
  {
    id: "white",
    name: "Bianco",
    keywords: "bianco white foglio pulito",
    css: "#ffffff",
  },
  {
    id: "grid",
    name: "Quadretti",
    keywords: "quadretti griglia grid quaderno scuola",
    css: "linear-gradient(90deg, rgba(184, 205, 255, 0.55) 1px, transparent 1px), linear-gradient(rgba(184, 205, 255, 0.55) 1px, transparent 1px), #ffffff",
  },
  {
    id: "dots",
    name: "Pois",
    keywords: "pois dots puntini coriandoli",
    css: "radial-gradient(circle, rgba(255,122,168,0.45) 2px, transparent 3px), #ffffff",
  },
  {
    id: "pink",
    name: "Rosa",
    keywords: "rosa pink sfumato gradient",
    css: "linear-gradient(135deg, #fff0f7 0%, #ffd6e7 100%)",
  },
  {
    id: "sky",
    name: "Cielo",
    keywords: "cielo sky nuvole azzurro",
    css: "linear-gradient(180deg, #bfe9ff 0%, #ffffff 100%)",
  },
  {
    id: "night",
    name: "Notte",
    keywords: "notte night stelle spazio luna blu",
    css: "radial-gradient(circle at 20% 18%, rgba(255,255,255,0.9) 1px, transparent 2px), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.75) 1px, transparent 2px), linear-gradient(180deg, #1f2a68 0%, #070b25 100%)",
  },
  {
    id: "grass",
    name: "Prato",
    keywords: "prato erba grass verde natura",
    css: "linear-gradient(180deg, #d9f7ff 0%, #ffffff 55%, #b7ef9a 55%, #66c45f 100%)",
  },
  {
    id: "sea",
    name: "Mare",
    keywords: "mare sea acqua spiaggia estate blu",
    css: "linear-gradient(180deg, #bdefff 0%, #fef6c9 45%, #65d5f6 46%, #1e9bd7 100%)",
  },
  {
    id: "rainbow",
    name: "Rainbow",
    keywords: "arcobaleno rainbow colori colorato",
    css: "linear-gradient(135deg, #ff9aa2, #ffdac1, #ffffb5, #b5ead7, #c7ceea)",
  },
];

let currentTool = "brush";
let currentAssetKind = "stickers";
let currentBackgroundId = "white";
let stickers = [];
let activeStickerId = null;
let stickerAction = null;
let isDrawing = false;
let drawingPointerId = null;
let lastPoint = null;
let undoStack = [];
let redoStack = [];
let autosaveTimer = null;
let deferredInstallPrompt = null;
let hasLoadedAutosave = false;
let view = { zoom: 1, panX: 0, panY: 0 };
let handPointers = new Map();
let handGesture = null;

function setStatus(message) {
  saveStatus.textContent = message;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function cloneProject(project) {
  return JSON.parse(JSON.stringify(project));
}

function createId(prefix) {
  if (window.crypto?.randomUUID) {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 100000)}`;
}

function getBoardSize() {
  const rect = board.getBoundingClientRect();
  return {
    width: board.clientWidth || rect.width || 1,
    height: board.clientHeight || rect.height || 1,
  };
}

function clientToCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    pressure: event.pressure || 0.5,
  };
}

function clientToBoardPoint(event) {
  const rect = board.getBoundingClientRect();
  const size = getBoardSize();
  return {
    x: ((event.clientX - rect.left) / rect.width) * size.width,
    y: ((event.clientY - rect.top) / rect.height) * size.height,
  };
}

function configureStroke() {
  ctx.lineWidth = Number(sizePicker.value) * (window.devicePixelRatio || 1);
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

  const dpr = window.devicePixelRatio || 1;
  const cssWidth = canvas.clientWidth || board.clientWidth || 1;
  const cssHeight = canvas.clientHeight || board.clientHeight || 1;
  canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
  canvas.height = Math.max(1, Math.floor(cssHeight * dpr));
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (previous.width && previous.height) {
    ctx.drawImage(previous, 0, 0, canvas.width, canvas.height);
  }
}

function drawImageFromDataUrl(dataUrl) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve();
    };
    image.src = dataUrl;
  });
}

function serializeProject() {
  return {
    version: 2,
    backgroundId: currentBackgroundId,
    stickers: stickers.map((sticker) => ({ ...sticker })),
    drawingDataUrl: canvas.toDataURL("image/png"),
  };
}

async function restoreProject(project) {
  const safeProject = project || {};
  currentBackgroundId = safeProject.backgroundId || "white";
  stickers = Array.isArray(safeProject.stickers) ? safeProject.stickers.map((sticker) => ({ ...sticker })) : [];
  activeStickerId = null;
  applyBackground(currentBackgroundId, { pushToHistory: false, autosave: false });
  renderStickers();

  if (safeProject.drawingDataUrl) {
    await drawImageFromDataUrl(safeProject.drawingDataUrl);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function pushHistory() {
  undoStack.push(serializeProject());
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
  handButton.classList.toggle("is-active", tool === "hand");
  brushButton.setAttribute("aria-pressed", String(tool === "brush"));
  eraserButton.setAttribute("aria-pressed", String(tool === "eraser"));
  handButton.setAttribute("aria-pressed", String(tool === "hand"));
  board.classList.toggle("is-hand-mode", tool === "hand");
  handPointers.clear();
  handGesture = null;
}

function drawLine(from, to) {
  configureStroke();
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

function beginDrawing(event) {
  if (currentTool === "hand") {
    beginHandGesture(event);
    return;
  }

  if (!event.isPrimary || isDrawing) {
    return;
  }

  event.preventDefault();
  activeStickerId = null;
  renderStickers();
  canvas.setPointerCapture(event.pointerId);
  pushHistory();
  isDrawing = true;
  drawingPointerId = event.pointerId;
  lastPoint = clientToCanvasPoint(event);
  configureStroke();
  ctx.beginPath();
  ctx.arc(lastPoint.x, lastPoint.y, ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.fillStyle = currentTool === "eraser" ? "rgba(0,0,0,1)" : colorPicker.value;
  ctx.fill();
}

function continueDrawing(event) {
  if (currentTool === "hand") {
    continueHandGesture(event);
    return;
  }

  if (!isDrawing || !lastPoint || event.pointerId !== drawingPointerId) {
    return;
  }

  event.preventDefault();
  const events = event.getCoalescedEvents ? event.getCoalescedEvents() : [event];

  for (const pointerEvent of events) {
    const nextPoint = clientToCanvasPoint(pointerEvent);
    drawLine(lastPoint, nextPoint);
    lastPoint = nextPoint;
  }
}

function finishDrawing(event) {
  if (currentTool === "hand") {
    endHandGesture(event);
    return;
  }

  if (!isDrawing || event.pointerId !== drawingPointerId) {
    return;
  }

  event.preventDefault();
  isDrawing = false;
  drawingPointerId = null;
  lastPoint = null;
  ctx.globalCompositeOperation = "source-over";
  scheduleAutosave();
}

function applyViewTransform() {
  board.style.transform = `translate(${view.panX}px, ${view.panY}px) scale(${view.zoom})`;
  zoomResetButton.textContent = `${Math.round(view.zoom * 100)}%`;
}

function setZoom(nextZoom, focalEvent = null) {
  const previousZoom = view.zoom;
  const newZoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);

  if (Math.abs(previousZoom - newZoom) < 0.001) {
    return;
  }

  const stageRect = drawingStage.getBoundingClientRect();
  const focalClientX = focalEvent?.clientX ?? stageRect.left + stageRect.width / 2;
  const focalClientY = focalEvent?.clientY ?? stageRect.top + stageRect.height / 2;
  const boardPoint = {
    x: (focalClientX - stageRect.left - view.panX) / previousZoom,
    y: (focalClientY - stageRect.top - view.panY) / previousZoom,
  };

  view.zoom = newZoom;
  view.panX = focalClientX - stageRect.left - boardPoint.x * newZoom;
  view.panY = focalClientY - stageRect.top - boardPoint.y * newZoom;
  applyViewTransform();
}

function resetZoom() {
  view = { zoom: 1, panX: 0, panY: 0 };
  applyViewTransform();
}

function pointerDistance(a, b) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function pointerMidpoint(a, b) {
  return {
    clientX: (a.clientX + b.clientX) / 2,
    clientY: (a.clientY + b.clientY) / 2,
  };
}

function beginHandGesture(event) {
  event.preventDefault();
  canvas.setPointerCapture(event.pointerId);
  handPointers.set(event.pointerId, event);

  if (handPointers.size === 1) {
    handGesture = {
      type: "pan",
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startPanX: view.panX,
      startPanY: view.panY,
    };
    return;
  }

  if (handPointers.size >= 2) {
    const [first, second] = Array.from(handPointers.values());
    const midpoint = pointerMidpoint(first, second);
    const stageRect = drawingStage.getBoundingClientRect();
    handGesture = {
      type: "pinch",
      startDistance: pointerDistance(first, second) || 1,
      startZoom: view.zoom,
      startPanX: view.panX,
      startPanY: view.panY,
      focalX: (midpoint.clientX - stageRect.left - view.panX) / view.zoom,
      focalY: (midpoint.clientY - stageRect.top - view.panY) / view.zoom,
    };
  }
}

function continueHandGesture(event) {
  if (!handPointers.has(event.pointerId)) {
    return;
  }

  event.preventDefault();
  handPointers.set(event.pointerId, event);

  if (handPointers.size === 1 && handGesture?.type === "pan") {
    view.panX = handGesture.startPanX + event.clientX - handGesture.startClientX;
    view.panY = handGesture.startPanY + event.clientY - handGesture.startClientY;
    applyViewTransform();
    return;
  }

  if (handPointers.size >= 2 && handGesture?.type === "pinch") {
    const [first, second] = Array.from(handPointers.values());
    const midpoint = pointerMidpoint(first, second);
    const stageRect = drawingStage.getBoundingClientRect();
    const ratio = pointerDistance(first, second) / handGesture.startDistance;
    view.zoom = clamp(handGesture.startZoom * ratio, MIN_ZOOM, MAX_ZOOM);
    view.panX = midpoint.clientX - stageRect.left - handGesture.focalX * view.zoom;
    view.panY = midpoint.clientY - stageRect.top - handGesture.focalY * view.zoom;
    applyViewTransform();
  }
}

function endHandGesture(event) {
  if (!handPointers.has(event.pointerId)) {
    return;
  }

  event.preventDefault();
  handPointers.delete(event.pointerId);

  if (handPointers.size === 1) {
    const remaining = Array.from(handPointers.values())[0];
    handGesture = {
      type: "pan",
      pointerId: remaining.pointerId,
      startClientX: remaining.clientX,
      startClientY: remaining.clientY,
      startPanX: view.panX,
      startPanY: view.panY,
    };
  } else {
    handGesture = null;
  }
}

function getBackground(id) {
  return BACKGROUNDS.find((background) => background.id === id) || BACKGROUNDS[0];
}

function applyBackground(id, options = {}) {
  const { pushToHistory = true, autosave = true } = options;

  if (pushToHistory) {
    pushHistory();
  }

  currentBackgroundId = getBackground(id).id;
  board.style.background = getBackground(currentBackgroundId).css;
  board.style.backgroundSize = currentBackgroundId === "grid" ? "24px 24px" : currentBackgroundId === "dots" ? "26px 26px" : "auto";

  if (autosave) {
    scheduleAutosave();
    setStatus(`Sfondo ${getBackground(currentBackgroundId).name.toLowerCase()} applicato`);
  }
}

function drawBackgroundOnContext(targetCtx, width, height, backgroundId) {
  const bg = getBackground(backgroundId);
  targetCtx.save();
  targetCtx.clearRect(0, 0, width, height);

  if (bg.id === "white") {
    targetCtx.fillStyle = "#ffffff";
    targetCtx.fillRect(0, 0, width, height);
  } else if (bg.id === "grid") {
    targetCtx.fillStyle = "#ffffff";
    targetCtx.fillRect(0, 0, width, height);
    targetCtx.strokeStyle = "rgba(126, 158, 234, 0.42)";
    targetCtx.lineWidth = Math.max(1, width / getBoardSize().width);
    const gap = 24 * (width / getBoardSize().width);
    for (let x = 0; x <= width; x += gap) {
      targetCtx.beginPath();
      targetCtx.moveTo(x, 0);
      targetCtx.lineTo(x, height);
      targetCtx.stroke();
    }
    for (let y = 0; y <= height; y += gap) {
      targetCtx.beginPath();
      targetCtx.moveTo(0, y);
      targetCtx.lineTo(width, y);
      targetCtx.stroke();
    }
  } else if (bg.id === "dots") {
    targetCtx.fillStyle = "#ffffff";
    targetCtx.fillRect(0, 0, width, height);
    targetCtx.fillStyle = "rgba(255,122,168,0.45)";
    const scale = width / getBoardSize().width;
    const gap = 26 * scale;
    const radius = 2.8 * scale;
    for (let y = gap / 2; y < height; y += gap) {
      for (let x = gap / 2; x < width; x += gap) {
        targetCtx.beginPath();
        targetCtx.arc(x, y, radius, 0, Math.PI * 2);
        targetCtx.fill();
      }
    }
  } else if (bg.id === "night") {
    const gradient = targetCtx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#1f2a68");
    gradient.addColorStop(1, "#070b25");
    targetCtx.fillStyle = gradient;
    targetCtx.fillRect(0, 0, width, height);
    targetCtx.fillStyle = "rgba(255,255,255,0.85)";
    const stars = [
      [0.18, 0.18],
      [0.42, 0.12],
      [0.72, 0.28],
      [0.86, 0.16],
      [0.61, 0.45],
      [0.29, 0.36],
    ];
    for (const [x, y] of stars) {
      targetCtx.beginPath();
      targetCtx.arc(width * x, height * y, Math.max(1.4, width * 0.0025), 0, Math.PI * 2);
      targetCtx.fill();
    }
  } else if (bg.id === "pink" || bg.id === "sky" || bg.id === "rainbow") {
    const gradient = targetCtx.createLinearGradient(0, 0, width, height);
    if (bg.id === "pink") {
      gradient.addColorStop(0, "#fff0f7");
      gradient.addColorStop(1, "#ffd6e7");
    } else if (bg.id === "sky") {
      gradient.addColorStop(0, "#bfe9ff");
      gradient.addColorStop(1, "#ffffff");
    } else {
      gradient.addColorStop(0, "#ff9aa2");
      gradient.addColorStop(0.25, "#ffdac1");
      gradient.addColorStop(0.5, "#ffffb5");
      gradient.addColorStop(0.75, "#b5ead7");
      gradient.addColorStop(1, "#c7ceea");
    }
    targetCtx.fillStyle = gradient;
    targetCtx.fillRect(0, 0, width, height);
  } else if (bg.id === "grass") {
    const sky = targetCtx.createLinearGradient(0, 0, 0, height * 0.55);
    sky.addColorStop(0, "#d9f7ff");
    sky.addColorStop(1, "#ffffff");
    targetCtx.fillStyle = sky;
    targetCtx.fillRect(0, 0, width, height * 0.55);
    const grass = targetCtx.createLinearGradient(0, height * 0.55, 0, height);
    grass.addColorStop(0, "#b7ef9a");
    grass.addColorStop(1, "#66c45f");
    targetCtx.fillStyle = grass;
    targetCtx.fillRect(0, height * 0.55, width, height * 0.45);
  } else if (bg.id === "sea") {
    targetCtx.fillStyle = "#bdefff";
    targetCtx.fillRect(0, 0, width, height * 0.45);
    targetCtx.fillStyle = "#fef6c9";
    targetCtx.fillRect(0, height * 0.45, width, height * 0.12);
    const sea = targetCtx.createLinearGradient(0, height * 0.52, 0, height);
    sea.addColorStop(0, "#65d5f6");
    sea.addColorStop(1, "#1e9bd7");
    targetCtx.fillStyle = sea;
    targetCtx.fillRect(0, height * 0.52, width, height * 0.48);
  }

  targetCtx.restore();
}

function createCompositeDataUrl() {
  const output = document.createElement("canvas");
  output.width = canvas.width;
  output.height = canvas.height;
  const out = output.getContext("2d");
  const size = getBoardSize();
  const scaleX = output.width / size.width;
  const scaleY = output.height / size.height;

  drawBackgroundOnContext(out, output.width, output.height, currentBackgroundId);
  out.drawImage(canvas, 0, 0, output.width, output.height);

  out.save();
  out.textAlign = "center";
  out.textBaseline = "middle";
  for (const sticker of stickers) {
    out.font = `${sticker.size * scaleY}px ${EMOJI_FONT}`;
    out.fillText(sticker.value, sticker.x * scaleX, sticker.y * scaleY);
  }
  out.restore();

  return output.toDataURL("image/png");
}


function updateStickerSelection() {
  for (const element of stickerLayer.querySelectorAll(".sticker-item")) {
    element.classList.toggle("is-selected", element.dataset.stickerId === activeStickerId);
  }
}

function updateStickerElement(sticker) {
  const element = stickerLayer.querySelector(`[data-sticker-id="${sticker.id}"]`);
  if (!element) {
    return;
  }
  element.style.left = `${sticker.x}px`;
  element.style.top = `${sticker.y}px`;
  element.style.fontSize = `${sticker.size}px`;
  element.classList.toggle("is-selected", sticker.id === activeStickerId);
}

function renderStickers() {
  stickerLayer.innerHTML = "";

  for (const sticker of stickers) {
    const element = document.createElement("div");
    element.className = "sticker-item";
    element.dataset.stickerId = sticker.id;
    element.style.left = `${sticker.x}px`;
    element.style.top = `${sticker.y}px`;
    element.style.fontSize = `${sticker.size}px`;
    element.classList.toggle("is-selected", sticker.id === activeStickerId);

    const glyph = document.createElement("span");
    glyph.className = "sticker-glyph";
    glyph.textContent = sticker.value;

    const resizeHandle = document.createElement("button");
    resizeHandle.type = "button";
    resizeHandle.className = "sticker-resize";
    resizeHandle.textContent = "↘";
    resizeHandle.setAttribute("aria-label", "Ridimensiona sticker");

    element.addEventListener("pointerdown", (event) => beginStickerMove(event, sticker.id));
    resizeHandle.addEventListener("pointerdown", (event) => beginStickerResize(event, sticker.id));

    element.append(glyph, resizeHandle);
    stickerLayer.append(element);
  }
}

function beginStickerMove(event, stickerId) {
  event.preventDefault();
  event.stopPropagation();
  const sticker = stickers.find((item) => item.id === stickerId);
  if (!sticker) {
    return;
  }

  pushHistory();
  activeStickerId = stickerId;
  updateStickerSelection();
  const point = clientToBoardPoint(event);
  stickerAction = {
    type: "move",
    pointerId: event.pointerId,
    stickerId,
    startX: point.x,
    startY: point.y,
    originalX: sticker.x,
    originalY: sticker.y,
  };
  event.currentTarget.setPointerCapture?.(event.pointerId);
}

function beginStickerResize(event, stickerId) {
  event.preventDefault();
  event.stopPropagation();
  const sticker = stickers.find((item) => item.id === stickerId);
  if (!sticker) {
    return;
  }

  pushHistory();
  activeStickerId = stickerId;
  updateStickerSelection();
  const point = clientToBoardPoint(event);
  stickerAction = {
    type: "resize",
    pointerId: event.pointerId,
    stickerId,
    startX: point.x,
    startY: point.y,
    originalSize: sticker.size,
  };
  event.currentTarget.setPointerCapture?.(event.pointerId);
}

function continueStickerAction(event) {
  if (!stickerAction || event.pointerId !== stickerAction.pointerId) {
    return;
  }

  event.preventDefault();
  const sticker = stickers.find((item) => item.id === stickerAction.stickerId);
  if (!sticker) {
    return;
  }

  const point = clientToBoardPoint(event);
  const size = getBoardSize();

  if (stickerAction.type === "move") {
    sticker.x = clamp(stickerAction.originalX + point.x - stickerAction.startX, 0, size.width);
    sticker.y = clamp(stickerAction.originalY + point.y - stickerAction.startY, 0, size.height);
  } else {
    const delta = Math.max(point.x - stickerAction.startX, point.y - stickerAction.startY);
    sticker.size = clamp(stickerAction.originalSize + delta, 24, 220);
  }

  updateStickerElement(sticker);
}

function finishStickerAction(event) {
  if (!stickerAction || event.pointerId !== stickerAction.pointerId) {
    return;
  }

  event.preventDefault();
  stickerAction = null;
  scheduleAutosave();
}

function getVisibleBoardCenter() {
  const stageRect = drawingStage.getBoundingClientRect();
  const point = clientToBoardPoint({
    clientX: stageRect.left + stageRect.width / 2,
    clientY: stageRect.top + stageRect.height / 2,
  });
  const size = getBoardSize();
  return {
    x: clamp(point.x, 48, Math.max(48, size.width - 48)),
    y: clamp(point.y, 48, Math.max(48, size.height - 48)),
  };
}

function addSticker(stickerDefinition) {
  pushHistory();
  const center = getVisibleBoardCenter();
  const sticker = {
    id: createId("sticker"),
    type: "emoji",
    value: stickerDefinition.value,
    name: stickerDefinition.name,
    x: center.x,
    y: center.y,
    size: 72,
  };
  stickers.push(sticker);
  activeStickerId = sticker.id;
  renderStickers();
  scheduleAutosave();
  setStatus(`Sticker ${sticker.name.toLowerCase()} aggiunto`);
  assetsDialog.close();
}

function normalizeText(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function matchesQuery(item, query) {
  const normalizedQuery = normalizeText(query.trim());
  if (!normalizedQuery) {
    return true;
  }
  const haystack = normalizeText(`${item.name} ${item.keywords || ""} ${item.value || ""}`);
  return normalizedQuery.split(/\s+/).every((word) => haystack.includes(word));
}

function renderAssetGrid() {
  assetGrid.innerHTML = "";
  const query = assetSearch.value;
  const source = currentAssetKind === "stickers" ? STICKERS : BACKGROUNDS;
  const records = source.filter((item) => matchesQuery(item, query));
  emptyAssets.hidden = records.length > 0;

  for (const record of records) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "asset-card";

    if (currentAssetKind === "stickers") {
      const preview = document.createElement("span");
      preview.className = "asset-preview-sticker";
      preview.textContent = record.value;
      const name = document.createElement("strong");
      name.textContent = record.name;
      button.append(preview, name);
      button.addEventListener("click", () => addSticker(record));
    } else {
      const preview = document.createElement("span");
      preview.className = "asset-preview-bg";
      preview.style.background = record.css;
      preview.style.backgroundSize = record.id === "grid" ? "24px 24px" : record.id === "dots" ? "26px 26px" : "auto";
      const name = document.createElement("strong");
      name.textContent = record.name;
      button.append(preview, name);
      button.addEventListener("click", () => {
        applyBackground(record.id);
        assetsDialog.close();
      });
    }

    assetGrid.append(button);
  }
}

function setAssetKind(kind) {
  currentAssetKind = kind;
  stickersTab.classList.toggle("is-active", kind === "stickers");
  backgroundsTab.classList.toggle("is-active", kind === "backgrounds");
  stickersTab.setAttribute("aria-selected", String(kind === "stickers"));
  backgroundsTab.setAttribute("aria-selected", String(kind === "backgrounds"));
  renderAssetGrid();
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
      dataUrl: createCompositeDataUrl(),
      project: serializeProject(),
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

  if (record?.project) {
    await restoreProject(record.project);
    setStatus("Disegno ripristinato");
  } else if (record?.dataUrl) {
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
    dataUrl: createCompositeDataUrl(),
    project: serializeProject(),
  });
  setStatus("Disegno salvato in galleria");
}

async function restoreRecord(record) {
  if (record.project) {
    await restoreProject(record.project);
  } else if (record.dataUrl) {
    await drawImageFromDataUrl(record.dataUrl);
    stickers = [];
    activeStickerId = null;
    currentBackgroundId = "white";
    applyBackground("white", { pushToHistory: false, autosave: false });
    renderStickers();
  }
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
    image.src = record.dataUrl || record.project?.drawingDataUrl || "";
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
      await restoreRecord(record);
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

  redoStack.push(serializeProject());
  const previous = undoStack.pop();
  await restoreProject(previous);
  updateHistoryButtons();
  scheduleAutosave();
}

async function redo() {
  if (redoStack.length === 0) {
    return;
  }

  undoStack.push(serializeProject());
  const next = redoStack.pop();
  await restoreProject(next);
  updateHistoryButtons();
  scheduleAutosave();
}

function clearCanvas() {
  if (!window.confirm("Pulire tutto il foglio? Verranno rimossi anche sticker e sfondo.")) {
    return;
  }

  pushHistory();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stickers = [];
  activeStickerId = null;
  applyBackground("white", { pushToHistory: false, autosave: false });
  renderStickers();
  scheduleAutosave();
}

function exportPNG() {
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  link.download = `vicky-draw-${stamp}.png`;
  link.href = createCompositeDataUrl();
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
handButton.addEventListener("click", () => setTool("hand"));

assetsButton.addEventListener("click", () => {
  assetSearch.value = "";
  setAssetKind("stickers");
  assetsDialog.showModal();
  window.setTimeout(() => assetSearch.focus(), 80);
});

stickersTab.addEventListener("click", () => setAssetKind("stickers"));
backgroundsTab.addEventListener("click", () => setAssetKind("backgrounds"));
assetSearch.addEventListener("input", renderAssetGrid);

zoomOutButton.addEventListener("click", () => setZoom(view.zoom - ZOOM_STEP));
zoomInButton.addEventListener("click", () => setZoom(view.zoom + ZOOM_STEP));
zoomResetButton.addEventListener("click", resetZoom);

drawingStage.addEventListener(
  "wheel",
  (event) => {
    if (!event.ctrlKey && !event.metaKey) {
      return;
    }
    event.preventDefault();
    const direction = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom(view.zoom + direction, event);
  },
  { passive: false },
);

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

window.addEventListener("pointermove", continueStickerAction, { passive: false });
window.addEventListener("pointerup", finishStickerAction, { passive: false });
window.addEventListener("pointercancel", finishStickerAction, { passive: false });

window.addEventListener("resize", () => {
  resizeCanvas();
  renderStickers();
  scheduleAutosave();
});

resizeCanvas();
applyBackground("white", { pushToHistory: false, autosave: false });
applyViewTransform();
renderAssetGrid();
loadAutosave();
updateHistoryButtons();
registerServiceWorker();
