/* =========================================================
   GENEL AYARLAR
========================================================= */
const TOTAL_PAGES = 47;      // 🔴 47 = arka kapak + video
const CHUNK_SIZE = 10;       // 10’ar 10 kademeli yükleme

/* Video olan sayfalar (KAPAKTA VİDEO YOK) */
const videoMap = {
  17: "videos/v17.mp4",
  22: "videos/v22.mp4",
  24: "videos/v24.mp4",
  26: "videos/v26.mp4",
  41: "videos/v41.mp4",
  47: "videos/v01.mp4"       // 🔴 KAPANIŞ VİDEOSU
};

/* =========================================================
   DOM REFERANSLARI
========================================================= */
const bookEl    = document.getElementById("book");
const prevBtn   = document.getElementById("prevBtn");
const nextBtn   = document.getElementById("nextBtn");
const pageLabel = document.getElementById("pageLabel");

/* =========================================================
   DURUM
========================================================= */
let spreadStart = 1;            // Soldaki sayfa numarası
let loadedUntil = CHUNK_SIZE;  // Kaçıncı sayfaya kadar yüklendi
let flipping = false;

/* =========================================================
   SAYFA OLUŞTURMA
========================================================= */
function createPage(side, pageNo) {
  const page = document.createElement("div");
  page.className = `page ${side}`;
  page.dataset.pageNo = pageNo;

  /* JPG arka plan */
  const img = document.createElement("img");
  img.className = "bg";
  img.src = `pages/${pageNo}.jpg`;
  img.alt = `Sayfa ${pageNo}`;
  img.loading = "lazy";
  page.appendChild(img);

  /* Video overlay (sadece videoMap’te varsa) */
  if (videoMap[pageNo]) {
    page.classList.add("video");

    const video = document.createElement("video");
    video.src = videoMap[pageNo];
    video.muted = true;          // Mobil autoplay için şart
    video.playsInline = true;
    video.loop = true;
    video.preload = "none";      // 🔴 Hız için
    video.controls = true;

    page.appendChild(video);
  }

  return page;
}

/* =========================================================
   KADEMELİ YÜKLEME KONTROLÜ
========================================================= */
function ensureLoaded(targetPage) {
  if (targetPage <= loadedUntil) return;

  const nextLimit = Math.min(
    loadedUntil + CHUNK_SIZE,
    TOTAL_PAGES
  );

  loadedUntil = nextLimit;
}

/* =========================================================
   VIDEO KONTROL
========================================================= */
function stopAllVideos() {
  bookEl.querySelectorAll("video").forEach(v => {
    try { v.pause(); } catch {}
  });
}

function playVisibleVideos() {
  bookEl.querySelectorAll(".page.video").forEach(p => {
    const v = p.querySelector("video");
    if (v) v.play().catch(() => {});
  });
}

/* =========================================================
   RENDER
========================================================= */
function render() {
  stopAllVideos();
  bookEl.innerHTML = "";

  const isCover = (spreadStart === 1);
  bookEl.classList.toggle("cover-mode", isCover);

  /* Gerekli sayfaları yükle */
  ensureLoaded(spreadStart + 1);

  /* Sol sayfa */
  if (spreadStart <= loadedUntil) {
    bookEl.appendChild(createPage("left", spreadStart));
  }

  /* Sağ sayfa (kapakta yok) */
  const rightNo = spreadStart + 1;
  if (!isCover && rightNo <= loadedUntil && rightNo <= TOTAL_PAGES) {
    bookEl.appendChild(createPage("right", rightNo));
  }

  /* Sayfa etiketi */
  if (isCover) {
    pageLabel.textContent = `1 / ${TOTAL_PAGES}`;
  } else if (spreadStart === TOTAL_PAGES) {
    pageLabel.textContent = `${TOTAL_PAGES} / ${TOTAL_PAGES}`;
  } else {
    pageLabel.textContent = `${spreadStart}-${spreadStart + 1} / ${TOTAL_PAGES}`;
  }

  prevBtn.disabled = (spreadStart <= 1);
  nextBtn.disabled = (spreadStart >= TOTAL_PAGES);

  playVisibleVideos();
}

/* =========================================================
   SAYFA GEÇİŞLERİ
========================================================= */
function nextPage() {
  if (flipping || spreadStart >= TOTAL_PAGES) return;
  flipping = true;

  spreadStart = (spreadStart === 1)
    ? 2
    : Math.min(spreadStart + 2, TOTAL_PAGES);

  render();
  flipping = false;
}

function prevPage() {
  if (flipping || spreadStart <= 1) return;
  flipping = true;

  spreadStart = (spreadStart === 2)
    ? 1
    : Math.max(spreadStart - 2, 1);

  render();
  flipping = false;
}

/* =========================================================
   OLAYLAR
========================================================= */
prevBtn.addEventListener("click", prevPage);
nextBtn.addEventListener("click", nextPage);

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") nextPage();
  if (e.key === "ArrowLeft") prevPage();
});

/* =========================================================
   BAŞLAT
========================================================= */
render();
