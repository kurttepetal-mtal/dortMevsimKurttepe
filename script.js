/* =========================================================
   AYARLAR
========================================================= */
const TOTAL_PAGES = 46;

// Video olan sayfalar: sayfaNo -> video yolu
const videoMap = {
  1:  "videos/v01.mp4",
  5:  "videos/v05.mp4",
  17: "videos/v17.mp4",
  22: "videos/v22.mp4",
  24: "videos/v24.mp4",
  26: "videos/v26.mp4",
  41: "videos/v41.mp4"
};

const bookEl = document.getElementById("book");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageLabel = document.getElementById("pageLabel");
const hint = document.getElementById("hint");
const turnSound = document.getElementById("turnSound");

// Kullanıcı etkileşimi olmadan ses/video autoplay sınırlı.
let unlocked = false;
function unlockOnce() {
  if (unlocked) return;
  unlocked = true;
  // Ses “hazır” olsun diye kısa play/pause denemesi
  if (turnSound && turnSound.src) {
    turnSound.volume = 0.35;
    turnSound.play().then(() => {
      turnSound.pause();
      turnSound.currentTime = 0;
    }).catch(() => {});
  }
  if (hint) hint.style.display = "none";
}
document.addEventListener("click", unlockOnce, { once: true });
document.addEventListener("touchstart", unlockOnce, { once: true });

/* =========================================================
   SAYFA DOM ÜRETİMİ
========================================================= */
function makePage(side, pageNo) {
  const page = document.createElement("div");
  page.className = `page ${side}`;
  page.dataset.pageNo = String(pageNo);

  const bg = document.createElement("img");
  bg.className = "bg";
  bg.alt = `Sayfa ${pageNo}`;
  bg.src = `pages/${pageNo}.jpg`;
  page.appendChild(bg);

  // Video varsa overlay video ekle
  if (videoMap[pageNo]) {
    page.classList.add("video");

    const vid = document.createElement("video");
    vid.className = "vid";
    vid.src = videoMap[pageNo];
    vid.muted = true;           // mobilde autoplay için şart
    vid.playsInline = true;
    vid.loop = true;
    vid.preload = "metadata";
    vid.controls = true;        // istersen false yap
    page.appendChild(vid);
  }

  return page;
}

let leftPageEl = null;
let rightPageEl = null;

// “spreadStart” = soldaki sayfa numarası (kapakta 1)
let spreadStart = 1;

/* =========================================================
   RENDER
========================================================= */
function stopVideosIn(el) {
  if (!el) return;
  el.querySelectorAll("video").forEach(v => {
    try { v.pause(); } catch {}
  });
}

function playVideosIn(el) {
  if (!el) return;
  // kullanıcı etkileşimi yoksa autoplay bazen engellenir; muted olduğu için genelde oynar
  el.querySelectorAll("video").forEach(v => {
    v.play().catch(() => {});
  });
}

function render() {
  // Eski videoları durdur
  stopVideosIn(leftPageEl);
  stopVideosIn(rightPageEl);

  // Kapak modu: sadece 1. sayfa tek
  const isCover = (spreadStart === 1);
  bookEl.classList.toggle("cover-mode", isCover);

  // Var olan sayfaları kaldır
  bookEl.innerHTML = "";

  // Sol sayfa
  leftPageEl = makePage("left", spreadStart);
  bookEl.appendChild(leftPageEl);

  // Sağ sayfa (kapakta gizlenecek, CSS halleder)
  const rightNo = spreadStart + 1;
  if (rightNo <= TOTAL_PAGES) {
    rightPageEl = makePage("right", rightNo);
    bookEl.appendChild(rightPageEl);
  } else {
    rightPageEl = null;
  }

  // Label / butonlar
  pageLabel.textContent = String(spreadStart);
  prevBtn.disabled = (spreadStart <= 1);
  nextBtn.disabled = (spreadStart >= TOTAL_PAGES);

  // Görünür sayfalardaki videoları oynat
  playVideosIn(leftPageEl);
  playVideosIn(rightPageEl);
}

/* =========================================================
   FLIP ANİMASYONU
   - sağ sayfayı çevirir (ileri)
   - geri çevirme de basitçe aynı mantıkla yapılır
========================================================= */
let flipping = false;

function buildFlipLayer(frontPageNo, backPageNo) {
  const layer = document.createElement("div");
  layer.className = "flip-layer";

  const front = document.createElement("div");
  front.className = "flip-front";

  const back = document.createElement("div");
  back.className = "flip-back";

  // front (sağ sayfa)
  front.appendChild(buildMediaForFlip(frontPageNo));

  // back (sonraki sol sayfa)
  back.appendChild(buildMediaForFlip(backPageNo));

  layer.appendChild(front);
  layer.appendChild(back);
  return layer;
}

