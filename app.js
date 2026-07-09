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
const themeSearch = document.querySelector("#themeSearch");
const generateThemeButton = document.querySelector("#generateThemeButton");
const generateStatus = document.querySelector("#generateStatus");
const uploadStickerInput = document.querySelector("#uploadStickerInput");
const uploadBackgroundInput = document.querySelector("#uploadBackgroundInput");
const stickerDropZone = document.querySelector("#stickerDropZone");
const backgroundDropZone = document.querySelector("#backgroundDropZone");
const clearUploadedAssetsButton = document.querySelector("#clearUploadedAssetsButton");
const uploadScopeLocal = document.querySelector("#uploadScopeLocal");
const uploadScopeShared = document.querySelector("#uploadScopeShared");
const stickersTab = document.querySelector("#stickersTab");
const backgroundsTab = document.querySelector("#backgroundsTab");
const assetGrid = document.querySelector("#assetGrid");
const emptyAssets = document.querySelector("#emptyAssets");
const libraryStatus = document.querySelector("#libraryStatus");
const refreshLibraryButton = document.querySelector("#refreshLibraryButton");

const galleryDialog = document.querySelector("#galleryDialog");
const galleryGrid = document.querySelector("#galleryGrid");
const emptyGallery = document.querySelector("#emptyGallery");

const DB_NAME = "vicky-draw";
const DB_VERSION = 3;
const STORE_NAME = "drawings";
const ASSET_STORE_NAME = "custom-assets";
const SHARED_LIBRARY_STORE_NAME = "shared-library-cache";
const AUTOSAVE_ID = "autosave";
const MAX_HISTORY = 40;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const STICKER_MIN_SIZE = 24;
const STICKER_MAX_SIZE = 240;
const ZOOM_STEP = 0.2;
const EMOJI_FONT = "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif";
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const REMOTE_LIBRARY_URL = "https://ma55im0.github.io/vicky-draw-library/library.json";
const REMOTE_LIBRARY_ORIGIN = new URL(REMOTE_LIBRARY_URL).origin;
const SHARED_UPLOAD_URL = "https://vicky-draw-api.vercel.app/api/upload-asset";
const SHARED_DELETE_URL = "https://vicky-draw-api.vercel.app/api/delete-asset";
const SHARED_LIBRARY_CACHE_ID = "current";
const ADMIN_PIN_STORAGE_KEY = "vicky-draw-admin-pin";
const PENDING_SHARED_STORAGE_KEY = "vicky-draw-pending-shared-assets-v1";
const STICKER_OUTPUT_MAX_SIZE = 900;
const BACKGROUND_OUTPUT_WIDTH = 1600;
const BACKGROUND_OUTPUT_MAX_HEIGHT = 1400;

let sharedLibrary = {
  version: 0,
  updatedAt: "",
  stickers: [],
  backgrounds: [],
};

let uploadedLibrary = {
  stickers: [],
  backgrounds: [],
};

const STICKERS = [
  {
    "name": "Cuore",
    "value": "❤️",
    "keywords": "cuore amore heart love rosso rosa"
  },
  {
    "name": "Cuori",
    "value": "💕",
    "keywords": "cuori amore heart love rosa"
  },
  {
    "name": "Cuore brillante",
    "value": "💖",
    "keywords": "cuore brillante amore glitter"
  },
  {
    "name": "Stella",
    "value": "⭐",
    "keywords": "stella star magia giallo"
  },
  {
    "name": "Scintille",
    "value": "✨",
    "keywords": "scintille magia glitter sparkles stelle"
  },
  {
    "name": "Arcobaleno",
    "value": "🌈",
    "keywords": "arcobaleno rainbow colore cielo"
  },
  {
    "name": "Sole",
    "value": "☀️",
    "keywords": "sole sun estate caldo cielo"
  },
  {
    "name": "Luna",
    "value": "🌙",
    "keywords": "luna moon notte cielo"
  },
  {
    "name": "Nuvola",
    "value": "☁️",
    "keywords": "nuvola cloud cielo meteo"
  },
  {
    "name": "Neve",
    "value": "❄️",
    "keywords": "neve snow inverno fiocco"
  },
  {
    "name": "Fiore",
    "value": "🌸",
    "keywords": "fiore flower rosa primavera"
  },
  {
    "name": "Tulipano",
    "value": "🌷",
    "keywords": "tulipano fiore flower primavera"
  },
  {
    "name": "Girasole",
    "value": "🌻",
    "keywords": "girasole fiore sole estate"
  },
  {
    "name": "Quadrifoglio",
    "value": "🍀",
    "keywords": "quadrifoglio fortuna verde lucky"
  },
  {
    "name": "Albero",
    "value": "🌳",
    "keywords": "albero tree natura bosco"
  },
  {
    "name": "Fungo",
    "value": "🍄",
    "keywords": "fungo bosco fiaba natura"
  },
  {
    "name": "Gatto",
    "value": "🐱",
    "keywords": "gatto cat animale miao"
  },
  {
    "name": "Cane",
    "value": "🐶",
    "keywords": "cane dog animale bau"
  },
  {
    "name": "Coniglio",
    "value": "🐰",
    "keywords": "coniglio rabbit animale bunny"
  },
  {
    "name": "Volpe",
    "value": "🦊",
    "keywords": "volpe fox animale bosco"
  },
  {
    "name": "Panda",
    "value": "🐼",
    "keywords": "panda animale orso"
  },
  {
    "name": "Koala",
    "value": "🐨",
    "keywords": "koala animale"
  },
  {
    "name": "Leone",
    "value": "🦁",
    "keywords": "leone lion animale re"
  },
  {
    "name": "Tigre",
    "value": "🐯",
    "keywords": "tigre tiger animale"
  },
  {
    "name": "Unicorno",
    "value": "🦄",
    "keywords": "unicorno unicorn magia cavallo"
  },
  {
    "name": "Cavallo",
    "value": "🐴",
    "keywords": "cavallo horse animale"
  },
  {
    "name": "Farfalla",
    "value": "🦋",
    "keywords": "farfalla butterfly animale insetto"
  },
  {
    "name": "Coccinella",
    "value": "🐞",
    "keywords": "coccinella ladybug insetto fortuna"
  },
  {
    "name": "Ape",
    "value": "🐝",
    "keywords": "ape bee insetto miele"
  },
  {
    "name": "Pesce",
    "value": "🐠",
    "keywords": "pesce fish mare acqua"
  },
  {
    "name": "Delfino",
    "value": "🐬",
    "keywords": "delfino dolphin mare acqua"
  },
  {
    "name": "Balena",
    "value": "🐳",
    "keywords": "balena whale mare acqua"
  },
  {
    "name": "Tartaruga",
    "value": "🐢",
    "keywords": "tartaruga turtle animale"
  },
  {
    "name": "Dinosauro",
    "value": "🦖",
    "keywords": "dinosauro dino rex animale"
  },
  {
    "name": "Brontosauro",
    "value": "🦕",
    "keywords": "dinosauro bronto animale"
  },
  {
    "name": "Drago",
    "value": "🐉",
    "keywords": "drago dragon fantasy"
  },
  {
    "name": "Principessa",
    "value": "👑",
    "keywords": "principessa corona queen re regina princess"
  },
  {
    "name": "Castello",
    "value": "🏰",
    "keywords": "castello castle principessa favola"
  },
  {
    "name": "Fata",
    "value": "🧚",
    "keywords": "fata fairy magia favola"
  },
  {
    "name": "Sirena",
    "value": "🧜",
    "keywords": "sirena mermaid mare fantasy"
  },
  {
    "name": "Magia",
    "value": "🪄",
    "keywords": "bacchetta magia magic wand"
  },
  {
    "name": "Gemma",
    "value": "💎",
    "keywords": "diamante gemma brillante jewel"
  },
  {
    "name": "Casa",
    "value": "🏠",
    "keywords": "casa home house"
  },
  {
    "name": "Scuola",
    "value": "🏫",
    "keywords": "scuola school classe"
  },
  {
    "name": "Tenda",
    "value": "⛺",
    "keywords": "tenda campeggio camping vacanza"
  },
  {
    "name": "Auto",
    "value": "🚗",
    "keywords": "auto car macchina veicolo"
  },
  {
    "name": "Treno",
    "value": "🚂",
    "keywords": "treno train veicolo"
  },
  {
    "name": "Bici",
    "value": "🚲",
    "keywords": "bici bicicletta bike"
  },
  {
    "name": "Barca",
    "value": "⛵",
    "keywords": "barca vela mare boat"
  },
  {
    "name": "Aereo",
    "value": "✈️",
    "keywords": "aereo plane viaggio"
  },
  {
    "name": "Razzo",
    "value": "🚀",
    "keywords": "razzo rocket spazio luna"
  },
  {
    "name": "Ufo",
    "value": "🛸",
    "keywords": "ufo alieno spazio"
  },
  {
    "name": "Pianeta",
    "value": "🪐",
    "keywords": "pianeta spazio saturno"
  },
  {
    "name": "Palla",
    "value": "⚽",
    "keywords": "palla calcio football sport"
  },
  {
    "name": "Basket",
    "value": "🏀",
    "keywords": "basket sport palla"
  },
  {
    "name": "Tennis",
    "value": "🎾",
    "keywords": "tennis sport palla"
  },
  {
    "name": "Medaglia",
    "value": "🏅",
    "keywords": "medaglia sport premio"
  },
  {
    "name": "Pizza",
    "value": "🍕",
    "keywords": "pizza cibo food"
  },
  {
    "name": "Gelato",
    "value": "🍦",
    "keywords": "gelato ice cream dolce estate"
  },
  {
    "name": "Cupcake",
    "value": "🧁",
    "keywords": "cupcake torta dolce cake"
  },
  {
    "name": "Torta",
    "value": "🎂",
    "keywords": "torta compleanno cake festa"
  },
  {
    "name": "Lecca lecca",
    "value": "🍭",
    "keywords": "lecca lecca dolce candy caramella"
  },
  {
    "name": "Popcorn",
    "value": "🍿",
    "keywords": "popcorn cinema snack"
  },
  {
    "name": "Fragola",
    "value": "🍓",
    "keywords": "fragola frutta rossa"
  },
  {
    "name": "Anguria",
    "value": "🍉",
    "keywords": "anguria watermelon estate"
  },
  {
    "name": "Regalo",
    "value": "🎁",
    "keywords": "regalo gift festa compleanno"
  },
  {
    "name": "Palloncino",
    "value": "🎈",
    "keywords": "palloncino balloon festa compleanno"
  },
  {
    "name": "Coriandoli",
    "value": "🎉",
    "keywords": "coriandoli party festa"
  },
  {
    "name": "Musica",
    "value": "🎵",
    "keywords": "musica note song canzone"
  },
  {
    "name": "Microfono",
    "value": "🎤",
    "keywords": "microfono musica cantante"
  },
  {
    "name": "Pennello",
    "value": "🖌️",
    "keywords": "pennello arte disegno paint"
  },
  {
    "name": "Tavolozza",
    "value": "🎨",
    "keywords": "tavolozza arte colori disegno"
  },
  {
    "name": "Matita",
    "value": "✏️",
    "keywords": "matita scuola disegno pencil"
  },
  {
    "name": "Libro",
    "value": "📚",
    "keywords": "libro libri scuola lettura"
  },
  {
    "name": "Sorriso",
    "value": "😊",
    "keywords": "sorriso smile felice faccina"
  },
  {
    "name": "Risata",
    "value": "😄",
    "keywords": "risata sorriso felice faccina"
  },
  {
    "name": "Wow",
    "value": "🤩",
    "keywords": "wow stelle occhi faccina"
  },
  {
    "name": "Occhiolino",
    "value": "😉",
    "keywords": "occhiolino wink faccina"
  },
  {
    "name": "Robot",
    "value": "🤖",
    "keywords": "robot tecnologia futuro"
  },
  {
    "name": "Alieno",
    "value": "👽",
    "keywords": "alieno ufo spazio"
  },
  {
    "name": "Fantasma",
    "value": "👻",
    "keywords": "fantasma halloween boo"
  },
  {
    "name": "Zucca",
    "value": "🎃",
    "keywords": "zucca halloween pumpkin"
  },
  {
    "name": "Fuoco",
    "value": "🔥",
    "keywords": "fuoco fire caldo"
  },
  {
    "name": "Fulmine",
    "value": "⚡",
    "keywords": "fulmine lightning energia"
  },
  {
    "name": "Bolla",
    "value": "🫧",
    "keywords": "bolla bolle sapone bubble"
  },
  {
    "name": "Fiocco",
    "value": "🎀",
    "keywords": "fiocco rosa regalo ribbon"
  }
];

