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

/* 🔊 SES */
const flipSound = new Audio("audio/page-turn.mp3");
flipSound.volume = 0.35;

let spread = 1;
let flipping = false;

/* JPG uyumu */
function setSmartImg(img, pageNo) {
  const padded = `pages/${String(pageNo).padStart(2, "0")}.jpg`;
  const plain  = `pages/${pageNo}.jpg`;
  img.src = padded;
  img.onerror = () => {
    img.onerror = null;
    img.src = plain;
  };
}

/* Sayfa */
function createPage(pageNo, blank=false) {
  const page = document.createElement("div");
  page.className = "page";

  if (blank) return page;

  const img = document.createElement("img");
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
    page.appendChild(v);
  }

  return page;
}

/* Curl katmanı */
function buildFlipLayer(frontNo, backNo) {
  const layer = document.createElement("div");
  layer.className = "flip-layer";

  const front = document.createElement("div");
  front.className = "flip-front";
  front.appendChild(createPage(frontNo));

  const back = document.createElement("div");
  back.className = "flip-back";
  back.appendChild(createPage(backNo));

  layer.appendChild(front);
  layer.appendChild(back);
  return layer;
}

/* Render */
function render() {
  book.innerHTML = "";

  if (spread === 1) {
    book.appendChild(createPage(0, true));
    book.appendChild(createPage(1));
    indicator.textContent = `1 / ${TOTAL_PAGES}`;
  } else {
    book.appendChild(createPage(spread));
    book.appendChild(createPage(spread + 1));
    indicator.textContent = `${spread}–${spread+1} / ${TOTAL_PAGES}`;
  }
}

/* Ses */
function playFlipSound() {
  try {
    flipSound.currentTime = 0;
    flipSound.play().catch(()=>{});
  } catch {}
}

/* PAGE CURL – İLERİ */
function flipNext() {
  if (flipping || spread >= TOTAL_PAGES) return;
  flipping = true;
  playFlipSound();

  const isCover = (spread === 1);
  const front = isCover ? 1 : spread + 1;
  const back  = isCover ? 2 : spread + 2;

  const layer = buildFlipLayer(front, back);
  book.appendChild(layer);

  let start = null;
  const duration = 750;

  function step(ts) {
    if (!start) start = ts;
    const t = Math.min(1, (ts - start) / duration);

    const rotate = -180 * t;
    const curl   = Math.sin(t * Math.PI) * 14;
    const lift   = Math.sin(t * Math.PI) * 12;

    layer.style.transform =
      `rotateY(${rotate}deg)
       rotateX(${curl}deg)
       translateZ(${lift}px)`;

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      spread = isCover ? 2 : spread + 2;
      flipping = false;
      render();
    }
  }
  requestAnimationFrame(step);
}

/* GERİ */
function flipPrev() {
  if (flipping || spread <= 1) return;
  flipping = true;
  playFlipSound();

  const target = (spread === 2) ? 1 : spread - 2;
  const front = target === 1 ? 1 : target + 1;
  const back  = spread;

  const layer = buildFlipLayer(front, back);
  book.appendChild(layer);
  layer.style.transform = "rotateY(-180deg)";

  let start = null;
  const duration = 750;

  function step(ts) {
    if (!start) start = ts;
    const t = Math.min(1, (ts - start) / duration);

    const rotate = -180 + 180 * t;
    const curl   = Math.sin((1 - t) * Math.PI) * 14;
    const lift   = Math.sin((1 - t) * Math.PI) * 12;

    layer.style.transform =
      `rotateY(${rotate}deg)
       rotateX(${curl}deg)
       translateZ(${lift}px)`;

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      spread = target;
      flipping = false;
      render();
    }
  }
  requestAnimationFrame(step);
}

/* Butonlar */
nextBtn.onclick = flipNext;
prevBtn.onclick = flipPrev;

/* Autoplay unlock */
document.addEventListener("click", () => {
  hint.style.display = "none";
  try {
    flipSound.play().then(() => {
      flipSound.pause();
      flipSound.currentTime = 0;
    }).catch(()=>{});
  } catch {}
  document.querySelectorAll("video").forEach(v => v.play().catch(()=>{}));
}, { once:true });

render();
