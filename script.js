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
   DURUMLAR
========================================================= */
let currentPage = 1;
let isAnimating = false;

/* =========================================================
   CİHAZ
========================================================= */
function isMobile() {
  return window.innerWidth <= 768;
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
  page.appendChild(img);

  if (videoMap[pageNo]) {
    page.classList.add("video-page");

    const video = document.createElement("video");
    video.src = videoMap[pageNo];
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.controls = true;
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
   MOBİL CROSS-SLIDE (EŞ ZAMANLI) RENDER
   - Eski sayfa çıkarken yeni sayfa aynı anda girer
   - Yerleşime/düğmelere/masaüstüne dokunmaz
========================================================= */
function renderMobileWithCrossSlide(bookEl, newPageEl, durationMs = 320) {
  const oldPage = bookEl.querySelector(".page");

  // İlk açılışta eski sayfa yoksa direkt bas
  if (!oldPage) {
    bookEl.innerHTML = "";
    bookEl.appendChild(newPageEl);
    return;
  }

  isAnimating = true;

  const wrapper = document.createElement("div");
  wrapper.className = "mobile-slide-wrapper";

  // Eski sayfa: çıkış animasyonu
  oldPage.classList.add("mobile-slide-old");
  wrapper.appendChild(oldPage);

  // Yeni sayfa: giriş animasyonu
  newPageEl.classList.add("mobile-slide-new");
  wrapper.appendChild(newPageEl);

  bookEl.innerHTML = "";
  bookEl.appendChild(wrapper);

  // Animasyon bitince sadece yeni sayfa kalsın
  window.setTimeout(() => {
    bookEl.innerHTML = "";
    bookEl.appendChild(newPageEl);
    isAnimating = false;
  }, durationMs + 30);
}

/* =========================================================
   RENDER
========================================================= */
function render(withAnimation = false) {
  const book = document.getElementById("book");
  const pageLabel = document.getElementById("pageLabel");

  if (!book) return;

  /* ================= MOBİL ================= */
  if (isMobile()) {
    const newPage = makePage("single", currentPage);

    if (withAnimation) {
      renderMobileWithCrossSlide(book, newPage, 320);
    } else {
      book.innerHTML = "";
      book.appendChild(newPage);
    }

    pageLabel.textContent = `${currentPage} / ${TOTAL_PAGES}`;
    return;
  }

  /* ========== MASAÜSTÜ (KİLİTLİ / DEĞİŞMEDİ) ========== */
  book.innerHTML = "";

  let left = null, right = null;

  if (currentPage === 1) {
    right = 1;
  } else if (currentPage % 2 === 0) {
    left = currentPage;
    right = currentPage + 1;
  } else {
    left = currentPage - 1;
    right = currentPage;
  }

  book.appendChild(makePage("left", left));
  book.appendChild(makePage("right", right));

  pageLabel.textContent = left
    ? `${left}-${right} / ${TOTAL_PAGES}`
    : `1 / ${TOTAL_PAGES}`;
}

/* =========================================================
   SAYFA GEÇİŞ
========================================================= */
function nextPage() {
  if (isAnimating) return;

  if (isMobile()) {
    if (currentPage < TOTAL_PAGES) {
      currentPage++;
      render(true);
    }
  } else {
    currentPage = currentPage === 1 ? 2 : currentPage + 2;
    render(false);
  }
}

function prevPage() {
  if (isAnimating) return;

  if (isMobile()) {
    if (currentPage > 1) {
      currentPage--;
      render(true);
    }
  } else {
    currentPage = currentPage === 2 ? 1 : currentPage - 2;
    render(false);
  }
}

/* =========================================================
   BAŞLAT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (prevBtn) prevBtn.onclick = prevPage;
  if (nextBtn) nextBtn.onclick = nextPage;

  render(false);
});

window.addEventListener("resize", () => render(false));