const BACKGROUNDS = [
  {
    "id": "white",
    "name": "Bianco",
    "keywords": "bianco white foglio pulito",
    "css": "#ffffff"
  },
  {
    "id": "paper",
    "name": "Carta crema",
    "keywords": "carta foglio crema paper caldo",
    "css": "radial-gradient(circle, rgba(222,184,135,0.18) 1px, transparent 2px), #fffaf0"
  },
  {
    "id": "grid",
    "name": "Quadretti",
    "keywords": "quadretti griglia grid quaderno scuola",
    "css": "linear-gradient(90deg, rgba(184, 205, 255, 0.55) 1px, transparent 1px), linear-gradient(rgba(184, 205, 255, 0.55) 1px, transparent 1px), #ffffff"
  },
  {
    "id": "lines",
    "name": "Righe",
    "keywords": "righe quaderno scuola lines paper",
    "css": "linear-gradient(rgba(116,164,255,0.34) 1px, transparent 1px), #ffffff"
  },
  {
    "id": "dots",
    "name": "Pois",
    "keywords": "pois dots puntini coriandoli",
    "css": "radial-gradient(circle, rgba(255,122,168,0.45) 2px, transparent 3px), #ffffff"
  },
  {
    "id": "pink",
    "name": "Rosa",
    "keywords": "rosa pink sfumato gradient",
    "css": "linear-gradient(135deg, #fff0f7 0%, #ffd6e7 100%)"
  },
  {
    "id": "sky",
    "name": "Cielo",
    "keywords": "cielo sky nuvole azzurro",
    "css": "linear-gradient(180deg, #bfe9ff 0%, #ffffff 100%)"
  },
  {
    "id": "night",
    "name": "Notte",
    "keywords": "notte night stelle spazio luna blu",
    "css": "radial-gradient(circle at 20% 18%, rgba(255,255,255,0.9) 1px, transparent 2px), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.75) 1px, transparent 2px), linear-gradient(180deg, #1f2a68 0%, #070b25 100%)"
  },
  {
    "id": "space",
    "name": "Spazio",
    "keywords": "spazio pianeti stelle rocket space",
    "css": "radial-gradient(circle at 76% 22%, #ffdf7a 0 24px, transparent 25px), radial-gradient(circle at 18% 72%, #8be9ff 0 18px, transparent 19px), linear-gradient(180deg, #27106d 0%, #070720 100%)"
  },
  {
    "id": "grass",
    "name": "Prato",
    "keywords": "prato erba grass verde natura",
    "css": "linear-gradient(180deg, #d9f7ff 0%, #ffffff 55%, #b7ef9a 55%, #66c45f 100%)"
  },
  {
    "id": "forest",
    "name": "Bosco",
    "keywords": "bosco foresta alberi verde natura",
    "css": "linear-gradient(180deg, #d7f6ff 0%, #f9fff8 45%, #7fd18a 46%, #2c7a46 100%)"
  },
  {
    "id": "sea",
    "name": "Mare",
    "keywords": "mare sea acqua spiaggia estate blu",
    "css": "linear-gradient(180deg, #bdefff 0%, #fef6c9 45%, #65d5f6 46%, #1e9bd7 100%)"
  },
  {
    "id": "underwater",
    "name": "Sott'acqua",
    "keywords": "mare pesci acqua bolle underwater blu",
    "css": "radial-gradient(circle at 18% 28%, rgba(255,255,255,0.7) 0 6px, transparent 7px), radial-gradient(circle at 78% 58%, rgba(255,255,255,0.55) 0 9px, transparent 10px), linear-gradient(180deg, #77e4ff 0%, #0874b9 100%)"
  },
  {
    "id": "rainbow",
    "name": "Rainbow",
    "keywords": "arcobaleno rainbow colori colorato",
    "css": "linear-gradient(135deg, #ff9aa2, #ffdac1, #ffffb5, #b5ead7, #c7ceea)"
  },
  {
    "id": "sunset",
    "name": "Tramonto",
    "keywords": "tramonto sunset sole arancio mare",
    "css": "radial-gradient(circle at 50% 45%, #ffe066 0 34px, transparent 35px), linear-gradient(180deg, #ff9a9e 0%, #fad0c4 55%, #63cdda 56%, #1289a7 100%)"
  },
  {
    "id": "snow",
    "name": "Neve",
    "keywords": "neve inverno snow ghiaccio azzurro",
    "css": "radial-gradient(circle, rgba(255,255,255,0.95) 2px, transparent 3px), linear-gradient(180deg, #dff7ff 0%, #ffffff 100%)"
  },
  {
    "id": "candy",
    "name": "Caramelle",
    "keywords": "caramelle candy dolce righe rosa",
    "css": "repeating-linear-gradient(135deg, #fff 0 18px, #ffe0ef 18px 36px, #d9f7ff 36px 54px)"
  },
  {
    "id": "confetti",
    "name": "Festa",
    "keywords": "festa party coriandoli compleanno confetti",
    "css": "radial-gradient(circle at 10% 20%, #ff7aa8 0 4px, transparent 5px), radial-gradient(circle at 78% 26%, #ffd166 0 4px, transparent 5px), radial-gradient(circle at 50% 74%, #6ee7b7 0 4px, transparent 5px), linear-gradient(135deg, #ffffff, #fff0f7)"
  },
  {
    "id": "hearts",
    "name": "Cuoricini",
    "keywords": "cuori hearts amore rosa",
    "css": "radial-gradient(circle at 20% 30%, rgba(255,122,168,0.35) 0 10px, transparent 11px), radial-gradient(circle at 80% 68%, rgba(255,122,168,0.28) 0 12px, transparent 13px), #fff7fb"
  }
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
    version: 3,
    backgroundId: currentBackgroundId,
    stickers: stickers.map((sticker) => ({ ...sticker })),
    drawingDataUrl: canvas.toDataURL("image/png"),
  };
}

