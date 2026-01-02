/* =====================================================
   AYARLAR
===================================================== */
const TOTAL_PAGES = 46;

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
const indicator = document.getElementById("pageIndicator");
const hint = document.getElementById("hint");

/*
  currentSpread:
  - 1  => kapak (sol boş, sağ 1)
  - 2  => 2–3
  - 4  => 4–5
  ...
*/
let currentSpread = 1;

/* =====================================================
   DOSYA ADI UYUMLULUĞU (1.jpg mi 01.jpg mi?)
   Önce padded (01.jpg) dener; olmazsa plain (1.jpg) dener.
===================================================== */
function setSmartPageImage(imgEl, pageNo) {
  const padded = `pages/${String(pageNo).padStart(2, "0")}.jpg`;
  const plain  = `pages/${pageNo}.jpg`;

  // 1) padded dene
  imgEl.src = padded;

  // 2) olmazsa plain'e düş
  imgEl.onerror = () => {
    imgEl.onerror = null;
    imgEl.src = plain;
  };
}

/* =====================================================
   SAYFA OLUŞTURMA
===================================================== */
function createPage(pageNo, isBlank = false) {
  const page = document.createElement("div");
  page.className = "page";
  page.dataset.pageNo = isBlank ? "" : String(pageNo);

  if (isBlank) return page;

  // JPG arka plan (varsa)
  const img = document.createElement("img");
  img.alt = `Sayfa ${pageNo}`;
  setSmartPageImage(img, pageNo);
  page.appendChild(img);

  // Video overlay (varsa)
  if (videoPages[pageNo]) {
    const v = document.createElement("video");
    v.src = videoPages[pageNo];
    v.muted = true;
    v.autoplay = true;
    v.loop = true;
    v.playsInline = true;
    v.controls = true;
    v.preload = "metadata";
    page.appendChild(v);

    // Bazı cihazlarda autoplay kaçarsa görünürken tekrar dene
    setTimeout(() => {
      v.play().catch(() => {});
    }, 250);
  }

  return page;
}

/* =====================================================
   GÖRÜNÜR SAYFALARI BUL (Sayfa numarasını buradan yazdıracağız)
===================================================== */
function getVisiblePageNumbers() {
  const nums = [];
  book.querySelectorAll(".page").forEach(p => {
    const n = Number(p.dataset.pageNo);
    if (!Number.isNaN(n) && n > 0) nums.push(n);
  });
  return nums;
}

/* =====================================================
   VİDEO AUTOPLAY UNLOCK (mobil için)
===================================================== */
function unlockAutoplayOnce() {
  if (hint) hint.style.display = "none";
  book.querySelectorAll("video").forEach(v => v.play().catch(() => {}));
  document.removeEventListener("click", unlockAutoplayOnce);
  document.removeEventListener("touchstart", unlockAutoplayOnce);
}
document.addEventListener("click", unlockAutoplayOnce);
document.addEventListener("touchstart", unlockAutoplayOnce, { passive: true });

/* =====================================================
   RENDER
===================================================== */
function render() {
  // önce içerik temizle
  book.innerHTML = "";

  // Kapak: sol boş + sağ 1
  if (currentSpread === 1) {
    book.appendChild(createPage(0, true));
    book.appendChild(createPage(1, false));
  } else {
    const leftNo = currentSpread;
    const rightNo = currentSpread + 1;

    book.appendChild(createPage(leftNo, false));

    if (rightNo <= TOTAL_PAGES) {
      book.appendChild(createPage(rightNo, false));
    } else {
      book.appendChild(createPage(0, true));
    }
  }

  // Butonlar
  prevBtn.disabled = (currentSpread === 1);
  nextBtn.disabled = (currentSpread >= TOTAL_PAGES);

  // Sayfa numarası: EKRANDA GÖSTERİLEN sayfalara göre yaz
  const visible = getVisiblePageNumbers();
  if (visible.length === 1) {
    indicator.textContent = `${visible[0]} / ${TOTAL_PAGES}`;
  } else if (visible.length >= 2) {
    indicator.textContent = `${visible[0]}–${visible[1]} / ${TOTAL_PAGES}`;
  } else {
    indicator.textContent = ` / ${TOTAL_PAGES}`;
  }

  // Görünür videoları tekrar oynatmayı dene (özellikle 5. sayfa için)
  setTimeout(() => {
    book.querySelectorAll("video").forEach(v => v.play().catch(() => {}));
  }, 350);
}

/* =====================================================
   NAVİGASYON
===================================================== */
nextBtn.onclick = () => {
  if (currentSpread === 1) {
    currentSpread = 2;
  } else {
    currentSpread += 2;
  }
  if (currentSpread > TOTAL_PAGES) currentSpread = TOTAL_PAGES;
  render();
};

prevBtn.onclick = () => {
  if (currentSpread === 2) {
    currentSpread = 1;
  } else {
    currentSpread -= 2;
  }
  if (currentSpread < 1) currentSpread = 1;
  render();
};

/* =====================================================
   BAŞLAT
===================================================== */
render();
