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
   CİHAZ
========================================================= */
function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}

/* =========================================================
   PRELOAD (1 sayfa sonrası)
========================================================= */
function preloadPage(pageNo) {
  if (!pageNo || pageNo < 1 || pageNo > TOTAL_PAGES) return;

  const img = new Image();
  img.src = `pages/${pageNo}.jpg`;

  if (videoMap[pageNo]) {
    const v = document.createElement("video");
    v.src = videoMap[pageNo];
    v.preload = "metadata";
  }
}

/* =========================================================
   SAYFA OLUŞTURMA
========================================================= */
function makePage(type, pageNo, addFade = false) {
  const page = document.createElement("div");
  page.className = `page ${type}`;

  if (addFade) {
    page.classList.add("mobile-fade");
  }

  if (!pageNo || pageNo < 1 || pageNo > TOTAL_PAGES) {
    page.classList.add("blank");
    return page;
  }

  const img = document.createElement("img");
  img.className = "bg";
  img.src = `pages/${pageNo}.jpg`;
  img.decoding = "async";
  img.loading = "eager";
  page.appendChild(img);

  if (videoMap[pageNo]) {
    page.classList.add("video-page");

    const video = document.createElement("video");
    video.src = videoMap[pageNo];
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.controls = true;
    video.preload = "metadata";
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
   BUTON DURUMU
========================================================= */
function updateButtons() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= TOTAL_PAGES;
}

/* =========================================================
   RENDER
========================================================= */
function render() {
  const book = document.getElementById("book");
  const pageLabel = document.getElementById("pageLabel");
  if (!book) return;

  book.innerHTML = "";

  /* ================= MOBİL ================= */
  if (isMobile()) {
    // 🔴 Fade sadece kapaktan SONRA
    const addFade = currentPage > 1;

    book.appendChild(
      makePage("single", currentPage, addFade)
    );

    pageLabel.textContent = `${currentPage} / ${TOTAL_PAGES}`;

    preloadPage(currentPage + 1);
    updateButtons();
    return;
  }

  /* ================= MASAÜSTÜ (KİLİTLİ) ================= */
  let left = null;
  let right = null;

  if (currentPage === 1) {
    right = 1;
  } else if (currentPage % 2 === 0) {
    left = currentPage;
    right = currentPage + 1;
  } else {
    left = currentPage - 1;
    right = currentPage;
  }

  book.appendChild(makePage("left", left));
  book.appendChild(makePage("right", right));

  pageLabel.textContent = left
    ? `${left}-${right} / ${TOTAL_PAGES}`
    : `1 / ${TOTAL_PAGES}`;

  preloadPage(currentPage + 2);
  preloadPage(currentPage + 3);
  updateButtons();
}

/* =========================================================
   SAYFA GEÇİŞ
========================================================= */
function nextPage() {
  if (isMobile()) {
    if (currentPage < TOTAL_PAGES) currentPage++;
  } else {
    currentPage = currentPage === 1 ? 2 : currentPage + 2;
  }
  render();
}

function prevPage() {
  if (isMobile()) {
    if (currentPage > 1) currentPage--;
  } else {
    currentPage = currentPage === 2 ? 1 : currentPage - 2;
  }
  render();
}

/* =========================================================
   ZOOM
========================================================= */
function applyZoom() {
  const book = document.getElementById("book");
  const zoomLabel = document.getElementById("zoomLevel");
  book.style.transform = `scale(${zoom})`;
  zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
}

function zoomIn() {
  zoom = Math.min(2, zoom + 0.1);
  applyZoom();
}

function zoomOut() {
  zoom = Math.max(0.6, zoom - 0.1);
  applyZoom();
}

/* =========================================================
   BAŞLAT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("prevBtn").onclick = prevPage;
  document.getElementById("nextBtn").onclick = nextPage;
  document.getElementById("zoomIn").onclick = zoomIn;
  document.getElementById("zoomOut").onclick = zoomOut;

  applyZoom();
  preloadPage(1);
  preloadPage(2);
  preloadPage(3);

  render();
});

window.addEventListener("resize", render);