async function restoreProject(project) {
  const safeProject = project || {};
  currentBackgroundId = safeProject.backgroundId || "white";
  stickers = Array.isArray(safeProject.stickers)
    ? safeProject.stickers.map((sticker) => ({ rotation: 0, ...sticker }))
    : [];
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

function normalizeDegrees(value) {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function getStickerTransform(sticker) {
  return `translate(-50%, -50%) rotate(${sticker.rotation || 0}deg)`;
}

function updateZoomControls() {
  zoomOutButton.disabled = view.zoom <= MIN_ZOOM + 0.001;
  zoomInButton.disabled = view.zoom >= MAX_ZOOM - 0.001;
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
  updateZoomControls();
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

function getAssetName(item) {
  return item.name || item.title || item.id || "Elemento";
}

function getAssetKeywords(item) {
  const tags = Array.isArray(item.tags) ? item.tags.join(" ") : "";
  return `${item.keywords || ""} ${tags} ${item.category || ""}`.trim();
}

function getAllStickers() {
  return [...STICKERS, ...sharedLibrary.stickers, ...uploadedLibrary.stickers];
}

function getAllBackgrounds() {
  return [...BACKGROUNDS, ...sharedLibrary.backgrounds, ...uploadedLibrary.backgrounds];
}

function updateLibraryStatus(message) {
  if (libraryStatus) {
    libraryStatus.textContent = message;
  }
}

function updateGenerateStatus(message, kind = "info") {
  if (!generateStatus) {
    return;
  }
  generateStatus.textContent = message;
  generateStatus.dataset.kind = kind;
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}



function updateCombinedLibraryStatus(prefix = "") {
  const sharedCount = sharedLibrary.stickers.length + sharedLibrary.backgrounds.length;
  const localCount = uploadedLibrary.stickers.length + uploadedLibrary.backgrounds.length;
  const message = `Condivisi: ${sharedLibrary.stickers.length} sticker, ${sharedLibrary.backgrounds.length} sfondi. Locali: ${uploadedLibrary.stickers.length} sticker, ${uploadedLibrary.backgrounds.length} sfondi.`;
  updateLibraryStatus(prefix ? `${prefix} ${message}` : message);
  return { sharedCount, localCount };
}

function isAllowedSharedAsset(asset) {
  if (!asset || typeof asset !== "object") {
    return false;
  }
  const category = String(asset.category || "").toLowerCase();
  const pack = String(asset.pack || "").toLowerCase();
  const source = String(asset.source || "").toLowerCase();
  if (asset.generated === true || asset.imported === true) {
    return false;
  }
  if (["generated", "imported", "iconify", "ai"].includes(category)) {
    return false;
  }
  if (pack.startsWith("generated-") || source === "iconify") {
    return false;
  }
  return true;
}

function makeSharedAssetUrl(src) {
  if (!src || typeof src !== "string") {
    return null;
  }
  if (src.startsWith("data:image/")) {
    return src;
  }
  try {
    const url = new URL(src, REMOTE_LIBRARY_URL);
    if (url.protocol !== "https:" || url.origin !== REMOTE_LIBRARY_ORIGIN) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function fetchAsDataUrl(url) {
  if (!url || url.startsWith("data:image/")) {
    return url;
  }
  const response = await fetch(url, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`Asset non disponibile: ${response.status}`);
  }
  return blobToDataUrl(await response.blob());
}

async function normalizeSharedAsset(asset, kind) {
  if (!isAllowedSharedAsset(asset)) {
    return null;
  }
  const id = String(asset.id || asset.name || asset.title || "").trim();
  const name = String(asset.name || asset.title || id || "Elemento").trim();
  const url = makeSharedAssetUrl(asset.src);
  if (!id || !name || !url) {
    return null;
  }
  const tags = Array.isArray(asset.tags) ? asset.tags.map(String) : [];
  const normalized = {
    id: `shared:${id}`,
    remoteId: id,
    kind: kind === "stickers" ? "sticker" : "background",
    type: "image",
    name,
    title: name,
    category: String(asset.category || "shared"),
    keywords: `${asset.keywords || ""} ${tags.join(" ")} ${asset.category || ""}`.trim(),
    tags,
    src: url,
    dataUrl: null,
    isShared: true,
    canDelete: Boolean(asset.canDelete) || String(asset.category || "").toLowerCase() === "custom" || /^stickers\/custom\//.test(String(asset.src || "")) || /^backgrounds\/custom\//.test(String(asset.src || "")),
    source: "shared-library",
  };
  normalized.dataUrl = await fetchAsDataUrl(url).catch(() => null);
  return normalized;
}

function readPendingSharedAssets() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PENDING_SHARED_STORAGE_KEY) || "[]");
    const now = Date.now();
    return Array.isArray(parsed)
      ? parsed.filter((item) => item && Number(item.expiresAt || 0) > now)
      : [];
  } catch {
    return [];
  }
}

function writePendingSharedAssets(items) {
  try {
    localStorage.setItem(PENDING_SHARED_STORAGE_KEY, JSON.stringify(items.slice(-80)));
  } catch {
    // Se lo storage è pieno, la libreria remota continuerà comunque ad aggiornarsi.
  }
}

function rememberPendingSharedAsset(asset) {
  const pending = readPendingSharedAssets().filter((item) => item.remoteId !== asset.remoteId);
  pending.push({ ...asset, expiresAt: Date.now() + 30 * 60 * 1000 });
  writePendingSharedAssets(pending);
}

function forgetPendingSharedAsset(remoteId) {
  writePendingSharedAssets(readPendingSharedAssets().filter((item) => item.remoteId !== remoteId));
}

function mergePendingSharedAssets(library) {
  const pending = readPendingSharedAssets();
  if (!pending.length) {
    return library;
  }

  const knownIds = new Set([
    ...library.stickers.map((item) => item.remoteId || item.id),
    ...library.backgrounds.map((item) => item.remoteId || item.id),
  ]);
  const stillPending = [];

  for (const item of pending) {
    if (knownIds.has(item.remoteId)) {
      continue;
    }
    const cleanItem = { ...item };
    delete cleanItem.expiresAt;
    if (cleanItem.kind === "sticker") {
      library.stickers.push(cleanItem);
    } else if (cleanItem.kind === "background") {
      library.backgrounds.push(cleanItem);
    }
    stillPending.push(item);
  }

  writePendingSharedAssets(stillPending);
  return library;
}

