/* =========================================================
   AYARLAR
========================================================= */
const TOTAL_PAGES = 47;
const CHUNK_SIZE = 10;

const videoMap = {
  17: "videos/v17.mp4",
  22: "videos/v22.mp4",
  24: "videos/v24.mp4",
  26: "videos/v26.mp4",
  41: "videos/v41.mp4",
  47: "videos/v01.mp4"
};

/* =========================================================
   DOM
========================================================= */
const bookEl    = document.getElementById("book");
const prevBtn   = document.getElementById("prevBtn");
const nextBtn   = document.getElementById("nextBtn");
const pageLabel = document.getElementById("pageLabel");

const zoomInBtn  = document.getElementById("zoomIn");
const zoomOutBtn = document.getElementById("zoomOut");
const zoomLabel  = document.getElementById("zoomLevel");

/* =========================================================
   ZOOM (AUTO-FIT + MANUEL)
========================================================= */
let zoom = 1;
const ZOOM_MIN = 0.6;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.2;

/* 🔴 MOBİLDE OTOMATİK SIĞDIR */
function calculateInitialZoom() {
  const screenWidth = window.innerWidth;
  const bookWidth = 900;

  if (screenWidth < bookWidth) {
    return Math.max(ZOOM_MIN, screenWidth / bookWidth);
  }
  return 1;
}

function applyZoom() {
  bookEl.style.transform = `scale(${zoom})`;
  zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
}

/* İlk açılış */
zoom = calculateInitialZoom();
applyZoom();

/* Manuel zoom */
zoomInBtn.addEventListener("click", () => {
  zoom = Math.min(ZOOM_MAX, zoom + ZOOM_STEP);
  applyZoom();
});

zoomOutBtn.addEventListener("click", () => {
  zoom = Math.max(ZOOM_MIN, zoom - ZOOM_STEP);
  applyZoom();
});

/* =========================================================
   SAYFA DURUMU
========================================================= */
let spreadStart = 1;
let loadedUntil = CHUNK_SIZE;

/* =========================================================
   SAYFA OLUŞTURMA
========================================================= */
function createPage(side, pageNo) {
  const page = document.createElement("div");
  page.className = `page ${side}`;
  page.dataset.pageNo = pageNo;

  const img = document.createElement("img");
  img.className = "bg";
  img.src = `pages/${pageNo}.jpg`;
  img.loading = "lazy";
  page.appendChild(img);

  if (videoMap[pageNo]) {
    const v = document.createElement("video");
    v.src = videoMap[pageNo];
    v.muted = true;
    v.playsInline = true;
    v.loop = true;
    v.preload = "none";
    v.controls = true;
    page.appendChild(v);
  }

  return page;
}

/* =========================================================
   KADEMELİ YÜKLEME
========================================================= */
function ensureLoaded(pageNo) {
  if (pageNo <= loadedUntil) return;
  loadedUntil = Math.min(loadedUntil + CHUNK_SIZE, TOTAL_PAGES);
}

/* =========================================================
   RENDER
========================================================= */
function render() {
  bookEl.innerHTML = "";

  const isCover = (spreadStart === 1);
  bookEl.classList.toggle("cover-mode", isCover);

  ensureLoaded(spreadStart + 1);

  bookEl.appendChild(createPage("left", spreadStart));

  if (!isCover && spreadStart + 1 <= TOTAL_PAGES) {
    bookEl.appendChild(createPage("right", spreadStart + 1));
  }

  if (isCover) {
    pageLabel.textContent = `1 / ${TOTAL_PAGES}`;
  } else {
    pageLabel.textContent = `${spreadStart}-${spreadStart + 1} / ${TOTAL_PAGES}`;
  }
}

/* =========================================================
   GEÇİŞ
========================================================= */
prevBtn.addEventListener("click", () => {
  spreadStart = (spreadStart === 2) ? 1 : Math.max(spreadStart - 2, 1);
  render();
});

nextBtn.addEventListener("click", () => {
  spreadStart = (spreadStart === 1) ? 2 : Math.min(spreadStart + 2, TOTAL_PAGES);
  render();
});

/* =========================================================
   BAŞLAT
========================================================= */
render();
