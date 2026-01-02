/* =====================================================
   TEMEL AYARLAR
===================================================== */
const TOTAL_PAGES = 46;

/* Video olan sayfalar */
const videoPages = {
  1:  "videos/v01.mp4",
  5:  "videos/v05.mp4",
  17: "videos/v17.mp4",
  22: "videos/v22.mp4",
  24: "videos/v24.mp4",
  26: "videos/v26.mp4",
  41: "videos/v41.mp4"
};

const book = document.getElementById("book");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

/* Kapakta 1, sonra 2-3, 4-5... */
let currentPage = 1;

/* =====================================================
   SAYFA OLUŞTURMA
===================================================== */
function createPage(pageNo, side) {
  const page = document.createElement("div");
  page.className = `page ${side}`;

  /* Arka plan JPG */
  const img = document.createElement("img");
  img.src = `pages/${pageNo}.jpg`;
  img.className = "page-bg";
  page.appendChild(img);

  /* Video varsa */
  if (videoPages[pageNo]) {
    const video = document.createElement("video");
    video.src = videoPages[pageNo];
    video.className = "page-video";
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.loop = true;
    video.preload = "metadata";
    video.controls = true;

    page.appendChild(video);

    // görünür olunca oynat
    setTimeout(() => {
      video.play().catch(() => {});
    }, 200);
  }

  return page;
}

/* =====================================================
   RENDER
===================================================== */
function render() {
  book.innerHTML = "";

  /* Kapak */
  if (currentPage === 1) {
    book.classList.add("cover");
    book.appendChild(createPage(1, "right"));
  } 
  /* Normal çift sayfa */
  else {
    book.classList.remove("cover");

    const left = currentPage;
    const right = currentPage + 1;

    book.appendChild(createPage(left, "left"));
    if (right <= TOTAL_PAGES) {
      book.appendChild(createPage(right, "right"));
    }
  }

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage >= TOTAL_PAGES;
}

/* =====================================================
   NAVİGASYON
===================================================== */
nextBtn.addEventListener("click", () => {
  if (currentPage === 1) {
    currentPage = 2;
  } else if (currentPage + 2 <= TOTAL_PAGES) {
    currentPage += 2;
  }
  render();
});

prevBtn.addEventListener("click", () => {
  if (currentPage === 2) {
    currentPage = 1;
  } else if (currentPage - 2 >= 1) {
    currentPage -= 2;
  }
  render();
});

/* =====================================================
   SWIPE (MOBİL)
===================================================== */
let startX = null;

book.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
}, { passive: true });

book.addEventListener("touchend", e => {
  if (!startX) return;
  const dx = e.changedTouches[0].clientX - startX;
  startX = null;

  if (Math.abs(dx) < 40) return;
  if (dx < 0) nextBtn.click();
  else prevBtn.click();
}, { passive: true });

/* =====================================================
   BAŞLAT
===================================================== */
render();
