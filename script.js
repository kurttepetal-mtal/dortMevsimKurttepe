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
let currentPage = 1;
let loadedUntil = CHUNK_SIZE;

/* Mobil mi? */
function isMobile() {
  return window.innerWidth <= 768;
}

/* =========================================================
   SAYFA OLUŞTURMA
========================================================= */
function createPage(pageNo) {
  const page = document.createElement("div");
  page.className = "page single";
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
   RENDER (MOBİL: TEK SAYFA)
========================================================= */
function render(direction = "none") {
  ensureLoaded(currentPage);

  const oldPage = bookEl.querySelector(".page");
  const newPage = createPage(currentPage);

  if (direction !== "none" && oldPage) {
    newPage.style.position = "absolute";
    newPage.style.top = 0;
    newPage.style.left = 0;
    newPage.style.width = "100%";
    newPage.style.opacity = 0;
    newPage.style.transform =
      direction === "next"
        ? "translateX(40px)"
        : "translateX(-40px)";

    bookEl.appendChild(newPage);

    requestAnimationFrame(() => {
      newPage.style.transition = "all 0.35s ease";
      newPage.style.opacity = 1;
      newPage.style.transform = "translateX(0)";
    });

    setTimeout(() => {
      bookEl.innerHTML = "";
      bookEl.appendChild(newPage);
    }, 360);
  } else {
    bookEl.innerHTML = "";
    bookEl.appendChild(newPage);
  }

  pageLabel.textContent = `${currentPage} / ${TOTAL_PAGES}`;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= TOTAL_PAGES;
}

/* =========================================================
   GEÇİŞLER (MOBİL: 1’er 1’er)
========================================================= */
prevBtn.onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    render("prev");
  }
};

nextBtn.onclick = () => {
  if (currentPage < TOTAL_PAGES) {
    currentPage++;
    render("next");
  }
};

/* =========================================================
   BAŞLAT
========================================================= */
render();
