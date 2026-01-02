const TOTAL_PAGES = 46;

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

let spreadStart = 1;

/* ---------- SAYFA ---------- */
function createPage(side, pageNo) {
  const page = document.createElement("div");
  page.className = `page ${side}`;

  const img = document.createElement("img");
  img.src = `pages/${String(pageNo).padStart(2,"0")}.jpg`;
  page.appendChild(img);

  if (videoMap[pageNo]) {
    const video = document.createElement("video");
    video.src = videoMap[pageNo];
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.controls = true;
    page.appendChild(video);
  }

  return page;
}

/* ---------- RENDER ---------- */
function render() {
  book.innerHTML = "";

  const isCover = spreadStart === 1;
  book.classList.toggle("cover-mode", isCover);

  if (isCover) {
    book.appendChild(createPage("right", 1));
  } else {
    book.appendChild(createPage("left", spreadStart));
    if (spreadStart + 1 <= TOTAL_PAGES) {
      book.appendChild(createPage("right", spreadStart + 1));
    }
  }

  prevBtn.disabled = spreadStart === 1;
  nextBtn.disabled = spreadStart >= TOTAL_PAGES;
}

/* ---------- NAV ---------- */
nextBtn.onclick = () => {
  spreadStart = spreadStart === 1 ? 2 : spreadStart + 2;
  render();
};

prevBtn.onclick = () => {
  spreadStart = spreadStart === 2 ? 1 : spreadStart - 2;
  render();
};

/* ---------- AUTOPLAY UNLOCK ---------- */
document.addEventListener("click", () => {
  document.querySelectorAll("video").forEach(v => v.play().catch(()=>{}));
  hint.style.display = "none";
}, { once:true });

render();
