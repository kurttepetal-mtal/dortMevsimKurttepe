/* =========================================================
   AYARLAR
========================================================= */

const TOTAL_PAGES = 46;

// Video olan sayfalar (DOSYA ADLARINA GÖRE)
const videoMap = {
  1:  "videos/v01.mp4",
  5:  "videos/v05.mp4",   // ⭐ KESİN autoplay
  17: "videos/v17.mp4",
  22: "videos/v22.mp4",
  24: "videos/v24.mp4",
  26: "videos/v26.mp4",
  41: "videos/v41.mp4"
};

const bookEl   = document.getElementById("book");
const prevBtn  = document.getElementById("prevBtn");
const nextBtn  = document.getElementById("nextBtn");
const pageLabel = document.getElementById("pageLabel");
const turnSound = document.getElementById("turnSound");

/* =========================================================
   KULLANICI ETKİLEŞİMİ (SES / VIDEO KİLİDİ AÇMA)
========================================================= */

let unlocked = false;

function unlockOnce() {
  if (unlocked) return;
  unlocked = true;

  if (turnSound) {
    turnSound.volume = 0.3;
    turnSound.play().then(() => {
      turnSound.pause();
      turnSound.currentTime = 0;
    }).catch(() => {});
  }
}

document.addEventListener("click", unlockOnce, { once: true });
document.addEventListener("touchstart", unlockOnce, { once: true });

/* =========================================================
   SAYFA OLUŞTURMA
========================================================= */

function makePage(side, pageNo) {
  const page = document.createElement("div");
  page.className = `page ${side}`;
  page.dataset.pageNo = pageNo;

  // JPG arka plan
  const img = document.createElement("img");
  img.className = "bg";
  img.src = `pages/${String(pageNo).padStart(2, "0")}.jpg`;
  img.alt = `Sayfa ${pageNo}`;
  page.appendChild(img);

  // Video overlay
  if (videoMap[pageNo]) {
    page.classList.add("video");

    const video = document.createElement("video");
    video.src = videoMap[pageNo];

    video.muted = true;          // autoplay şartı
    video.playsInline = true;
    video.loop = true;
    video.preload = "auto";
    video.controls = false;

    video.style.position = "absolute";
    video.style.inset = "0";
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";

    // ⭐ ZORUNLU AUTOPLAY İŞARETİ
    video.dataset.forceAutoplay = "true";

    page.appendChild(video);
  }

  return page;
}

/* =========================================================
   RENDER MANTIĞI
========================================================= */

let spreadStart = 1;
let leftPageEl = null;
let rightPageEl = null;

function stopVideos() {
  document.querySelectorAll("video").forEach(v => {
    try { v.pause(); } catch {}
  });
}

function forcePlayVisibleVideos() {
  document.querySelectorAll(".page video").forEach(v => {
    const pageNo = v.closest(".page")?.dataset.pageNo;
    if (!pageNo) return;

    // ⭐ 5. SAYFA HER ZAMAN OYNASIN
    if (Number(pageNo) === 5) {
      v.currentTime = 0;
      v.muted = true;
      v.play().catch(() => {});
    } else {
      v.play().catch(() => {});
    }
  });
}

function render() {
  stopVideos();
  bookEl.innerHTML = "";

  const isCover = (spreadStart === 1);
  bookEl.classList.toggle("cover-mode", isCover);

  // Sol sayfa
  leftPageEl = makePage("left", spreadStart);
  bookEl.appendChild(leftPageEl);

  // Sağ sayfa (kapakta yok)
  if (!isCover && spreadStart + 1 <= TOTAL_PAGES) {
    rightPageEl = makePage("right", spreadStart + 1);
    bookEl.appendChild(rightPageEl);
  } else {
    rightPageEl = null;
  }

  pageLabel.textContent = spreadStart;

  prevBtn.disabled = spreadStart === 1;
  nextBtn.disabled = spreadStart >= TOTAL_PAGES;

  // ⭐ GECİKMELİ ZORLAMA
  setTimeout(forcePlayVisibleVideos, 300);
}

/* =========================================================
   SAYFA ÇEVİRME
========================================================= */

let flipping = false;

function flipNext() {
  if (flipping || spreadStart >= TOTAL_PAGES) return;
  flipping = true;

  if (turnSound && unlocked) {
    turnSound.currentTime = 0;
    turnSound.play().catch(() => {});
  }

  spreadStart = (spreadStart === 1) ? 2 : spreadStart + 2;

  setTimeout(() => {
    render();
    flipping = false;
  }, 450);
}

function flipPrev() {
  if (flipping || spreadStart <= 1) return;
  flipping = true;

  if (turnSound && unlocked) {
    turnSound.currentTime = 0;
    turnSound.play().catch(() => {});
  }

  spreadStart = (spreadStart === 2) ? 1 : spreadStart - 2;

  setTimeout(() => {
    render();
    flipping = false;
  }, 450);
}

/* =========================================================
   BUTON + KLAVYE + SWIPE
========================================================= */

prevBtn.addEventListener("click", flipPrev);
nextBtn.addEventListener("click", flipNext);

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") flipNext();
  if (e.key === "ArrowLeft") flipPrev();
});

// Mobil swipe
let startX = null;

bookEl.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
}, { passive: true });

bookEl.addEventListener("touchend", e => {
  if (startX === null) return;
  const dx = e.changedTouches[0].clientX - startX;
  startX = null;

  if (Math.abs(dx) < 40) return;
  dx < 0 ? flipNext() : flipPrev();
}, { passive: true });

/* =========================================================
   BAŞLAT
========================================================= */

render();
