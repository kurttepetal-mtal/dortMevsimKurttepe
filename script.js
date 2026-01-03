/* =========================================================
   AYARLAR
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
   DOM
========================================================= */
const bookEl    = document.getElementById("book");
const prevBtn   = document.getElementById("prevBtn");
const nextBtn   = document.getElementById("nextBtn");
const pageLabel = document.getElementById("pageLabel");

const zoomInBtn  = document.getElementById("zoomIn");
const zoomOutBtn = document.getElementById("zoomOut");
const zoomLabel  = document.getElementById("zoomLevel");

const turnSound = document.getElementById("turnSound");

/* =========================================================
   SES KİLİDİ (AUTOPLAY POLİTİKASI)
========================================================= */
let soundUnlocked = false;

function unlockSound() {
  if (soundUnlocked) return;
  soundUnlocked = true;

  turnSound.volume = 0.4;

  // Sessiz bir play/pause ile tarayıcı kilidini aç
  turnSound.play().then(() => {
    turnSound.pause();
    turnSound.currentTime = 0;
  }).catch(() => {});
}

document.addEventListener("click", unlockSound, { once: true });
document.addEventListener("touchstart", unlockSound, { once: true });

function playTurnSound() {
  if (!soundUnlocked) return;
  try {
    turnSound.currentTime = 0;
    turnSound.play();
  } catch {}
}

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
  const w = window.innerWidth;
  return w < 900 ? Math.max(ZOOM_MIN, w / 900) : 1;
}

function applyZoom() {
  bookEl.style.transform = `scale(${zoom})`;
  zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
}

zoom = calculateInitialZoom();
applyZoom();

zoomInBtn.onclick  = () => { zoom = Math.min(ZOOM_MAX, zoom + ZOOM_STEP); applyZoom(); };
zoomOutBtn.onclick = () => { zoom = Math.max(ZOOM_MIN, zoom - ZOOM_STEP); applyZoom(); };

/* =========================================================
   DURUM
========================================================= */
let currentPage = 1;

/* =========================================================
   SAYFA OLUŞTURMA
========================================================= */
function createPage(pageNo, side) {
  const page = document.createElement("div");
  page.className = `page ${side}`;
  page.dataset.pageNo = pageNo;

  if (pageNo === 0) return page; // boş sol (kapak için)

  const img = document.createElement("img");
  img.className = "bg";
  img.src = `pages/${pageNo}.jpg`;
  page.appendChild(img);

  if (videoMap[pageNo]) {
    const v = document.createElement("video");
    v.src = videoMap[pageNo];
    v.muted = true;
    v.playsInline = true;
    v.loop = true;
    v.controls = true;
    page.appendChild(v);
  }

  return page;
}

/* =========================================================
   RENDER
========================================================= */
function render() {
  bookEl.innerHTML = "";

  /* MOBİL: TEK SAYFA */
  if (isMobile()) {
    bookEl.appendChild(createPage(currentPage, "single"));
    pageLabel.textContent = `${currentPage} / ${TOTAL_PAGES}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= TOTAL_PAGES;
    return;
  }

  /* MASAÜSTÜ */

  // KAPAK SAĞDA
  if (currentPage === 1) {
    bookEl.appendChild(createPage(0, "left"));
    bookEl.appendChild(createPage(1, "right"));
    pageLabel.textContent = `1 / ${TOTAL_PAGES}`;
    prevBtn.disabled = true;
    nextBtn.disabled = false;
    return;
  }

  // ÇİFT SAYFA
  bookEl.appendChild(createPage(currentPage, "left"));
  if (currentPage + 1 <= TOTAL_PAGES) {
    bookEl.appendChild(createPage(currentPage + 1, "right"));
  }

  pageLabel.textContent = `${currentPage}-${currentPage + 1} / ${TOTAL_PAGES}`;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage + 1 >= TOTAL_PAGES;
}

/* =========================================================
   GEÇİŞLER (SES BURADA)
========================================================= */
prevBtn.onclick = () => {
  playTurnSound();

  if (isMobile()) {
    if (currentPage > 1) currentPage--;
  } else {
    if (currentPage === 2) currentPage = 1;
    else if (currentPage > 2) currentPage -= 2;
  }
  render();
};

nextBtn.onclick = () => {
  playTurnSound();

  if (isMobile()) {
    if (currentPage < TOTAL_PAGES) currentPage++;
  } else {
    if (currentPage === 1) currentPage = 2;
    else if (currentPage + 1 < TOTAL_PAGES) currentPage += 2;
  }
  render();
};

/* =========================================================
   BAŞLAT
========================================================= */
render();
