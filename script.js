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
  47: "videos/v01.mp4"
};

/* =========================================================
   DOM
========================================================= */
const bookEl    = document.getElementById("book");
const prevBtn   = document.getElementById("prevBtn");
const nextBtn   = document.getElementById("nextBtn");
const pageLabel = document.getElementById("pageLabel");

/* =========================================================
   YARDIMCI
========================================================= */
function isMobile() {
  return window.innerWidth <= 768;
}

/* =========================================================
   DURUM
========================================================= */
let currentPage = 1;

/* =========================================================
   SAYFA OLUŞTURMA
========================================================= */
function createPage(pageNo, side) {
  const page = document.createElement("div");
  page.className = `page ${side}`;
  page.dataset.pageNo = pageNo;

  if (pageNo === 0) {
    // Boş sol sayfa (kapak için)
    return page;
  }

  const img = document.createElement("img");
  img.className = "bg";
  img.src = `pages/${pageNo}.jpg`;
  page.appendChild(img);

  if (videoMap[pageNo]) {
    const v = document.createElement("video");
    v.src = videoMap[pageNo];
    v.muted = true;
    v.playsInline = true;
    v.loop = true;
    v.controls = true;
    page.appendChild(v);
  }

  return page;
}

/* =========================================================
   RENDER
========================================================= */
function render() {
  bookEl.innerHTML = "";

  /* =======================
     MOBİL: TEK SAYFA
  ======================= */
  if (isMobile()) {
    bookEl.appendChild(createPage(currentPage, "single"));
    pageLabel.textContent = `${currentPage} / ${TOTAL_PAGES}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= TOTAL_PAGES;
    return;
  }

  /* =======================
     MASAÜSTÜ
  ======================= */

  // KAPAK → SAĞDA
  if (currentPage === 1) {
    bookEl.appendChild(createPage(0, "left"));   // boş sol
    bookEl.appendChild(createPage(1, "right"));  // kapak sağda

    pageLabel.textContent = `1 / ${TOTAL_PAGES}`;
    prevBtn.disabled = true;
    nextBtn.disabled = false;
    return;
  }

  // NORMAL ÇİFT SAYFA
  bookEl.appendChild(createPage(currentPage, "left"));

  if (currentPage + 1 <= TOTAL_PAGES) {
    bookEl.appendChild(createPage(currentPage + 1, "right"));
  }

  pageLabel.textContent = `${currentPage}-${currentPage + 1} / ${TOTAL_PAGES}`;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage + 1 >= TOTAL_PAGES;
}

/* =========================================================
   GEÇİŞLER
========================================================= */
prevBtn.onclick = () => {
  if (isMobile()) {
    if (currentPage > 1) currentPage--;
  } else {
    if (currentPage === 2) currentPage = 1;
    else if (currentPage > 2) currentPage -= 2;
  }
  render();
};

nextBtn.onclick = () => {
  if (isMobile()) {
    if (currentPage < TOTAL_PAGES) currentPage++;
  } else {
    if (currentPage === 1) currentPage = 2;
    else if (currentPage + 1 < TOTAL_PAGES) currentPage += 2;
  }
  render();
};

/* =========================================================
   BAŞLAT
========================================================= */
render();
