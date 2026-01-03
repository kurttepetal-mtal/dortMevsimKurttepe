/* =========================================================
   AYARLAR
========================================================= */
const TOTAL_PAGES = 47;
const CHUNK_SIZE = 10;

/* Video olan sayfalar */
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
   YARDIMCI
========================================================= */
function isMobile() {
  return window.innerWidth <= 768;
}

/* =========================================================
   ZOOM (AUTO-FIT)
========================================================= */
let zoom = 1;
const ZOOM_MIN = 0.6;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.2;

function calculateInitialZoom() {
  const screenWidth = window.innerWidth;
  return screenWidth < 900 ? Math.max(ZOOM_MIN, screenWidth / 900) : 1;
}

function applyZoom() {
  bookEl.style.transform = `scale(${zoom})`;
  zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
}

zoom = calculateInitialZoom();
applyZoom();

zoomInBtn.onclick = () => {
  zoom = Math.min(ZOOM_MAX, zoom + ZOOM_STEP);
  applyZoom();
};

zoomOutBtn.onclick = () => {
  zoom = Math.max(ZOOM_MIN, zoom - ZOOM_STEP);
  applyZoom();
};

/* =========================================================
   DURUM
========================================================= */
let currentPage = 1;     // sol sayfa ya da tek sayfa
let loadedUntil = CHUNK_SIZE;

/* =========================================================
   SAYFA OLUŞTURMA
========================================================= */
function createPage(pageNo, side = "single") {
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
function render(direction = "none") {
  bookEl.innerHTML = "";

  /* =======================
     MOBİL: TEK SAYFA
  ======================= */
  if (isMobile()) {
    ensureLoaded(currentPage);

    const page = createPage(currentPage, "single");
    bookEl.appendChild(page);

    pageLabel.textContent = `${currentPage} / ${TOTAL_PAGES}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= TOTAL_PAGES;
    return;
  }

  /* =======================
     MASAÜSTÜ: KAPAK + ÇİFT
  ======================= */

  // Kapak
  if (currentPage === 1) {
    bookEl.appendChild(createPage(1, "right"));
    pageLabel.textContent = `1 / ${TOTAL_PAGES}`;
    prevBtn.disabled = true;
    nextBtn.disabled = false;
    return;
  }

  // Çift sayfa
  ensureLoaded(currentPage + 1);

  const left  = createPage(currentPage, "left");
  const right = currentPage + 1 <= TOTAL_PAGES
    ? createPage(currentPage + 1, "right")
    : null;

  bookEl.appendChild(left);
  if (right) bookEl.appendChild(right);

  pageLabel.textContent = `${currentPage}-${currentPage + 1} / ${TOTAL_PAGES}`;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage + 1 >= TOTAL_PAGES;
}

/* =========================================================
   GEÇİŞLER
========================================================= */
prevBtn.onclick = () => {
  if (isMobile()) {
    if (currentPage > 1) currentPage--;
  } else {
    if (currentPage === 2) currentPage = 1;
    else if (currentPage > 2) currentPage -= 2;
  }
  render("prev");
};

nextBtn.onclick = () => {
  if (isMobile()) {
    if (currentPage < TOTAL_PAGES) currentPage++;
  } else {
    if (currentPage === 1) currentPage = 2;
    else if (currentPage + 1 < TOTAL_PAGES) currentPage += 2;
  }
  render("next");
};

/* =========================================================
   EKRAN DEĞİŞİNCE (ROTATE / RESIZE)
========================================================= */
window.addEventListener("resize", () => {
  zoom = calculateInitialZoom();
  applyZoom();
  render();
});

/* =========================================================
   BAŞLAT
========================================================= */
render();
