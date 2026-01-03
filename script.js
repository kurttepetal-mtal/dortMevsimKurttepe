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
   DURUMLAR
========================================================= */
let currentPage = 1;   // açılış kapak
let zoom = 1;

/* =========================================================
   CİHAZ
========================================================= */
function isMobile() {
  return window.innerWidth <= 768;
}

/* =========================================================
   SAYFA OLUŞTURMA
========================================================= */
function makeBlankPage(sideClass) {
  const p = document.createElement("div");
  p.className = `page ${sideClass} blank`;
  return p;
}

function makePage(sideClass, pageNo) {
  const page = document.createElement("div");
  page.className = `page ${sideClass}`;

  // mobilde "single" classı verilecek, burada sideClass zaten single/left/right
  if (pageNo == null || pageNo < 1 || pageNo > TOTAL_PAGES) {
    page.classList.add("blank");
    return page;
  }

  const img = document.createElement("img");
  img.className = "bg";
  img.src = `pages/${pageNo}.jpg`;
  img.alt = `Sayfa ${pageNo}`;
  page.appendChild(img);

  if (videoMap[pageNo]) {
    page.classList.add("video-page");

    const video = document.createElement("video");
    video.src = videoMap[pageNo];
    video.muted = true;        // mobil autoplay politikası için
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.controls = true;
    page.appendChild(video);

    const overlay = document.createElement("div");
    overlay.className = "video-play-overlay";
    overlay.textContent = "▶";
    overlay.onclick = () => {
      overlay.style.display = "none";
      // ses istiyorsan:
      video.muted = false;
      video.play().catch(() => {});
    };
    page.appendChild(overlay);
  }

  return page;
}

/* =========================================================
   SPREAD HESABI (KİLİTLİ)
   - kapak: sağda 1, solda boş
   - diğerleri: çift solda, tek sağda
========================================================= */
function getDesktopSpread(p) {
  if (p === 1) return { left: null, right: 1 };

  if (p % 2 === 0) {
    return { left: p, right: Math.min(p + 1, TOTAL_PAGES) };
  } else {
    return { left: p - 1, right: p };
  }
}

/* =========================================================
   RENDER
========================================================= */
function render() {
  const bookEl    = document.getElementById("book");
  const prevBtn   = document.getElementById("prevBtn");
  const nextBtn   = document.getElementById("nextBtn");
  const pageLabel = document.getElementById("pageLabel");

  if (!bookEl) return;

  // içeriği temizle
  bookEl.innerHTML = "";

  // MOBİL: tek sayfa
  if (isMobile()) {
    bookEl.appendChild(makePage("single", currentPage));

    pageLabel.textContent = `${currentPage} / ${TOTAL_PAGES}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= TOTAL_PAGES;
    return;
  }

  // MASAÜSTÜ: spread
  const { left, right } = getDesktopSpread(currentPage);

  // solda
  if (left == null) bookEl.appendChild(makeBlankPage("left"));
  else bookEl.appendChild(makePage("left", left));

  // sağda
  if (right == null) bookEl.appendChild(makeBlankPage("right"));
  else bookEl.appendChild(makePage("right", right));

  // label
  if (left == null) pageLabel.textContent = `1 / ${TOTAL_PAGES}`;
  else pageLabel.textContent = `${left}-${right} / ${TOTAL_PAGES}`;

  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= TOTAL_PAGES;
}

/* =========================================================
   SES
========================================================= */
function playTurnSound() {
  const turnSound = document.getElementById("turnSound");
  if (!turnSound) return;
  turnSound.currentTime = 0;
  turnSound.play().catch(() => {});
}

/* =========================================================
   SAYFA GEÇİŞ
========================================================= */
function nextPage() {
  playTurnSound();

  if (isMobile()) {
    if (currentPage < TOTAL_PAGES) currentPage++;
  } else {
    // masaüstü: kapaktan sonra 2-3'e geçsin
    if (currentPage === 1) currentPage = 2;
    else currentPage = Math.min(currentPage + 2, TOTAL_PAGES);
  }

  render();
}

function prevPage() {
  playTurnSound();

  if (isMobile()) {
    if (currentPage > 1) currentPage--;
  } else {
    if (currentPage === 2) currentPage = 1;
    else currentPage = Math.max(currentPage - 2, 1);
  }

  render();
}

/* =========================================================
   ZOOM (KİLİTLİ)
========================================================= */
function zoomIn() {
  const bookEl = document.getElementById("book");
  const zoomLevel = document.getElementById("zoomLevel");
  zoom = Math.min(2, zoom + 0.1);
  bookEl.style.transform = `scale(${zoom})`;
  zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
}

function zoomOut() {
  const bookEl = document.getElementById("book");
  const zoomLevel = document.getElementById("zoomLevel");
  zoom = Math.max(0.6, zoom - 0.1);
  bookEl.style.transform = `scale(${zoom})`;
  zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
}

/* =========================================================
   BAŞLAT (DOM HAZIR)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const prevBtn   = document.getElementById("prevBtn");
  const nextBtn   = document.getElementById("nextBtn");
  const zoomInBtn = document.getElementById("zoomIn");
  const zoomOutBtn= document.getElementById("zoomOut");

  if (prevBtn) prevBtn.onclick = prevPage;
  if (nextBtn) nextBtn.onclick = nextPage;
  if (zoomInBtn) zoomInBtn.onclick = zoomIn;
  if (zoomOutBtn) zoomOutBtn.onclick = zoomOut;

  currentPage = 1; // açılış kapak
  render();
});

window.addEventListener("resize", render);
