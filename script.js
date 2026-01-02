const bookContainer = document.getElementById("book-container");
const video = document.getElementById("pageVideo");

/* PageFlip */
const pageFlip = new St.PageFlip(bookContainer, {
  width: 450,
  height: 650,
  showCover: true
});

/* Sayfalar */
pageFlip.loadFromImages([
  "pages/1.png","pages/2.png","pages/3.png","pages/4.png","pages/5.png",
  "pages/6.png","pages/7.png","pages/8.png","pages/9.png","pages/10.png",
  "pages/11.png","pages/12.png","pages/13.png","pages/14.png","pages/15.png",
  "pages/16.png","pages/17.png","pages/18.png","pages/19.png","pages/20.png",
  "pages/21.png","pages/22.png","pages/23.png","pages/24.png","pages/25.png",
  "pages/26.png","pages/27.png","pages/28.png","pages/29.png","pages/30.png",
  "pages/31.png","pages/32.png","pages/33.png","pages/34.png","pages/35.png",
  "pages/36.png","pages/37.png","pages/38.png","pages/39.png","pages/40.png",
  "pages/41.png","pages/42.png","pages/43.png","pages/44.png","pages/45.png",
  "pages/46.png"
]);

/* Videolu sayfalar */
const videoMap = {
  1:  "videos/v01.mp4",
  5:  "videos/v5.mp4",
  17: "videos/v17.mp4",
  22: "videos/v22.mp4",
  24: "videos/v24.mp4",
  26: "videos/v26.mp4",
  41: "videos/v41.mp4"
};

let started = false;

/* Aktif sayfa */
function getActivePage() {
  return (
    bookContainer.querySelector(".stf__item.--right") ||
    bookContainer.querySelector(".stf__item.--left")
  );
}

/* Videoyu sayfanın içine taşı */
function moveVideoToPage(pageNo) {
  const page = getActivePage();
  const src = videoMap[pageNo];
  if (!page || !src) {
    video.style.display = "none";
    return;
  }

  page.style.position = "relative";

  video.src = src;
  video.style.display = "block";
  video.style.position = "absolute";
  video.style.inset = "0";
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "cover";
  video.style.pointerEvents = "none";

  page.appendChild(video);
}

/* 🔴 TEK VE GERÇEK USER GESTURE */
document.addEventListener("click", () => {
  if (started) return;
  started = true;

  video.muted = true;
  video.loop = true;

  const pageNo = pageFlip.getCurrentPageIndex() + 1;
  moveVideoToPage(pageNo);

  video.play(); // 🔴 GARANTİLİ
}, { once: true });

/* Sayfa değişince SADECE TAŞI */
pageFlip.on("flip", (e) => {
  if (!started) return;

  const pageNo = e.data + 1;
  setTimeout(() => moveVideoToPage(pageNo), 150);
});