async function normalizeSharedLibrary(rawLibrary) {
  const rawStickers = Array.isArray(rawLibrary?.stickers) ? rawLibrary.stickers : [];
  const rawBackgrounds = Array.isArray(rawLibrary?.backgrounds) ? rawLibrary.backgrounds : [];
  const stickers = [];
  const backgrounds = [];

  for (const sticker of rawStickers.slice(0, 250)) {
    const normalized = await normalizeSharedAsset(sticker, "stickers");
    if (normalized) {
      stickers.push(normalized);
    }
  }
  for (const background of rawBackgrounds.slice(0, 160)) {
    const normalized = await normalizeSharedAsset(background, "backgrounds");
    if (normalized) {
      backgrounds.push(normalized);
    }
  }
  return mergePendingSharedAssets({
    version: Number(rawLibrary?.version) || 0,
    updatedAt: String(rawLibrary?.updatedAt || ""),
    stickers,
    backgrounds,
  });
}

async function readSharedLibraryCache() {
  try {
    const record = await requestFromStore("readonly", (store) => store.get(SHARED_LIBRARY_CACHE_ID), SHARED_LIBRARY_STORE_NAME);
    return record?.library || null;
  } catch {
    return null;
  }
}

async function saveSharedLibraryCache(library) {
  try {
    await commitToStore((store) => store.put({ id: SHARED_LIBRARY_CACHE_ID, library, cachedAt: new Date().toISOString() }), SHARED_LIBRARY_STORE_NAME);
  } catch {
    // Se lo spazio offline è pieno, l'app continua a funzionare online e con i caricamenti locali.
  }
}

async function loadSharedLibrary(options = {}) {
  const { force = false } = options;
  const cached = await readSharedLibraryCache();

  if (cached && !force) {
    sharedLibrary = cached;
    updateCombinedLibraryStatus("Offline/cache pronta.");
    renderAssetGrid();
  }

  try {
    updateLibraryStatus(force ? "Aggiorno la libreria condivisa…" : "Controllo la libreria condivisa…");
    const response = await fetch(`${REMOTE_LIBRARY_URL}?t=${Date.now()}`, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`Libreria non disponibile: ${response.status}`);
    }
    const rawLibrary = await response.json();
    sharedLibrary = await normalizeSharedLibrary(rawLibrary);
    await saveSharedLibraryCache(sharedLibrary);
    updateCombinedLibraryStatus("Libreria condivisa aggiornata.");
    renderAssetGrid();
  } catch {
    if (cached) {
      sharedLibrary = cached;
      updateCombinedLibraryStatus("Offline: uso la libreria condivisa salvata.");
      renderAssetGrid();
    } else {
      sharedLibrary = { version: 0, updatedAt: "", stickers: [], backgrounds: [] };
      updateCombinedLibraryStatus("Libreria condivisa non raggiungibile.");
    }
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function titleFromFilename(filename) {
  return String(filename || "Elemento")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 42) || "Elemento";
}

function keywordsFromFilename(filename) {
  return titleFromFilename(filename).toLowerCase();
}

function getUploadScope() {
  return uploadScopeShared?.checked ? "shared" : "local";
}

function canvasToBlob(canvas, type = "image/png", quality = 0.92) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Impossibile convertire l'immagine."));
      }
    }, type, quality);
  });
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Immagine non leggibile."));
    };
    image.src = url;
  });
}

function makeCanvas(width, height) {
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(width));
  out.height = Math.max(1, Math.round(height));
  return out;
}

function colorDistanceSq(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return dr * dr + dg * dg + db * db;
}