function buildMediaForFlip(pageNo) {
  const wrap = document.createElement("div");
  wrap.style.width = "100%";
  wrap.style.height = "100%";
  wrap.style.position = "relative";

  const img = document.createElement("img");
  img.src = `pages/${pageNo}.jpg`;
  img.alt = `Sayfa ${pageNo}`;
  wrap.appendChild(img);

  if (videoMap[pageNo]) {
    img.style.opacity = "0.55";
    const v = document.createElement("video");
    v.src = videoMap[pageNo];
    v.muted = true;
    v.playsInline = true;
    v.loop = true;
    v.preload = "metadata";
    v.controls = false; // flip sırasında kontrol göstermeyelim
    v.style.position = "absolute";
    v.style.inset = "0";
    v.style.width = "100%";
    v.style.height = "100%";
    v.style.objectFit = "cover";
    wrap.appendChild(v);

    // flip animasyonu sırasında sessiz de olsa oynatmayı deneyelim
    v.play().catch(() => {});
  }

  return wrap;
}

function playTurnSound() {
  if (!turnSound || !turnSound.src) return;
  if (!unlocked) return; // kullanıcı etkileşimi sonrası
  try {
    turnSound.currentTime = 0;
    turnSound.play().catch(() => {});
  } catch {}
}

function flipNext() {
  if (flipping) return;
  if (spreadStart >= TOTAL_PAGES) return;

  flipping = true;
  playTurnSound();

  // Kapakta (1) iken: sağ sayfa yok; ileri giderken 2-3 gösterilecek
  const isCover = (spreadStart === 1);
  const currentRight = isCover ? 1 : (spreadStart + 1);
  const nextLeft = isCover ? 2 : (spreadStart + 2);

  // Flip layer’ı oluştur
  const layer = buildFlipLayer(currentRight, nextLeft);
  bookEl.appendChild(layer);

  // Gerçek sayfaları geçici gizle (animasyon sırasında)
  if (leftPageEl) leftPageEl.style.visibility = "hidden";
  if (rightPageEl) rightPageEl.style.visibility = "hidden";

  // Animasyon
  let start = null;
  const duration = 520;

  function step(ts) {
    if (!start) start = ts;
    const t = Math.min(1, (ts - start) / duration);
    const angle = -180 * t;
    layer.style.transform = `rotateY(${angle}deg)`;

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      // Bir spread ileri: kapaktan sonra 2-3’e; sonra +2
      spreadStart = isCover ? 2 : (spreadStart + 2);
      flipping = false;
      render();
    }
  }

  requestAnimationFrame(step);
}

function flipPrev() {
  if (flipping) return;
  if (spreadStart <= 1) return;

  flipping = true;
  playTurnSound();

  // Geri giderken hedef spreadStart:
  const target = (spreadStart === 2) ? 1 : (spreadStart - 2);

  // Animasyon için:
  // şimdiki sol = spreadStart
  // önceki sağ = target === 1 ? 1 : target + 1
  const prevRight = (target === 1) ? 1 : (target + 1);
  const currentLeft = spreadStart;

  // flip layer’ı kitap sağ yarısında döndürmek yerine,
  // mobilde de stabil olsun diye aynı layer’ı kullanıp ters çeviriyoruz.
  const layer = buildFlipLayer(prevRight, currentLeft);
  bookEl.appendChild(layer);

  if (leftPageEl) leftPageEl.style.visibility = "hidden";
  if (rightPageEl) rightPageEl.style.visibility = "hidden";

  // Başlangıç -180’den 0’a (geri çevirme)
  let start = null;
  const duration = 520;

  function step(ts) {
    if (!start) start = ts;
    const t = Math.min(1, (ts - start) / duration);
    const angle = -180 + (180 * t);
    layer.style.transform = `rotateY(${angle}deg)`;

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      spreadStart = target;
      flipping = false;
      render();
    }
  }

  requestAnimationFrame(step);
}

/* =========================================================
   BUTONLAR + KLAVYE + SWIPE
========================================================= */
prevBtn.addEventListener("click", flipPrev);
nextBtn.addEventListener("click", flipNext);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") flipNext();
  if (e.key === "ArrowLeft") flipPrev();
});

// Basit swipe
let touchX = null;
bookEl.addEventListener("touchstart", (e) => {
  touchX = e.touches?.[0]?.clientX ?? null;
}, { passive: true });

bookEl.addEventListener("touchend", (e) => {
  if (touchX == null) return;
  const endX = e.changedTouches?.[0]?.clientX ?? touchX;
  const dx = endX - touchX;
  touchX = null;

  if (Math.abs(dx) < 40) return;
  if (dx < 0) flipNext();
  else flipPrev();
}, { passive: true });

/* =========================================================
   BAŞLAT
========================================================= */
render();
