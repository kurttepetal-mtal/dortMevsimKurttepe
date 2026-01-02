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

const bookEl = document.getElementById("book");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const indicator = document.getElementById("pageIndicator");
const hint = document.getElementById("hint");

/* Ses */
const flipSound = new Audio("audio/page-turn.mp3");
flipSound.volume = 0.35;

let unlocked = false;

/* Sayfa DOM üret */
function createHtmlPage(pageNo){
  const page = document.createElement("div");
  page.className = "page";
  page.dataset.pageNo = String(pageNo);

  const img = document.createElement("img");
  img.className = "bg";
  img.alt = `Sayfa ${pageNo}`;
  img.src = `pages/${String(pageNo).padStart(2,"0")}.jpg`;
  img.onerror = () => { img.src = `pages/${pageNo}.jpg`; };
  page.appendChild(img);

  if (videoPages[pageNo]) {
    const v = document.createElement("video");
    v.className = "vid";
    v.src = videoPages[pageNo];
    v.muted = true;
    v.playsInline = true;
    v.loop = true;
    v.autoplay = true;
    v.preload = "metadata";
    v.controls = true;
    page.appendChild(v);
  }

  return page;
}

/* Sayfaları kitap içine ekle */
const pages = [];
for(let i=1;i<=TOTAL_PAGES;i++){
  const p = createHtmlPage(i);
  pages.push(p);
  bookEl.appendChild(p);
}

/* PageFlip başlat */
const pageFlip = new St.PageFlip(bookEl, {
  width: 450,
  height: 650,
  size: "fixed",
  showCover: true,          // ✅ kapak tek
  maxShadowOpacity: 0.6,
  flippingTime: 700,        // daha “dergi” gibi
  useMouseEvents: true,
  swipeDistance: 30
});

pageFlip.loadFromHTML(document.querySelectorAll(".page"));

/* Sayfa numarası yazdırma */
function updateIndicator(){
  // getCurrentPageIndex: 0-based
  const idx = pageFlip.getCurrentPageIndex();
  const pageNo = idx + 1;

  // showCover: kapakta tek sayfa mantığı
  if (pageNo === 1) {
    indicator.textContent = `1 / ${TOTAL_PAGES}`;
  } else {
    // Book modunda genelde çift görünüyor; biz 2’li aralığı yazalım:
    const left = pageNo % 2 === 0 ? pageNo : pageNo - 1;
    const right = Math.min(TOTAL_PAGES, left + 1);
    indicator.textContent = `${left}–${right} / ${TOTAL_PAGES}`;
  }

  prevBtn.disabled = (pageNo <= 1);
  nextBtn.disabled = (pageNo >= TOTAL_PAGES);
}

/* Videoları performanslı yönet: sadece görünen sayfalarda oynat */
function syncVideos(){
  const idx = pageFlip.getCurrentPageIndex();
  const visible = new Set([idx, idx+1]); // olası sağ sayfa

  document.querySelectorAll(".page video").forEach(v => {
    const page = v.closest(".page");
    const no = Number(page?.dataset.pageNo || "0");
    const pageIndex = no - 1;

    if (visible.has(pageIndex)) {
      // görünür: oynat
      if (unlocked) v.play().catch(()=>{});
    } else {
      // görünmez: durdur
      try { v.pause(); } catch {}
    }
  });
}

/* Flip sesi */
function playFlip(){
  if (!unlocked) return;
  try { flipSound.currentTime = 0; flipSound.play().catch(()=>{}); } catch {}
}

/* Olaylar */
pageFlip.on("flip", () => {
  playFlip();
  updateIndicator();
  // animasyon bitince video senkronla
  setTimeout(syncVideos, 200);
});

pageFlip.on("changeState", (e) => {
  // state: "flipping" vs "read"
  if (e.data === "read") {
    updateIndicator();
    syncVideos();
  }
});

/* Butonlar */
prevBtn.addEventListener("click", () => pageFlip.flipPrev());
nextBtn.addEventListener("click", () => pageFlip.flipNext());

/* Autoplay unlock: ilk tıklama */
document.addEventListener("click", () => {
  if (unlocked) return;
  unlocked = true;
  if (hint) hint.style.display = "none";

  // sesi “unlock” et
  flipSound.play().then(() => {
    flipSound.pause();
    flipSound.currentTime = 0;
  }).catch(()=>{});

  // görünür videoları oynat
  syncVideos();
}, { once:true });

/* Başlat */
updateIndicator();
syncVideos();
