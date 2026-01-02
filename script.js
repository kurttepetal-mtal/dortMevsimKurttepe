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

let current = 1;

/* Sayfa oluştur */
function createPage(pageNo, blank = false) {
  const page = document.createElement("div");
  page.className = "page";

  if (blank) return page;

  const img = document.createElement("img");
  img.src = `pages/${String(pageNo).padStart(2, "0")}.jpg`;
  page.appendChild(img);

  if (videoPages[pageNo]) {
    const v = document.createElement("video");
    v.src = videoPages[pageNo];
    v.muted = true;
    v.autoplay = true;
    v.loop = true;
    v.playsInline = true;
    v.controls = true;
    page.appendChild(v);

    setTimeout(() => v.play().catch(()=>{}), 200);
  }

  return page;
}

/* Render */
function render() {
  book.innerHTML = "";

  if (current === 1) {
    book.appendChild(createPage(0, true));
    book.appendChild(createPage(1));
    indicator.textContent = `1 / ${TOTAL_PAGES}`;
  } else {
    book.appendChild(createPage(current));
    if (current + 1 <= TOTAL_PAGES) {
      book.appendChild(createPage(current + 1));
      indicator.textContent = `${current}–${current+1} / ${TOTAL_PAGES}`;
    } else {
      indicator.textContent = `${current} / ${TOTAL_PAGES}`;
    }
  }

  prevBtn.disabled = current === 1;
  nextBtn.disabled = current >= TOTAL_PAGES;
}

/* Navigasyon */
nextBtn.onclick = () => {
  current = current === 1 ? 2 : current + 2;
  render();
};

prevBtn.onclick = () => {
  current = current === 2 ? 1 : current - 2;
  render();
};

/* Autoplay unlock */
document.addEventListener("click", () => {
  hint.style.display = "none";
  document.querySelectorAll("video").forEach(v => v.play().catch(()=>{}));
}, { once:true });

render();
