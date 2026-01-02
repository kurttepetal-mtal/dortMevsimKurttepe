/* ================================
   AYARLAR
================================ */
const TOTAL_PAGES = 46;

const videoPages = {
  1:  "videos/v01.mp4",
  5:  "videos/v05.mp4",   // 🔴 ZORLA AUTOPLAY
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
  spread:
  1  => kapak (sol boş, sağ 1)
  2  => 2–3
  4  => 4–5
  ...
*/
let spread = 1;

/* ================================
   JPG ADI UYUMLULUĞU
   01.jpg varsa onu, yoksa 1.jpg
================================ */
function setSmartImg(img, pageNo) {
  const padded = `pages/${String(pageNo).padStart(2, "0")}.jpg`;
  const plain  = `pages/${pageNo}.jpg`;
  img.src = padded;
  img.onerror = () => {
    img.onerror = null;
    img.src = plain;
  };
}

/* ================================
   SAYFA OLUŞTUR
================================ */
function createPage(pageNo, blank=false) {
  const page = document.createElement("div");
  page.className = "page";
  page.dataset.pageNo = blank ? "" : String(pageNo);

  if (blank) return page;

  const img = document.createElement("img");
  img.alt = `Sayfa ${pageNo}`;
  setSmartImg(img, pageNo);
  page.appendChild(img);

  if (videoPages[pageNo]) {
    const v = document.createElement("video");
    v.src = videoPages[pageNo];
    v.muted = true;
    v.playsInline = true;
    v.loop = true;
    v.autoplay = true;
    v.controls = true;
    v.preload = "auto";
    page.appendChild(v);
  }

  return page;
}

/* ================================
   GÖRÜNÜR SAYFALARI BUL
================================ */
function visiblePages() {
  return Array.from(book.querySelectorAll(".page"))
    .map(p => Number(p.dataset.pageNo))
    .filter(n => !Number.isNaN(n) && n > 0);
}

/* ================================
   VİDEOLARI ZORLA OYNAT
   (özellikle 5. sayfa)
================================ */
function forcePlayVideos() {
  book.querySelectorAll("video").forEach(v => {
    try {
      v.currentTime = 0;          // 🔴 başa al
      v.play().catch(()=>{});
    } catch {}
  });
}

/* ================================
   AUTOPLAY UNLOCK (mobil)
================================ */
function unlockOnce() {
  if (hint) hint.style.display = "none";
  forcePlayVideos();
  document.removeEventListener("click", unlockOnce);
  document.removeEventListener("touchstart", unlockOnce);
}
document.addEventListener("click", unlockOnce);
document.addEventListener("touchstart", unlockOnce, { passive:true });

/* ================================
   RENDER
================================ */
function render() {
  book.innerHTML = "";

  if (spread === 1) {
    // Kapak: sol boş, sağ 1
    book.appendChild(createPage(0, true));
    book.appendChild(createPage(1));
  } else {
    const left = spread;
    const right = spread + 1;
    book.appendChild(createPage(left));
    if (right <= TOTAL_PAGES) {
      book.appendChild(createPage(right));
    } else {
      book.appendChild(createPage(0, true));
    }
  }

  // Sayfa göstergesi (EKRANDA GÖRÜNENE GÖRE)
  const vis = visiblePages();
  if (vis.length === 1) {
    indicator.textContent = `${vis[0]} / ${TOTAL_PAGES}`;
  } else if (vis.length >= 2) {
    indicator.textContent = `${vis[0]}–${vis[1]} / ${TOTAL_PAGES}`;
  } else {
    indicator.textContent = ` / ${TOTAL_PAGES}`;
  }

  prevBtn.disabled = (spread === 1);
  nextBtn.disabled = (spread >= TOTAL_PAGES);

  // 🔴 Görünür olur olmaz videoları ZORLA oynat
  setTimeout(forcePlayVideos, 300);
}

/* ================================
   NAV
================================ */
nextBtn.onclick = () => {
  spread = (spread === 1) ? 2 : (spread + 2);
  if (spread > TOTAL_PAGES) spread = TOTAL_PAGES;
  render();
};

prevBtn.onclick = () => {
  spread = (spread === 2) ? 1 : (spread - 2);
  if (spread < 1) spread = 1;
  render();
};

/* ================================
   BAŞLAT
================================ */
render();