function collectEdgePalette(data, width, height) {
  const counts = new Map();
  const step = Math.max(1, Math.floor(Math.max(width, height) / 260));
  const add = (x, y) => {
    const i = (y * width + x) * 4;
    const a = data[i + 3];
    if (a < 20) {
      return;
    }
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = `${Math.round(r / 16) * 16},${Math.round(g / 16) * 16},${Math.round(b / 16) * 16}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  };

  for (let x = 0; x < width; x += step) {
    add(x, 0);
    add(x, height - 1);
  }
  for (let y = 0; y < height; y += step) {
    add(0, y);
    add(width - 1, y);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([key]) => key.split(",").map(Number));
}

function removeOuterBackground(imageData, width, height) {
  const data = imageData.data;
  const palette = collectEdgePalette(data, width, height);
  const toleranceSq = 42 * 42;
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const isCandidateBackground = (index) => {
    const offset = index * 4;
    const alpha = data[offset + 3];
    if (alpha < 18) {
      return true;
    }
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    for (const color of palette) {
      if (colorDistanceSq(r, g, b, color[0], color[1], color[2]) <= toleranceSq) {
        return true;
      }
    }
    return false;
  };

  const push = (index) => {
    if (index < 0 || index >= total || visited[index] || !isCandidateBackground(index)) {
      return;
    }
    visited[index] = 1;
    queue[tail++] = index;
  };

  for (let x = 0; x < width; x += 1) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    push(y * width);
    push(y * width + width - 1);
  }

  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    const y = Math.floor(index / width);
    if (x > 0) push(index - 1);
    if (x < width - 1) push(index + 1);
    if (y > 0) push(index - width);
    if (y < height - 1) push(index + width);
  }

  for (let i = 0; i < total; i += 1) {
    if (visited[i]) {
      data[i * 4 + 3] = 0;
    }
  }

  return imageData;
}

function findAlphaBounds(imageData, width, height) {
  const data = imageData.data;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 24) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < 0 || maxY < 0) {
    return { x: 0, y: 0, width, height };
  }

  const pad = Math.max(8, Math.round(Math.max(width, height) * 0.035));
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

async function processStickerFile(file) {
  const image = await loadImageFromFile(file);
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  if (!sourceWidth || !sourceHeight) {
    throw new Error("Sticker non valido.");
  }

  const scale = Math.min(1, STICKER_OUTPUT_MAX_SIZE / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));
  const work = makeCanvas(width, height);
  const workCtx = work.getContext("2d", { willReadFrequently: true });
  workCtx.clearRect(0, 0, width, height);
  workCtx.drawImage(image, 0, 0, width, height);

  let imageData = workCtx.getImageData(0, 0, width, height);
  imageData = removeOuterBackground(imageData, width, height);
  workCtx.putImageData(imageData, 0, 0);

  const bounds = findAlphaBounds(imageData, width, height);
  const out = makeCanvas(bounds.width, bounds.height);
  const outCtx = out.getContext("2d");
  outCtx.clearRect(0, 0, out.width, out.height);
  outCtx.drawImage(work, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, out.width, out.height);

  const blob = await canvasToBlob(out, "image/png");
  return {
    dataUrl: await blobToDataUrl(blob),
    mimeType: "image/png",
    extension: "png",
    width: out.width,
    height: out.height,
    bytes: blob.size,
    wasProcessed: true,
  };
}

function currentBoardAspect() {
  const rect = board.getBoundingClientRect();
  const width = rect.width || board.clientWidth || 4;
  const height = rect.height || board.clientHeight || 3;
  return clamp(width / height, 0.55, 2.4);
}

async function processBackgroundFile(file) {
  const image = await loadImageFromFile(file);
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  if (!sourceWidth || !sourceHeight) {
    throw new Error("Sfondo non valido.");
  }

  const aspect = currentBoardAspect();
  let targetWidth = BACKGROUND_OUTPUT_WIDTH;
  let targetHeight = Math.round(targetWidth / aspect);
  if (targetHeight > BACKGROUND_OUTPUT_MAX_HEIGHT) {
    targetHeight = BACKGROUND_OUTPUT_MAX_HEIGHT;
    targetWidth = Math.round(targetHeight * aspect);
  }

  const out = makeCanvas(targetWidth, targetHeight);
  const outCtx = out.getContext("2d");
  outCtx.fillStyle = "#ffffff";
  outCtx.fillRect(0, 0, out.width, out.height);
  drawImageCover(outCtx, image, out.width, out.height);

  let blob = await canvasToBlob(out, "image/jpeg", 0.86);
  if (blob.size > 2.7 * 1024 * 1024) {
    blob = await canvasToBlob(out, "image/jpeg", 0.76);
  }

  return {
    dataUrl: await blobToDataUrl(blob),
    mimeType: "image/jpeg",
    extension: "jpg",
    width: out.width,
    height: out.height,
    bytes: blob.size,
    wasProcessed: true,
  };
}

async function processAssetFile(file, kind) {
  return kind === "sticker" ? processStickerFile(file) : processBackgroundFile(file);
}

function getAdminPin() {
  let pin = localStorage.getItem(ADMIN_PIN_STORAGE_KEY) || "";
  if (pin) {
    return pin;
  }
  pin = window.prompt("PIN admin per caricare nella libreria condivisa:") || "";
  pin = pin.trim();
  if (pin) {
    localStorage.setItem(ADMIN_PIN_STORAGE_KEY, pin);
  }
  return pin;
}

async function postSharedAsset(endpoint, body) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem(ADMIN_PIN_STORAGE_KEY);
    }
    throw new Error(payload.reason || payload.message || "Operazione condivisa non riuscita.");
  }
  return payload;
}

function normalizeApiSharedAsset(asset, kind, dataUrl = null) {
  const remoteId = String(asset.id || "");
  const name = String(asset.name || asset.title || remoteId || "Elemento");
  const tags = Array.isArray(asset.tags) ? asset.tags.map(String) : [];
  const src = asset.url || makeSharedAssetUrl(asset.src) || dataUrl;
  return {
    id: `shared:${remoteId}`,
    remoteId,
    kind,
    type: "image",
    name,
    title: name,
    category: String(asset.category || "custom"),
    keywords: `${asset.keywords || ""} ${tags.join(" ")} custom`.trim(),
    tags,
    src,
    dataUrl,
    isShared: true,
    canDelete: true,
    source: "shared-library",
  };
}

function upsertSharedAssetInMemory(record) {
  const list = record.kind === "sticker" ? sharedLibrary.stickers : sharedLibrary.backgrounds;
  const index = list.findIndex((item) => item.remoteId === record.remoteId || item.id === record.id);
  if (index >= 0) {
    list[index] = record;
  } else {
    list.push(record);
  }
}

async function uploadSharedAsset(file, kind, processed) {
  const pin = getAdminPin();
  if (!pin) {
    throw new Error("Upload condiviso annullato: PIN mancante.");
  }
  const name = titleFromFilename(file.name);
  const keywords = keywordsFromFilename(file.name);
  const payload = await postSharedAsset(SHARED_UPLOAD_URL, {
    pin,
    kind,
    name,
    keywords,
    tags: keywords.split(/\s+/).filter(Boolean),
    mimeType: processed.mimeType,
    extension: processed.extension,
    width: processed.width,
    height: processed.height,
    dataUrl: processed.dataUrl,
  });

  const normalized = normalizeApiSharedAsset(payload.asset, kind, processed.dataUrl);
  upsertSharedAssetInMemory(normalized);
  rememberPendingSharedAsset(normalized);
  await saveSharedLibraryCache(sharedLibrary);
  return normalized;
}

async function saveLocalAsset(file, kind, processed) {
  const name = titleFromFilename(file.name);
  const id = `manual-${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const record = {
    id,
    kind,
    type: "image",
    name,
    title: name,
    category: "manual",
    keywords: keywordsFromFilename(file.name),
    tags: keywordsFromFilename(file.name).split(/\s+/).filter(Boolean),
    dataUrl: processed.dataUrl,
    mimeType: processed.mimeType,
    width: processed.width,
    height: processed.height,
    isUploaded: true,
    source: "manual-local",
    createdAt: new Date().toISOString(),
  };
  await putUploadedAsset(record);
  return record;
}

async function loadUploadedAssets() {
  try {
    const records = await getAllUploadedAssets();
    uploadedLibrary = {
      stickers: records.filter((item) => item.kind === "sticker"),
      backgrounds: records.filter((item) => item.kind === "background"),
    };
    updateCombinedLibraryStatus();
    renderAssetGrid();
  } catch {
    uploadedLibrary = { stickers: [], backgrounds: [] };
    updateLibraryStatus("Non riesco a leggere i caricamenti locali. Gli elementi base funzionano comunque.");
  }
}

async function loadRemoteLibrary(options = {}) {
  localStorage.removeItem("vicky-draw-remote-library-v1");
  await loadUploadedAssets();
  await loadSharedLibrary(options);
  updateCombinedLibraryStatus();
}

async function handleAssetUpload(files, kind) {
  const list = Array.from(files || []);
  if (!list.length) {
    return;
  }

  const scope = getUploadScope();
  let imported = 0;
  let skipped = 0;
  let sharedImported = 0;
  const errors = [];

  updateGenerateStatus(`Preparo ${list.length} file…`, "info");

  for (const file of list) {
    if (!file.type.startsWith("image/")) {
      skipped += 1;
      continue;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      skipped += 1;
      continue;
    }

    try {
      updateGenerateStatus(`Converto ${file.name}…`, "info");
      const processed = await processAssetFile(file, kind);
      if (scope === "shared") {
        updateGenerateStatus(`Pubblico ${file.name} nella libreria condivisa…`, "info");
        await uploadSharedAsset(file, kind, processed);
        sharedImported += 1;
      } else {
        await saveLocalAsset(file, kind, processed);
        imported += 1;
      }
    } catch (error) {
      skipped += 1;
      errors.push(`${file.name}: ${error.message || "errore"}`);
    }
  }

  await loadUploadedAssets();
  setAssetKind(kind === "sticker" ? "stickers" : "backgrounds");
  renderAssetGrid();

  const totalOk = imported + sharedImported;
  const where = scope === "shared" ? "condivisa" : "locale";
  const base = totalOk
    ? `Caricati ${totalOk} elementi nella libreria ${where}.`
    : "Nessun file caricato.";
  const suffix = skipped ? ` ${skipped} file saltati.` : "";
  const delay = scope === "shared" && sharedImported ? " Gli altri dispositivi li vedranno dopo l'aggiornamento di GitHub Pages; su questo dispositivo sono già in cache." : "";
  updateGenerateStatus(`${base}${suffix}${delay}${errors.length ? ` ${errors[0]}` : ""}`, totalOk ? "success" : "warn");
  setStatus(totalOk ? `Libreria ${where} aggiornata` : "Nessun file caricato");
}

async function deleteUploadedAsset(assetId, label = "questo elemento") {
  const confirmed = window.confirm(`Vuoi eliminare ${label} dalla libreria locale di questo dispositivo?`);
  if (!confirmed) {
    return;
  }

  await deleteUploadedAssetRecord(assetId);
  if (currentBackgroundId === assetId) {
    applyBackground("white", { pushToHistory: true, autosave: true });
  }
  await loadUploadedAssets();
  updateGenerateStatus(`${label} eliminato dalla libreria locale.`, "success");
}

async function deleteSharedAsset(record) {
  const label = getAssetName(record);
  const confirmed = window.confirm(`Vuoi eliminare ${label} dalla libreria condivisa di tutti i dispositivi?`);
  if (!confirmed) {
    return;
  }
  const pin = getAdminPin();
  if (!pin) {
    updateGenerateStatus("Eliminazione condivisa annullata: PIN mancante.", "warn");
    return;
  }

  try {
    await postSharedAsset(SHARED_DELETE_URL, {
      pin,
      id: record.remoteId,
      src: record.src,
    });
    sharedLibrary.stickers = sharedLibrary.stickers.filter((item) => item.remoteId !== record.remoteId);
    sharedLibrary.backgrounds = sharedLibrary.backgrounds.filter((item) => item.remoteId !== record.remoteId);
    forgetPendingSharedAsset(record.remoteId);
    if (currentBackgroundId === record.id) {
      applyBackground("white", { pushToHistory: true, autosave: true });
    }
    await saveSharedLibraryCache(sharedLibrary);
    renderAssetGrid();
    updateCombinedLibraryStatus(`${label} eliminato.`);
    updateGenerateStatus(`${label} eliminato dalla libreria condivisa.`, "success");
  } catch (error) {
    updateGenerateStatus(error.message || "Eliminazione condivisa non riuscita.", "warn");
  }
}

async function clearUploadedAssets() {
  const total = uploadedLibrary.stickers.length + uploadedLibrary.backgrounds.length;
  if (!total) {
    updateGenerateStatus("Non ci sono elementi caricati da cancellare.", "warn");
    return;
  }
  const confirmed = window.confirm(`Vuoi cancellare tutti i ${total} elementi caricati manualmente da questo dispositivo?`);
  if (!confirmed) {
    return;
  }

  await clearUploadedAssetRecords();
  if (getBackground(currentBackgroundId)?.isUploaded) {
    applyBackground("white", { pushToHistory: true, autosave: true });
  }
  await loadUploadedAssets();
  updateGenerateStatus("Libreria manuale svuotata.", "success");
}

function getBackground(id) {
  return getAllBackgrounds().find((background) => background.id === id) || BACKGROUNDS[0];
}

function applyBackground(id, options = {}) {
  const { pushToHistory = true, autosave = true } = options;

  if (pushToHistory) {
    pushHistory();
  }

  const background = getBackground(id);
  currentBackgroundId = background.id;

  if (background.src || background.dataUrl) {
    const imageSource = background.dataUrl || background.src;
    board.style.background = "#ffffff";
    board.style.backgroundImage = `url("${imageSource}")`;
    board.style.backgroundRepeat = "no-repeat";
    board.style.backgroundPosition = "center";
    board.style.backgroundSize = "cover";
  } else {
    board.style.backgroundImage = "";
    board.style.background = background.css || "#ffffff";
    board.style.backgroundSize = currentBackgroundId === "grid" ? "24px 24px" : currentBackgroundId === "dots" ? "26px 26px" : "auto";
  }

  if (autosave) {
    scheduleAutosave();
    setStatus(`Sfondo ${getAssetName(background).toLowerCase()} applicato`);
  }
}

function drawBackgroundOnContext(targetCtx, width, height, backgroundId) {
  const bg = getBackground(backgroundId);
  const boardSize = getBoardSize();
  const scale = width / boardSize.width;

  function fillSolid(color) {
    targetCtx.fillStyle = color;
    targetCtx.fillRect(0, 0, width, height);
  }

  function fillLinear(colors, vertical = true) {
    const gradient = vertical ? targetCtx.createLinearGradient(0, 0, 0, height) : targetCtx.createLinearGradient(0, 0, width, height);
    colors.forEach(([stop, color]) => gradient.addColorStop(stop, color));
    targetCtx.fillStyle = gradient;
    targetCtx.fillRect(0, 0, width, height);
  }

  function drawDots(color, gap, radius, offset = 0) {
    targetCtx.fillStyle = color;
    for (let y = gap / 2 + offset; y < height; y += gap) {
      for (let x = gap / 2 + offset; x < width; x += gap) {
        targetCtx.beginPath();
        targetCtx.arc(x, y, radius, 0, Math.PI * 2);
        targetCtx.fill();
      }
    }
  }

  targetCtx.save();
  targetCtx.clearRect(0, 0, width, height);

  if (bg.id === "white") {
    fillSolid("#ffffff");
  } else if (bg.id === "paper") {
    fillSolid("#fffaf0");
    drawDots("rgba(222,184,135,0.18)", 18 * scale, 1.3 * scale);
  } else if (bg.id === "grid") {
    fillSolid("#ffffff");
    targetCtx.strokeStyle = "rgba(126, 158, 234, 0.42)";
    targetCtx.lineWidth = Math.max(1, scale);
    const gap = 24 * scale;
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
  } else if (bg.id === "lines") {
    fillSolid("#ffffff");
    targetCtx.strokeStyle = "rgba(116,164,255,0.36)";
    targetCtx.lineWidth = Math.max(1, scale);
    const gap = 32 * scale;
    for (let y = gap; y <= height; y += gap) {
      targetCtx.beginPath();
      targetCtx.moveTo(0, y);
      targetCtx.lineTo(width, y);
      targetCtx.stroke();
    }
    targetCtx.strokeStyle = "rgba(255,122,168,0.38)";
    targetCtx.beginPath();
    targetCtx.moveTo(58 * scale, 0);
    targetCtx.lineTo(58 * scale, height);
    targetCtx.stroke();
  } else if (bg.id === "dots") {
    fillSolid("#ffffff");
    drawDots("rgba(255,122,168,0.45)", 26 * scale, 2.8 * scale);
  } else if (bg.id === "pink") {
    fillLinear([[0, "#fff0f7"], [1, "#ffd6e7"]], false);
  } else if (bg.id === "sky") {
    fillLinear([[0, "#bfe9ff"], [1, "#ffffff"]]);
  } else if (bg.id === "night") {
    fillLinear([[0, "#1f2a68"], [1, "#070b25"]]);
    targetCtx.fillStyle = "rgba(255,255,255,0.85)";
    const stars = [[0.18,0.18],[0.42,0.12],[0.72,0.28],[0.86,0.16],[0.61,0.45],[0.29,0.36]];
    for (const [x, y] of stars) {
      targetCtx.beginPath();
      targetCtx.arc(width * x, height * y, Math.max(1.4, width * 0.0025), 0, Math.PI * 2);
      targetCtx.fill();
    }
  } else if (bg.id === "space") {
    fillLinear([[0, "#27106d"], [1, "#070720"]]);
    drawDots("rgba(255,255,255,0.82)", 46 * scale, 1.5 * scale, 6 * scale);
    targetCtx.fillStyle = "#ffdf7a";
    targetCtx.beginPath();
    targetCtx.arc(width * 0.76, height * 0.22, 34 * scale, 0, Math.PI * 2);
    targetCtx.fill();
    targetCtx.fillStyle = "#8be9ff";
    targetCtx.beginPath();
    targetCtx.arc(width * 0.18, height * 0.72, 24 * scale, 0, Math.PI * 2);
    targetCtx.fill();
  } else if (bg.id === "grass") {
    fillLinear([[0, "#d9f7ff"], [1, "#ffffff"]]);
    const grass = targetCtx.createLinearGradient(0, height * 0.55, 0, height);
    grass.addColorStop(0, "#b7ef9a");
    grass.addColorStop(1, "#66c45f");
    targetCtx.fillStyle = grass;
    targetCtx.fillRect(0, height * 0.55, width, height * 0.45);
  } else if (bg.id === "forest") {
    fillLinear([[0, "#d7f6ff"], [0.44, "#f9fff8"], [1, "#2c7a46"]]);
    targetCtx.fillStyle = "#7fd18a";
    targetCtx.fillRect(0, height * 0.46, width, height * 0.18);
    for (let x = 35 * scale; x < width; x += 86 * scale) {
      targetCtx.fillStyle = "#3d9957";
      targetCtx.beginPath();
      targetCtx.moveTo(x, height * 0.47);
      targetCtx.lineTo(x - 28 * scale, height * 0.66);
      targetCtx.lineTo(x + 28 * scale, height * 0.66);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.fillStyle = "#7b4f2c";
      targetCtx.fillRect(x - 4 * scale, height * 0.63, 8 * scale, 40 * scale);
    }
  } else if (bg.id === "sea") {
    fillSolid("#bdefff");
    fillSolid("#bdefff");
    targetCtx.fillStyle = "#fef6c9";
    targetCtx.fillRect(0, height * 0.45, width, height * 0.12);
    const sea = targetCtx.createLinearGradient(0, height * 0.52, 0, height);
    sea.addColorStop(0, "#65d5f6");
    sea.addColorStop(1, "#1e9bd7");
    targetCtx.fillStyle = sea;
    targetCtx.fillRect(0, height * 0.52, width, height * 0.48);
  } else if (bg.id === "underwater") {
    fillLinear([[0, "#77e4ff"], [1, "#0874b9"]]);
    targetCtx.strokeStyle = "rgba(255,255,255,0.72)";
    targetCtx.lineWidth = Math.max(2, 2 * scale);
    const bubbles = [[0.18,0.28,10],[0.78,0.58,14],[0.36,0.72,8],[0.62,0.22,6]];
    for (const [x, y, r] of bubbles) {
      targetCtx.beginPath();
      targetCtx.arc(width * x, height * y, r * scale, 0, Math.PI * 2);
      targetCtx.stroke();
    }
  } else if (bg.id === "rainbow") {
    fillLinear([[0, "#ff9aa2"], [0.25, "#ffdac1"], [0.5, "#ffffb5"], [0.75, "#b5ead7"], [1, "#c7ceea"]], false);
  } else if (bg.id === "sunset") {
    fillLinear([[0, "#ff9a9e"], [0.55, "#fad0c4"], [0.56, "#63cdda"], [1, "#1289a7"]]);
    targetCtx.fillStyle = "#ffe066";
    targetCtx.beginPath();
    targetCtx.arc(width * 0.5, height * 0.45, 44 * scale, 0, Math.PI * 2);
    targetCtx.fill();
  } else if (bg.id === "snow") {
    fillLinear([[0, "#dff7ff"], [1, "#ffffff"]]);
    drawDots("rgba(255,255,255,0.95)", 34 * scale, 2.5 * scale);
  } else if (bg.id === "candy") {
    fillSolid("#ffffff");
    const stripe = 54 * scale;
    for (let x = -height; x < width; x += stripe) {
      targetCtx.save();
      targetCtx.translate(x, 0);
      targetCtx.rotate(-Math.PI / 4);
      targetCtx.fillStyle = "#ffe0ef";
      targetCtx.fillRect(0, 0, 18 * scale, width + height);
      targetCtx.fillStyle = "#d9f7ff";
      targetCtx.fillRect(36 * scale, 0, 18 * scale, width + height);
      targetCtx.restore();
    }
  } else if (bg.id === "confetti") {
    fillLinear([[0, "#ffffff"], [1, "#fff0f7"]], false);
    const confetti = [[0.1,0.2,"#ff7aa8"],[0.78,0.26,"#ffd166"],[0.5,0.74,"#6ee7b7"],[0.26,0.62,"#8be9ff"],[0.88,0.78,"#b39ddb"]];
    for (const [x, y, color] of confetti) {
      targetCtx.fillStyle = color;
      targetCtx.beginPath();
      targetCtx.arc(width * x, height * y, 7 * scale, 0, Math.PI * 2);
      targetCtx.fill();
    }
  } else if (bg.id === "hearts") {
    fillSolid("#fff7fb");
    targetCtx.fillStyle = "rgba(255,122,168,0.42)";
    targetCtx.font = `${36 * scale}px ${EMOJI_FONT}`;
    targetCtx.textAlign = "center";
    targetCtx.textBaseline = "middle";
    const hearts = [[0.2,0.3],[0.8,0.68],[0.48,0.18],[0.32,0.78]];
    for (const [x, y] of hearts) {
      targetCtx.fillText("❤", width * x, height * y);
    }
  } else {
    fillSolid("#ffffff");
  }

  targetCtx.restore();
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Immagine non caricata"));
    if (!src.startsWith("data:image/")) {
      image.crossOrigin = "anonymous";
    }
    image.src = src;
  });
}

