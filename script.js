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
   RENDER
========================================================= */
function render(withAnimation = false) {
  const book = document.getElementById("book");
  const pageLabel = document.getElementById("pageLabel");

  if (!book) return;

  if (isMobile()) {
    const oldPage = book.querySelector(".page");

    if (oldPage && withAnimation) {
      oldPage.classList.add("mobile-exit");
      isAnimating = true;

      oldPage.addEventListener("animationend", () => {
        book.innerHTML = "";
        const newPage = makePage("single", currentPage);
        newPage.classList.add("mobile-enter");
        book.appendChild(newPage);
        isAnimating = false;
      }, { once: true });

    } else {
      book.innerHTML = "";
      book.appendChild(makePage("single", currentPage));
    }

    pageLabel.textContent = `${currentPage} / ${TOTAL_PAGES}`;
    return;
  }

  /* ========== MASAÜSTÜ (DEĞİŞMEDİ) ========== */
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
    render();
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
    render();
  }
}

/* =========================================================
   BAŞLAT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("prevBtn").onclick = prevPage;
  document.getElementById("nextBtn").onclick = nextPage;
  render();
});

window.addEventListener("resize", render);
