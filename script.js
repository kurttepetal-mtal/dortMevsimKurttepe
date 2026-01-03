/* =========================================================
   AYARLAR (KİLİTLİ)
========================================================= */
const TOTAL_PAGES = 47;

const videoMap = {
  17: "videos/v17.mp4",
  22: "videos/v22.mp4",
  24: "videos/v24.mp4",
  26: "videos/v26.mp4",
  41: "videos/v41.mp4",
  47: "videos/v01.mp4"
};

/* =========================================================
   DURUM
========================================================= */
let currentPage = 1;
let zoom = 1;

/* =========================================================
   CİHAZ (STABİL)
========================================================= */
function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}

/* =========================================================
   PRELOAD (1 sayfa sonrası)
========================================================= */
function preloadPage(pageNo) {
  if (!pageNo || pageNo < 1 || pageNo > TOTAL_PAGES) return;

  // JPG preload
  const img = new Image();
  img.src = `pages/${pageNo}.jpg`;

  // Video preload (sadece metadata)
  if (videoMap[pageNo]) {
    const v = document.createElement("video");
    v.src = videoMap[pageNo];
    v.preload = "metadata";
  }
}

/* =========================================================
   SAYFA OLUŞTURMA
========================================================= */
function makePage(type, pageNo) {
  const page = document.createElement("div");
  page.className = `page ${type}`;

  if (!pageNo || pageNo < 1 || pageNo > TOTAL_PAGES) {
    page.classList.add("blank");
    return page;
  }

  const img = document.createElement("img");
  img.className = "bg";
  img.src = `pages/${pageNo}.jpg`;
  img.decoding = "async";
  img.loading = "eager";
  img.onerror = () => console.error(`[Flipbook] Eksik görsel: pages/${pageNo}.jpg`);
  page.appendChild(img);

  if (videoMap[pageNo]) {
    page.classList.add("video-page");

    const video = document.createElement("video");
    video.src = videoMap[pageNo];
    video.muted = true;          // mobil autoplay güvenliği (overlay tıklanınca açıyoruz)
    video.loop = true;
    video.playsInline = true;
    video.controls = true;
    video.preload = "metadata";
    video.onerror = () => console.error(`[Flipbook] Eksik video: ${videoMap[pageNo]}`);
    page.appendChild(video);

    const overlay = document.createElement("div");
    overlay.className = "video-play-overlay";
    overlay.innerHTML = "▶";
    overlay.onclick = () => {
      overlay.style.display = "none";
      video.muted = false;
      video.play().catch(() => {});
    };
    page.appendChild(overlay);
  }

  return page;
}

/* =========================================================
   BUTON DURUMLARI
========================================================= */
function updateButtons() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!prevBtn || !nextBtn) return;

  prevBtn.disabled = (currentPage <= 1);

  if (isMobile()) {
    nextBtn.disabled = (currentPage >= TOTAL_PAGES);
  } else {
    // masaüstünde 1'den sonra +2 ilerliyoruz; son spread için güvenli kilit:
    nextBtn.disabled = (currentPage >= TOTAL_PAGES);
  }
}

/* =========================================================
   RENDER (KİLİTLİ YERLEŞİM)
========================================================= */
function render() {
  const book = document.getElementById("book");
  const pageLabel = document.getElementById("pageLabel");
  if (!book) return;

  book.innerHTML = "";

  /* ================= MOBİL (TEK TEK) ================= */
  if (isMobile()) {
    book.appendChild(makePage("single", currentPage));
    if (pageLabel) pageLabel.textContent = `${currentPage} / ${TOTAL_PAGES}`;

    // preload: 1 sayfa sonrası
    preloadPage(currentPage + 1);

    updateButtons();
    return;
  }

  /* ================= MASAÜSTÜ (KAPAK SAĞDA, SONRA ÇİFT) ================= */
  let left = null;
  let right = null;

  // Kapak: sağda 1
  if (currentPage === 1) {
    left = null;
    right = 1;
  } else if (currentPage % 2 === 0) {
    // çift -> solda
    left = currentPage;
    right = currentPage + 1;
  } else {
    // tek -> sağda
    left = currentPage - 1;
    right = currentPage;
  }

  book.appendChild(makePage("left", left));
  book.appendChild(makePage("right", right));

  if (pageLabel) {
    pageLabel.textContent = left
      ? `${left}-${right} / ${TOTAL_PAGES}`
      : `1 / ${TOTAL_PAGES}`;
  }

  // preload: bir sonraki spread (+2/+3) ve sağ/sol sayfalar
  if (currentPage === 1) {
    preloadPage(2);
    preloadPage(3);
  } else {
    preloadPage(currentPage + 2);
    preloadPage(currentPage + 3);
  }
  preloadPage(left);
  preloadPage(right);

  updateButtons();
}

/* =========================================================
   SAYFA GEÇİŞ (KİLİTLİ)
========================================================= */
function nextPage() {
  if (isMobile()) {
    if (currentPage < TOTAL_PAGES) currentPage++;
  } else {
    currentPage = (currentPage === 1) ? 2 : (currentPage + 2);
    if (currentPage > TOTAL_PAGES) currentPage = TOTAL_PAGES;
  }
  render();
}

function prevPage() {
  if (isMobile()) {
    if (currentPage > 1) currentPage--;
  } else {
    currentPage = (currentPage === 2) ? 1 : (currentPage - 2);
    if (currentPage < 1) currentPage = 1;
  }
  render();
}

/* =========================================================
   ZOOM (KİLİTLİ)
========================================================= */
function applyZoom() {
  const book = document.getElementById("book");
  const zoomLevel = document.getElementById("zoomLevel");
  if (!book) return;

  book.style.transform = `scale(${zoom})`;
  if (zoomLevel) zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
}

function zoomIn() {
  zoom = Math.min(2.0, Math.round((zoom + 0.1) * 10) / 10);
  applyZoom();
}

function zoomOut() {
  zoom = Math.max(0.6, Math.round((zoom - 0.1) * 10) / 10);
  applyZoom();
}

/* =========================================================
   RESIZE (STABİL)
========================================================= */
let resizeTimer = null;
function onResize() {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    render();
    resizeTimer = null;
  }, 180);
}

/* =========================================================
   BAŞLAT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const zoomInBtn = document.getElementById("zoomIn");
  const zoomOutBtn = document.getElementById("zoomOut");

  if (prevBtn) prevBtn.onclick = prevPage;
  if (nextBtn) nextBtn.onclick = nextPage;

  if (zoomInBtn) zoomInBtn.onclick = zoomIn;
  if (zoomOutBtn) zoomOutBtn.onclick = zoomOut;

  // ilk zoom
  applyZoom();

  // açılış hızlandırma
  preloadPage(1);
  preloadPage(2);
  preloadPage(3);

  render();
});

window.addEventListener("resize", onResize);