function drawImageCover(targetCtx, image, width, height) {
  const sourceRatio = image.naturalWidth / image.naturalHeight || 1;
  const targetRatio = width / height || 1;
  let drawWidth = width;
  let drawHeight = height;
  let drawX = 0;
  let drawY = 0;

  if (sourceRatio > targetRatio) {
    drawHeight = height;
    drawWidth = height * sourceRatio;
    drawX = (width - drawWidth) / 2;
  } else {
    drawWidth = width;
    drawHeight = width / sourceRatio;
    drawY = (height - drawHeight) / 2;
  }

  targetCtx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

async function drawBackgroundOnContextAsync(targetCtx, width, height, backgroundId) {
  const bg = getBackground(backgroundId);
  const src = bg.dataUrl || bg.src;

  if (src) {
    targetCtx.save();
    targetCtx.clearRect(0, 0, width, height);
    targetCtx.fillStyle = "#ffffff";
    targetCtx.fillRect(0, 0, width, height);
    try {
      const image = await loadImage(src);
      drawImageCover(targetCtx, image, width, height);
    } catch {
      drawBackgroundOnContext(targetCtx, width, height, "white");
    }
    targetCtx.restore();
    return;
  }

  drawBackgroundOnContext(targetCtx, width, height, backgroundId);
}

async function createCompositeDataUrl() {
  const output = document.createElement("canvas");
  output.width = canvas.width;
  output.height = canvas.height;
  const out = output.getContext("2d");
  const size = getBoardSize();
  const scaleX = output.width / size.width;
  const scaleY = output.height / size.height;

  await drawBackgroundOnContextAsync(out, output.width, output.height, currentBackgroundId);
  out.drawImage(canvas, 0, 0, output.width, output.height);

  out.textAlign = "center";
  out.textBaseline = "middle";
  for (const sticker of stickers) {
    out.save();
    out.translate(sticker.x * scaleX, sticker.y * scaleY);
    out.rotate(((sticker.rotation || 0) * Math.PI) / 180);

    if (sticker.type === "image" && (sticker.dataUrl || sticker.src)) {
      try {
        const image = await loadImage(sticker.dataUrl || sticker.src);
        const stickerWidth = sticker.size * scaleX;
        const ratio = image.naturalHeight && image.naturalWidth ? image.naturalHeight / image.naturalWidth : 1;
        const stickerHeight = stickerWidth * ratio;
        out.drawImage(image, -stickerWidth / 2, -stickerHeight / 2, stickerWidth, stickerHeight);
      } catch {
        // Se uno sticker remoto non è caricabile, viene semplicemente saltato nell'export.
      }
    } else {
      out.font = `${sticker.size * scaleY}px ${EMOJI_FONT}`;
      out.fillText(sticker.value, 0, 0);
    }

    out.restore();
  }

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
  element.style.setProperty("--sticker-size", `${sticker.size}px`);
  element.style.transform = getStickerTransform(sticker);
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
    element.style.setProperty("--sticker-size", `${sticker.size}px`);
    element.style.transform = getStickerTransform(sticker);
    element.classList.toggle("is-selected", sticker.id === activeStickerId);
    element.classList.toggle("is-image-sticker", sticker.type === "image");

    const glyph = document.createElement("span");
    glyph.className = "sticker-glyph";
    if (sticker.type === "image" && (sticker.dataUrl || sticker.src)) {
      const image = document.createElement("img");
      image.src = sticker.dataUrl || sticker.src;
      image.alt = sticker.name || "Sticker";
      glyph.append(image);
    } else {
      glyph.textContent = sticker.value;
    }

    const resizeHandle = document.createElement("button");
    resizeHandle.type = "button";
    resizeHandle.className = "sticker-resize";
    resizeHandle.textContent = "↘";
    resizeHandle.setAttribute("aria-label", "Ridimensiona sticker");

    const rotateHandle = document.createElement("button");
    rotateHandle.type = "button";
    rotateHandle.className = "sticker-rotate";
    rotateHandle.textContent = "⟳";
    rotateHandle.setAttribute("aria-label", "Ruota sticker");

    element.addEventListener("pointerdown", (event) => beginStickerMove(event, sticker.id));
    resizeHandle.addEventListener("pointerdown", (event) => beginStickerResize(event, sticker.id));
    rotateHandle.addEventListener("pointerdown", (event) => beginStickerRotate(event, sticker.id));

    element.append(glyph, resizeHandle, rotateHandle);
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

function beginStickerRotate(event, stickerId) {
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
  const startAngle = Math.atan2(point.y - sticker.y, point.x - sticker.x);
  stickerAction = {
    type: "rotate",
    pointerId: event.pointerId,
    stickerId,
    startAngle,
    originalRotation: sticker.rotation || 0,
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
  } else if (stickerAction.type === "resize") {
    const delta = Math.max(point.x - stickerAction.startX, point.y - stickerAction.startY);
    sticker.size = clamp(stickerAction.originalSize + delta, STICKER_MIN_SIZE, STICKER_MAX_SIZE);
  } else if (stickerAction.type === "rotate") {
    const currentAngle = Math.atan2(point.y - sticker.y, point.x - sticker.x);
    const deltaDegrees = ((currentAngle - stickerAction.startAngle) * 180) / Math.PI;
    sticker.rotation = normalizeDegrees(stickerAction.originalRotation + deltaDegrees);
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
  const isImageSticker = stickerDefinition.type === "image" || Boolean(stickerDefinition.src || stickerDefinition.dataUrl);
  const sticker = {
    id: createId("sticker"),
    type: isImageSticker ? "image" : "emoji",
    value: isImageSticker ? "" : stickerDefinition.value,
    src: isImageSticker ? stickerDefinition.src : undefined,
    dataUrl: isImageSticker ? stickerDefinition.dataUrl : undefined,
    name: getAssetName(stickerDefinition),
    x: center.x,
    y: center.y,
    size: isImageSticker ? 92 : 72,
    rotation: 0,
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
  const haystack = normalizeText(`${getAssetName(item)} ${getAssetKeywords(item)} ${item.value || ""}`);
  return normalizedQuery.split(/\s+/).every((word) => haystack.includes(word));
}

function renderAssetGrid() {
  assetGrid.innerHTML = "";
  const query = assetSearch.value;
  const source = currentAssetKind === "stickers" ? getAllStickers() : getAllBackgrounds();
  const records = source.filter((item) => matchesQuery(item, query));
  emptyAssets.hidden = records.length > 0;

  for (const record of records) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "asset-card";

    if (currentAssetKind === "stickers") {
      if (record.type === "image" || record.src || record.dataUrl) {
        const preview = document.createElement("img");
        preview.className = "asset-preview-img";
        preview.src = record.dataUrl || record.src;
        preview.alt = getAssetName(record);
        button.append(preview);
      } else {
        const preview = document.createElement("span");
        preview.className = "asset-preview-sticker";
        preview.textContent = record.value;
        button.append(preview);
      }

      const name = document.createElement("strong");
      name.textContent = getAssetName(record);
      button.append(name);

      if (record.isShared) {
        const badge = document.createElement("span");
        badge.className = record.canDelete ? "asset-badge asset-badge-shared-editable" : "asset-badge asset-badge-shared";
        badge.textContent = "Condiviso";
        button.append(badge);

        if (record.canDelete) {
          const deleteButton = document.createElement("span");
          deleteButton.className = "asset-delete";
          deleteButton.title = "Elimina dalla libreria condivisa";
          deleteButton.setAttribute("role", "button");
          deleteButton.setAttribute("aria-label", `Elimina ${getAssetName(record)} dalla libreria condivisa`);
          deleteButton.textContent = "×";
          deleteButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            deleteSharedAsset(record);
          });
          button.append(deleteButton);
        }
      }

      if (record.isUploaded) {
        const badge = document.createElement("span");
        badge.className = "asset-badge asset-badge-local";
        badge.textContent = "Locale";
        button.append(badge);

        const deleteButton = document.createElement("span");
        deleteButton.className = "asset-delete";
        deleteButton.title = "Elimina questo elemento";
        deleteButton.setAttribute("role", "button");
        deleteButton.setAttribute("aria-label", `Elimina ${getAssetName(record)}`);
        deleteButton.textContent = "×";
        deleteButton.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          deleteUploadedAsset(record.id, getAssetName(record));
        });
        button.append(deleteButton);
      }

      button.addEventListener("click", () => addSticker(record));
    } else {
      const preview = document.createElement("span");
      preview.className = "asset-preview-bg";
      if (record.src || record.dataUrl) {
        preview.style.backgroundImage = `url("${record.dataUrl || record.src}")`;
      } else {
        preview.style.background = record.css;
        preview.style.backgroundSize = record.id === "grid" ? "24px 24px" : record.id === "dots" ? "26px 26px" : "auto";
      }
      const name = document.createElement("strong");
      name.textContent = getAssetName(record);
      button.append(preview, name);

      if (record.isShared) {
        const badge = document.createElement("span");
        badge.className = record.canDelete ? "asset-badge asset-badge-shared-editable" : "asset-badge asset-badge-shared";
        badge.textContent = "Condiviso";
        button.append(badge);

        if (record.canDelete) {
          const deleteButton = document.createElement("span");
          deleteButton.className = "asset-delete";
          deleteButton.title = "Elimina dalla libreria condivisa";
          deleteButton.setAttribute("role", "button");
          deleteButton.setAttribute("aria-label", `Elimina ${getAssetName(record)} dalla libreria condivisa`);
          deleteButton.textContent = "×";
          deleteButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            deleteSharedAsset(record);
          });
          button.append(deleteButton);
        }
      }

      if (record.isUploaded) {
        const badge = document.createElement("span");
        badge.className = "asset-badge asset-badge-local";
        badge.textContent = "Locale";
        button.append(badge);

        const deleteButton = document.createElement("span");
        deleteButton.className = "asset-delete";
        deleteButton.title = "Elimina questo elemento";
        deleteButton.setAttribute("role", "button");
        deleteButton.setAttribute("aria-label", `Elimina ${getAssetName(record)}`);
        deleteButton.textContent = "×";
        deleteButton.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          deleteUploadedAsset(record.id, getAssetName(record));
        });
        button.append(deleteButton);
      }

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
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(ASSET_STORE_NAME)) {
        db.createObjectStore(ASSET_STORE_NAME, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(SHARED_LIBRARY_STORE_NAME)) {
        db.createObjectStore(SHARED_LIBRARY_STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function requestFromStore(mode, callback, storeName = STORE_NAME) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
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

async function commitToStore(callback, storeName = STORE_NAME) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);

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

async function putUploadedAsset(record) {
  await commitToStore((store) => store.put(record), ASSET_STORE_NAME);
}

async function getAllUploadedAssets() {
  return requestFromStore("readonly", (store) => store.getAll(), ASSET_STORE_NAME);
}

async function deleteUploadedAssetRecord(id) {
  await commitToStore((store) => store.delete(id), ASSET_STORE_NAME);
}

async function clearUploadedAssetRecords() {
  await commitToStore((store) => store.clear(), ASSET_STORE_NAME);
}

function scheduleAutosave() {
  window.clearTimeout(autosaveTimer);
  autosaveTimer = window.setTimeout(async () => {
    await putDrawing({
      id: AUTOSAVE_ID,
      title: "Autosave",
      createdAt: new Date().toISOString(),
      dataUrl: await createCompositeDataUrl(),
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
    dataUrl: await createCompositeDataUrl(),
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

async function exportPNG() {
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  link.download = `vicky-draw-${stamp}.png`;
  link.href = await createCompositeDataUrl();
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


function setupDropZone(zone, kind) {
  if (!zone) {
    return;
  }
  const stop = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  ["dragenter", "dragover"].forEach((type) => {
    zone.addEventListener(type, (event) => {
      stop(event);
      zone.classList.add("is-drag-over");
    });
  });

  ["dragleave", "drop"].forEach((type) => {
    zone.addEventListener(type, (event) => {
      stop(event);
      zone.classList.remove("is-drag-over");
    });
  });

  zone.addEventListener("drop", async (event) => {
    const files = event.dataTransfer?.files;
    await handleAssetUpload(files, kind);
  });
}

setupDropZone(stickerDropZone, "sticker");
setupDropZone(backgroundDropZone, "background");

assetsButton.addEventListener("click", () => {
  assetSearch.value = "";
  setAssetKind("stickers");
  assetsDialog.showModal();
  window.setTimeout(() => assetSearch.focus(), 80);
});

stickersTab.addEventListener("click", () => setAssetKind("stickers"));
backgroundsTab.addEventListener("click", () => setAssetKind("backgrounds"));
assetSearch.addEventListener("input", renderAssetGrid);
uploadStickerInput?.addEventListener("change", async () => {
  await handleAssetUpload(uploadStickerInput.files, "sticker");
  uploadStickerInput.value = "";
});
uploadBackgroundInput?.addEventListener("change", async () => {
  await handleAssetUpload(uploadBackgroundInput.files, "background");
  uploadBackgroundInput.value = "";
});
clearUploadedAssetsButton?.addEventListener("click", clearUploadedAssets);
refreshLibraryButton?.addEventListener("click", async () => {
  refreshLibraryButton.disabled = true;
  await loadRemoteLibrary({ force: true });
  refreshLibraryButton.disabled = false;
});

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

async function initApp() {
  resizeCanvas();
  applyBackground("white", { pushToHistory: false, autosave: false });
  applyViewTransform();
  updateGenerateStatus("Libreria condivisa da GitHub + caricamenti locali. Trascina immagini nei riquadri per aggiungerle solo a questo dispositivo.");
  await loadRemoteLibrary();
  await loadAutosave();
  updateHistoryButtons();
  registerServiceWorker();
}

initApp();
