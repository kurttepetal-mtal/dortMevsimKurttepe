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
   ELEMENTLER
========================================================= */
const bookEl = document.getElementById("book");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageLabel = document.getElementById("pageLabel");
const zoomLevel = document.getElementById("zoomLevel");
const turnSound = document.getElementById("turnSound");

let spreadStart = 1;
let zoom = 1;
let unlocked = false;

/* =========================================================
   AUTOPLAY KİLİDİ (MASAÜSTÜ İÇİN KRİTİK)
========================================================= */
function unlockMedia() {
  if (unlocked) return;
  unlocked = true;

  // Sesi kilitten çıkar
  if (turnSound) {
    turnSound.volume = 0.4;
    turnSound.play().then(() => {
      turnSound.pause();
      turnSound.currentTime = 0;
    }).catch(() => {});
  }

  // Mevcut videoları kilitten çıkar
  document.querySelectorAll("video").forEach(v => {
    v.muted = true;
    v.play().then(() => {
      v.pause();
      v.currentTime = 0;
    }).catch(() => {});
  });
}

document.addEventListener("click", unlockMedia, { once: true });
document.addEventListener("touchstart", unlockMedia, { once: true });

/* =========================================================
   SAYFA OLUŞTURMA
========================================================= */
function makePage(side, pageNo) {
  const page = document.createElement("div");
  page.className = `page ${side}`;
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
   RENDER
========================================================= */
function stopVideos() {
  document.querySelectorAll("#book video").forEach(v => {
    v.pause();
    v.currentTime = 0;
  });
}

function playVideos() {
  if (!unlocked) return;

  document.querySelectorAll("#book video").forEach(v => {
    v.play().catch(() => {});
  });
}

function render() {
  stopVideos();
  bookEl.innerHTML = "";

  const isCover = spreadStart === 1;

  const left = makePage("left", spreadStart);
  bookEl.appendChild(left);

  if (!isCover && spreadStart + 1 <= TOTAL_PAGES) {
    const right = makePage("right", spreadStart + 1);
    bookEl.appendChild(right);
  }

  pageLabel.textContent = `${spreadStart} / ${TOTAL_PAGES}`;

  prevBtn.disabled = spreadStart <= 1;
  nextBtn.disabled = spreadStart >= TOTAL_PAGES;

  setTimeout(playVideos, 50);
}

/* =========================================================
   SAYFA GEÇİŞ
========================================================= */
function playTurn() {
  if (unlocked && turnSound) {
    turnSound.currentTime = 0;
    turnSound.play().catch(() => {});
  }
}

function nextPage() {
  if (spreadStart >= TOTAL_PAGES) return;
  playTurn();
  spreadStart += spreadStart === 1 ? 1 : 2;
  render();
}

function prevPage() {
  if (spreadStart <= 1) return;
  playTurn();
  spreadStart = spreadStart === 2 ? 1 : spreadStart - 2;
  render();
}

prevBtn.onclick = nextPage;
nextBtn.onclick = prevPage;

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
