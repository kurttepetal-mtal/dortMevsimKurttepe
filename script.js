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
  47: "videos/v01.mp4" // kapanış videosu
};

/* =========================================================
   ELEMENTLER
========================================================= */
const bookEl    = document.getElementById("book");
const prevBtn   = document.getElementById("prevBtn");
const nextBtn   = document.getElementById("nextBtn");
const pageLabel = document.getElementById("pageLabel");
const zoomLevel = document.getElementById("zoomLevel");
const turnSound = document.getElementById("turnSound");

/* =========================================================
   DURUMLAR
========================================================= */
let spreadStart = 1;
let zoom = 1;
let unlocked = false;

/* =========================================================
   AUTOPLAY KİLİDİ
========================================================= */
function unlockMedia() {
  if (unlocked) return;
  unlocked = true;

  if (turnSound) {
    turnSound.volume = 0.4;
    turnSound.play().then(() => {
      turnSound.pause();
      turnSound.currentTime = 0;
    }).catch(() => {});
  }
}
document.addEventListener("click", unlockMedia, { once: true });
document.addEventListener("touchstart", unlockMedia, { once: true });

/* =========================================================
   SAYFA OLUŞTURMA
========================================================= */
function makePage(side, pageNo, empty = false) {
  const page = document.createElement("div");
  page.className = `page ${side}`;

  if (empty) {
    page.style.background = "transparent";
    return page;
  }

  page.dataset.pageNo = pageNo;

  const img = document.createElement("img");
  img.className = "bg";
  img.src = `pages/${pageNo}.jpg`;
  page.appendChild(img);

  if (videoMap[pageNo]) {
    const video = document.createElement("video");
    video.src = videoMap[pageNo];
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.controls = true;
    page.appendChild(video);
  }

  return page;
}

/* =========================================================
   VİDEO KONTROL
========================================================= */
function stopVideos() {
  bookEl.querySelectorAll("video").forEach(v => {
    v.pause();
    v.currentTime = 0;
  });
}

function playVideos() {
  if (!unlocked) return;
  bookEl.querySelectorAll("video").forEach(v => {
    v.play().catch(() => {});
  });
}

/* =========================================================
   RENDER
========================================================= */
function render() {
  stopVideos();
  bookEl.innerHTML = "";

  const isCover = (spreadStart === 1);

  if (isCover) {
    // 🔴 BOŞ SOL SAYFA (placeholder)
    const emptyLeft = makePage("left", null, true);
    bookEl.appendChild(emptyLeft);

    // 🔴 KAPAK SAĞDA
    const cover = makePage("right", 1);
    bookEl.appendChild(cover);

    pageLabel.textContent = `1 / ${TOTAL_PAGES}`;
    prevBtn.disabled = true;
    nextBtn.disabled = false;

  } else {
    const leftPageNo  = spreadStart;
    const rightPageNo = spreadStart + 1;

    const left  = makePage("left", leftPageNo);
    bookEl.appendChild(left);

    if (rightPageNo <= TOTAL_PAGES) {
      const right = makePage("right", rightPageNo);
      bookEl.appendChild(right);
    }

    pageLabel.textContent = `${leftPageNo}-${rightPageNo} / ${TOTAL_PAGES}`;
    prevBtn.disabled = false;
    nextBtn.disabled = (rightPageNo >= TOTAL_PAGES);
  }

  setTimeout(playVideos, 60);
}

/* =========================================================
   SAYFA GEÇİŞLERİ
========================================================= */
function playTurnSound() {
  if (unlocked && turnSound) {
    turnSound.currentTime = 0;
    turnSound.play().catch(() => {});
  }
}

function nextPage() {
  playTurnSound();

  if (spreadStart === 1) {
    spreadStart = 2;
  } else if (spreadStart + 2 <= TOTAL_PAGES) {
    spreadStart += 2;
  }

  render();
}

function prevPage() {
  playTurnSound();

  if (spreadStart === 2) {
    spreadStart = 1;
  } else if (spreadStart > 2) {
    spreadStart -= 2;
  }

  render();
}

prevBtn.addEventListener("click", prevPage);
nextBtn.addEventListener("click", nextPage);

/* =========================================================
   ZOOM
========================================================= */
document.getElementById("zoomIn").onclick = () => {
  zoom = Math.min(2, zoom + 0.1);
  bookEl.style.transform = `scale(${zoom})`;
  zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
};

document.getElementById("zoomOut").onclick = () => {
  zoom = Math.max(0.6, zoom - 0.1);
  bookEl.style.transform = `scale(${zoom})`;
  zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
};

/* =========================================================
   BAŞLAT
========================================================= */
render();
