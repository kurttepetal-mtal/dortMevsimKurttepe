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
let currentPage = 1;
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
function makePage(position, pageNo) {
  const page = document.createElement("div");
  page.className = `page ${position}`;

  if (pageNo == null) {
    page.style.background = "transparent";
    return page;
  }

  const img = document.createElement("img");
  img.className = "bg";
  img.src = `pages/${pageNo}.jpg`;
  page.appendChild(img);

  if (videoMap[pageNo]) {
    page.classList.add("video-page");

    const video = document.createElement("video");
    video.src = videoMap[pageNo];
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.controls = true;
    page.appendChild(video);

    // Masaüstü için garanti play
    const playOverlay = document.createElement("div");
    playOverlay.className = "video-play-overlay";
    playOverlay.innerHTML = "▶";
    playOverlay.onclick = () => {
      playOverlay.style.display = "none";
      video.muted = false;
      video.play();
    };
    page.appendChild(playOverlay);
  }

  return page;
}

/* =========================================================
   RENDER (KİLİTLİ MANTIK)
========================================================= */
function render() {
  bookEl.innerHTML = "";

  /* ================= MOBİL ================= */
  if (isMobile()) {
    bookEl.appendChild(makePage("single", currentPage));
    pageLabel.textContent = `${currentPage} / ${TOTAL_PAGES}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= TOTAL_PAGES;
    return;
  }

  /* ================= MASAÜSTÜ ================= */
  if (currentPage === 1) {
    // Kapak: sol boş, sağ kapak
    bookEl.appendChild(makePage("left", null));
    bookEl.appendChild(makePage("right", 1));
    pageLabel.textContent = `1 / ${TOTAL_PAGES}`;
    prevBtn.disabled = true;
    nextBtn.disabled = false;
    return;
  }

  // currentPage her zaman SOL sayfa olacak şekilde ayarlanır
  let leftPage = currentPage;
  let rightPage = currentPage + 1;

  // Eğer currentPage TEK ise, bir geri al (çift yap)
  if (leftPage % 2 !== 0) {
    leftPage -= 1;
    rightPage = leftPage + 1;
  }

  bookEl.appendChild(makePage("left", leftPage));
  if (rightPage <= TOTAL_PAGES) {
    bookEl.appendChild(makePage("right", rightPage));
  }

  pageLabel.textContent = `${leftPage}-${rightPage} / ${TOTAL_PAGES}`;
  prevBtn.disabled = leftPage <= 2;
  nextBtn.disabled = rightPage >= TOTAL_PAGES;
}

/* =========================================================
   SAYFA GEÇİŞ
========================================================= */
function playTurnSound() {
  if (turnSound) {
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
    else currentPage += 2;
  }

  render();
}

function prevPage() {
  playTurnSound();

  if (isMobile()) {
    if (currentPage > 1) currentPage -= 1;
  } else {
    if (currentPage === 2) currentPage = 1;
    else currentPage -= 2;
  }

  render();
}

prevBtn.onclick = prevPage;
nextBtn.onclick = nextPage;

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

window.addEventListener("resize", render);
render();
