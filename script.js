const TOTAL_PAGES = 46;

/*
  Videolar: sayfaNo -> video yolu
  Dikkat: klasör adı "videos"
*/
const videoMap = {
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
const hint = document.getElementById("hint");

let spreadStart = 1; // kapak

/* -------------------------------------------------------
   SAYFA GÖRSELİ: önce "1.jpg" dener, yoksa "01.jpg" dener
   Çünkü sizde bazıları 05.jpg gibi, bazıları 1.jpg gibi.
-------------------------------------------------------- */
function setSmartImageSrc(imgEl, pageNo) {
  const plain = `pages/${pageNo}.jpg`;
  const padded = `pages/${String(pageNo).padStart(2, "0")}.jpg`;

  imgEl.onerror = () => {
    if (imgEl.dataset.tried === "plain") {
      imgEl.onerror = null;
      imgEl.src = padded;
      imgEl.dataset.tried = "padded";
    }
  };

  imgEl.dataset.tried = "plain";
  imgEl.src = plain;
}

/* -------------------------------------------------------
   SAYFA OLUŞTURMA
-------------------------------------------------------- */
function createPage(side, pageNo, isBlank = false) {
  const page = document.createElement("div");
  page.className = `page ${side}`;
  page.dataset.pageNo = String(pageNo);

  if (isBlank) {
    // boş sayfa (kapakta sol taraf)
    return page;
  }

  // Arka plan JPG
  const img = document.createElement("img");
  img.className = "bg";
  img.alt = `Sayfa ${pageNo}`;
  setSmartImageSrc(img, pageNo);
  page.appendChild(img);

  // Video overlay (varsa)
  if (videoMap[pageNo]) {
    const video = document.createElement("video");
    video.className = "vid";
    video.src = videoMap[pageNo];

    // Autoplay için gerekli
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.autoplay = true;
    video.preload = "metadata";

    // Kullanıcı isterse kontrol görsün
    video.controls = true;

    page.appendChild(video);
  }

  return page;
}

/* -------------------------------------------------------
   VİDEO OYNATMA: görünür sayfalarda tekrar dener
-------------------------------------------------------- */
function tryPlayVisibleVideos() {
  const vids = book.querySelectorAll("video.vid");
  vids.forEach(v => {
    // bazen first load'da autoplay kaçırıyor; tekrar dene
    v.play().catch(() => {});
  });
}

/* -------------------------------------------------------
   RENDER
-------------------------------------------------------- */
function render() {
  book.innerHTML = "";

  const isCover = (spreadStart === 1);
  book.classList.toggle("cover-mode", isCover);

  if (isCover) {
    // KAPAK: sol boş, sağ kapak (1)
    book.appendChild(createPage("left", 0, true));
    book.appendChild(createPage("right", 1, false));
  } else {
    // NORMAL: sol = spreadStart, sağ = spreadStart+1
    book.appendChild(createPage("left", spreadStart, false));
    if (spreadStart + 1 <= TOTAL_PAGES) {
      book.appendChild(createPage("right", spreadStart + 1, false));
    } else {
      book.appendChild(createPage("right", 0, true));
    }
  }

  // Buton durumları
  prevBtn.disabled = (spreadStart === 1);
  nextBtn.disabled = (spreadStart >= TOTAL_PAGES);

  // Video dene
  tryPlayVisibleVideos();
}

/* -------------------------------------------------------
   NAV
-------------------------------------------------------- */
nextBtn.addEventListener("click", () => {
  spreadStart = (spreadStart === 1) ? 2 : (spreadStart + 2);
  if (spreadStart > TOTAL_PAGES) spreadStart = TOTAL_PAGES;
  render();
});

prevBtn.addEventListener("click", () => {
  spreadStart = (spreadStart === 2) ? 1 : (spreadStart - 2);
  if (spreadStart < 1) spreadStart = 1;
  render();
});

/* -------------------------------------------------------
   AUTOPLAY UNLOCK (mobil için)
   İlk tıklamada videoları tekrar play() dener.
-------------------------------------------------------- */
function unlockOnce() {
  hint.style.display = "none";
  tryPlayVisibleVideos();
  document.removeEventListener("click", unlockOnce);
  document.removeEventListener("touchstart", unlockOnce);
}
document.addEventListener("click", unlockOnce);
document.addEventListener("touchstart", unlockOnce, { passive: true });

/* -------------------------------------------------------
   BAŞLAT
-------------------------------------------------------- */
render();
