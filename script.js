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
   DURUM
========================================================= */
let currentPage = 1;

/* =========================================================
   CİHAZ
========================================================= */
function isMobile() {
  return window.innerWidth <= 768;
}

/* =========================================================
   PRELOAD (1 sayfa sonrası)
   - Yerleşimi bozmaz
   - Sadece dosyayı önceden indirir/ısındırır
========================================================= */
function preloadPage(pageNo) {
  if (!pageNo || pageNo < 1 || pageNo > TOTAL_PAGES) return;

  // JPG preload
  const img = new Image();
  img.src = `pages/${pageNo}.jpg`;

  // Video preload (sadece video varsa)
  if (videoMap[pageNo]) {
    const v = document.createElement("video");
    v.src = videoMap[pageNo];
    v.preload = "metadata";
    // DOM'a eklemiyoruz; sadece tarayıcı cache'ini ısıtıyoruz
  }
}

/* =========================================================
   SAYFA OLUŞTURMA
========================================================= */
function makePage(type, pageNo) {
  const page = document.createElement("div");
  page.className = `page ${type}`;

  if (!pageNo || pageNo < 1 || pageNo > TOTAL_PAGES) {
    page.classList.add("blank");
    return page;
  }

  const img = document.createElement("img");
  img.className = "bg";
  img.src = `pages/${pageNo}.jpg`;

  // Kullanıcıya hızlı hissiyat için:
  img.decoding = "async";
  img.loading = "eager";

  // Hata yakalama (dosya adı / yol hatasını hemen görürsünüz)
  img.onerror = () => {
    console.error(`[Flipbook] Görsel bulunamadı: pages/${pageNo}.jpg`);
  };

  page.appendChild(img);

  if (videoMap[pageNo]) {
    page.classList.add("video-page");

    const video = document.createElement("video");
    video.src = videoMap[pageNo];

    // mobil autoplay güvenliği:
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.controls = true;
    video.preload = "metadata";

    video.onerror = () => {
      console.error(`[Flipbook] Video bulunamadı: ${videoMap[pageNo]}`);
    };

    page.appendChild(video);

    const overlay = document.createElement("div");
    overlay.className = "video-play-overlay";
    overlay.innerHTML = "▶";
    overlay.onclick = () => {
      overlay.style.display = "none";
      video.muted = false;
      video.play().catch(() => {});
    };
    page.appendChild(overlay);
  }

  return page;
}

/* =========================================================
   RENDER
   - book.innerHTML temizliği korunuyor (kilitli düzen)
   - ama resize fırtınasında göz kırpma olmasın diye
     render çağrılarını debounce edeceğiz (aşağıda)
========================================================= */
function render() {
  const book = document.getElementById("book");
  const pageLabel = document.getElementById("pageLabel");
  if (!book) return;

  // Önce temizle (mevcut davranış)
  book.innerHTML = "";

  /* ================= MOBİL ================= */
  if (isMobile()) {
    book.appendChild(makePage("single", currentPage));
    if (pageLabel) pageLabel.textContent = `${currentPage} / ${TOTAL_PAGES}`;

    // ✅ 1 sayfa sonrasını preload
    preloadPage(currentPage + 1);

    // video varsa metadata ısıt
    if (videoMap[currentPage]) preloadPage(currentPage);

    return;
  }

  /* ================= MASAÜSTÜ ================= */
  let left = null;
  let right = null;

  if (currentPage === 1) {
    right = 1; // kapak sağda
  } else if (currentPage % 2 === 0) {
    left = currentPage;
    right = currentPage + 1;
  } else {
    left = currentPage - 1;
    right = currentPage;
  }

  book.appendChild(makePage("left", left));
  book.appendChild(makePage("right", right));

  if (pageLabel) {
    pageLabel.textContent = left
      ? `${left}-${right} / ${TOTAL_PAGES}`
      : `1 / ${TOTAL_PAGES}`;
  }

  // ✅ Masaüstünde bir sonraki spread’i hızlandırmak için:
  // currentPage 1 iken -> 2-3 geleceği için 2 ve 3 preload
  if (currentPage === 1) {
    preloadPage(2);
    preloadPage(3);
  } else {
    preloadPage(currentPage + 2); // bir sonraki çift adım
    preloadPage(currentPage + 3);
  }

  // mevcut sayfaların da cache'i sıcak kalsın
  preloadPage(left);
  preloadPage(right);
}

/* =========================================================
   SAYFA GEÇİŞ
========================================================= */
function nextPage() {
  if (isMobile()) {
    if (currentPage < TOTAL_PAGES) currentPage++;
  } else {
    currentPage = currentPage === 1 ? 2 : currentPage + 2;
    if (currentPage > TOTAL_PAGES) currentPage = TOTAL_PAGES;
  }
  render();
}

function prevPage() {
  if (isMobile()) {
    if (currentPage > 1) currentPage--;
  } else {
    currentPage = currentPage === 2 ? 1 : currentPage - 2;
    if (currentPage < 1) currentPage = 1;
  }
  render();
}

/* =========================================================
   RESIZE (KRİTİK DÜZELTME)
   Mobilde adres çubuğu yüzünden çok sık tetiklenir.
   Debounce ile “göründü-kayboldu” sorunu biter.
========================================================= */
let resizeTimer = null;
let lastModeMobile = null;

function handleResizeDebounced() {
  const nowMobile = isMobile();

  // İlk kurulum
  if (lastModeMobile === null) lastModeMobile = nowMobile;

  // Sürekli resize olursa timer yenile
  if (resizeTimer) clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    // Sadece MOD değiştiyse (mobil<->masaüstü) veya stabil olduktan sonra render
    const modeChanged = (nowMobile !== lastModeMobile);
    lastModeMobile = nowMobile;

    // Mod değişmediyse de bir kez render edelim ama "fırtına" bittikten sonra
    // (bu sayede mobilde göz kırpma olmaz)
    render();

    resizeTimer = null;
  }, 220);
}

/* =========================================================
   BAŞLAT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (prevBtn) prevBtn.onclick = prevPage;
  if (nextBtn) nextBtn.onclick = nextPage;

  // İlk render
  lastModeMobile = isMobile();
  render();

  // Açılış hızını arttırmak için ilk 2 sayfayı ısıt
  preloadPage(1);
  preloadPage(2);
  preloadPage(3);
});

// Debounce’lu resize
window.addEventListener("resize", handleResizeDebounced);
