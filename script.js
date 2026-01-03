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
let currentPage = 1;   // MOBİL ve MASAÜSTÜ ortak tek referans
let zoom = 1;
let unlocked = false;

/* =========================================================
   YARDIMCI
========================================================= */
function isMobile() {
  return window.innerWidth <= 768;
}

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

  /* ------------------ 📱 MOBİL ------------------ */
  if (isMobile()) {

    const page = makePage("single", currentPage);
    bookEl.appendChild(page);

    pageLabel.textContent = `${currentPage} / ${TOTAL_PAGES}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= TOTAL_PAGES;

  /* ------------------ 🖥️ MASAÜSTÜ ------------------ */
  } else {

    if (currentPage === 1) {
      // Kapak: sol boş, sağ kapak
      bookEl.appendChild(makePage("left", null, true));
      bookEl.appendChild(makePage("right", 1));
      pageLabel.textContent = `1 / ${TOTAL_PAGES}`;
      prevBtn.disabled = true;
      nextBtn.disabled = false;

    } else {
      const leftNo  = currentPage;
      const rightNo = currentPage + 1;

      bookEl.appendChild(makePage("left", leftNo));
      if (rightNo <= TOTAL_PAGES) {
        bookEl.appendChild(makePage("right", rightNo));
      }

      pageLabel.textContent = `${leftNo}-${rightNo} / ${TOTAL_PAGES}`;
      prevBtn.disabled = false;
      nextBtn.disabled = rightNo >= TOTAL_PAGES;
    }
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

  if (isMobile()) {
    if (currentPage < TOTAL_PAGES) currentPage += 1;
  } else {
    if (currentPage === 1) currentPage = 2;
    else if (currentPage + 2 <= TOTAL_PAGES) currentPage += 2;
  }

  render();
}

function prevPage() {
  playTurnSound();

  if (isMobile()) {
    if (currentPage > 1) currentPage -= 1;
  } else {
    if (currentPage === 2) currentPage = 1;
    else if (currentPage > 2) currentPage -= 2;
  }

  render();
}

prevBtn.addEventListener("click", prevPage);
nextBtn.addEventListener("click", nextPage);

/* =========================================================
   ZOOM (MASAÜSTÜ)
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
   BAŞLAT + EKRAN DEĞİŞİMİ
========================================================= */
window.addEventListener("resize", render);
render();
