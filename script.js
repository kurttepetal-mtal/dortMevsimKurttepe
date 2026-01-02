/* =========================================
   GENEL AYARLAR
========================================= */
const TOTAL_PAGES = 47;

/* Video olan sayfalar */
const videoPages = {
  1:  "videos/v01.mp4",
  17: "videos/v17.mp4",
  22: "videos/v22.mp4",
  24: "videos/v24.mp4",
  26: "videos/v26.mp4",
  41: "videos/v41.mp4",
  47: "videos/v01.mp4"   // Arka kapak
};

const bookEl = document.getElementById("book");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const indicator = document.getElementById("pageIndicator");
const hint = document.getElementById("hint");

/* 🔊 Sayfa çevirme sesi */
const flipSound = new Audio("audio/page-turn.mp3");
flipSound.volume = 0.35;

let unlocked = false;

/* =========================================
   SAYFA OLUŞTURMA
========================================= */
function createHtmlPage(pageNo) {
  const page = document.createElement("div");
  page.className = "page";
  page.dataset.pageNo = String(pageNo);

  /* Arka plan JPG */
  const img = document.createElement("img");
  img.className = "bg";
  img.alt = `Sayfa ${pageNo}`;
  img.src = `pages/${String(pageNo).padStart(2, "0")}.jpg`;
  img.onerror = () => {
    img.onerror = null;
    img.src = `pages/${pageNo}.jpg`;
  };
  page.appendChild(img);

  /* Video varsa */
  if (videoPages[pageNo]) {
    const v = document.createElement("video");
    v.className = "vid";
    v.src = videoPages[pageNo];
    v.muted = true;           // GitHub Pages autoplay şartı
    v.playsInline = true;
    v.loop = true;
    v.autoplay = true;
    v.preload = "metadata";
    v.controls = true;
    page.appendChild(v);
  }

  return page;
}

/* =========================================
   SAYFALARI YÜKLE
========================================= */
const pages = [];
for (let i = 1; i <= TOTAL_PAGES; i++) {
  const p = createHtmlPage(i);
  pages.push(p);
  bookEl.appendChild(p);
}

/* =========================================
   PAGE FLIP
========================================= */
const pageFlip = new St.PageFlip(bookEl, {
  width: 450,
  height: 650,
  size: "fixed",
  showCover: true,
  maxShadowOpacity: 0.6,
  flippingTime: 700,
  useMouseEvents: true,
  swipeDistance: 30
});

pageFlip.loadFromHTML(document.querySelectorAll(".page"));

/* =========================================
   SAYFA NUMARASI
========================================= */
function updateIndicator() {
  const idx = pageFlip.getCurrentPageIndex();
  const pageNo = idx + 1;

  if (pageNo === 1) {
    indicator.textContent = `1 / ${TOTAL_PAGES}`;
  } else {
    const left = pageNo % 2 === 0 ? pageNo : pageNo - 1;
    const right = Math.min(TOTAL_PAGES, left + 1);
    indicator.textContent = `${left}–${right} / ${TOTAL_PAGES}`;
  }

  prevBtn.disabled = (pageNo <= 1);
  nextBtn.disabled = (pageNo >= TOTAL_PAGES);
}

/* =========================================
   VİDEO SENKRON
========================================= */
function syncVideos() {
  const idx = pageFlip.getCurrentPageIndex();
  const visible = new Set([idx, idx + 1]);

  document.querySelectorAll(".page video").forEach(v => {
    const page = v.closest(".page");
    const no = Number(page?.dataset.pageNo || "0");
    const pageIndex = no - 1;

    if (visible.has(pageIndex)) {
      if (unlocked) v.play().catch(() => {});
    } else {
      try { v.pause(); } catch {}
    }
  });
}

/* =========================================
   SES
========================================= */
function playFlip() {
  if (!unlocked) return;
  try {
    flipSound.currentTime = 0;
    flipSound.play().catch(() => {});
  } catch {}
}

/* =========================================
   OLAYLAR
========================================= */
pageFlip.on("flip", () => {
  playFlip();
  updateIndicator();
  setTimeout(syncVideos, 200);
});

pageFlip.on("changeState", (e) => {
  if (e.data === "read") {
    updateIndicator();
    syncVideos();
  }
});

/* =========================================
   BUTONLAR
========================================= */
prevBtn.addEventListener("click", () => pageFlip.flipPrev());
nextBtn.addEventListener("click", () => pageFlip.flipNext());

/* =========================================
   AUTOPLAY UNLOCK
========================================= */
document.addEventListener("click", () => {
  if (unlocked) return;
  unlocked = true;
  if (hint) hint.style.display = "none";

  flipSound.play().then(() => {
    flipSound.pause();
    flipSound.currentTime = 0;
  }).catch(() => {});

  syncVideos();
}, { once: true });

/* =========================================
   BAŞLAT
========================================= */
updateIndicator();
syncVideos();
