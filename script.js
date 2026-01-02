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
  "pages/1.jpg","pages/2.jpg","pages/3.jpg","pages/4.jpg","pages/5.jpg",
  "pages/6.jpg","pages/7.jpg","pages/8.jpg","pages/9.jpg","pages/10.jpg",
  "pages/11.jpg","pages/12.jpg","pages/13.jpg","pages/14.jpg","pages/15.jpg",
  "pages/16.jpg","pages/17.jpg","pages/18.jpg","pages/19.jpg","pages/20.jpg",
  "pages/21.jpg","pages/22.jpg","pages/23.jpg","pages/24.jpg","pages/25.jpg",
  "pages/26.jpg","pages/27.jpg","pages/28.jpg","pages/29.jpg","pages/30.jpg",
  "pages/31.jpg","pages/32.jpg","pages/33.jpg","pages/34.jpg","pages/35.jpg",
  "pages/36.jpg","pages/37.jpg","pages/38.jpg","pages/39.jpg","pages/40.jpg",
  "pages/41.jpg","pages/42.jpg","pages/43.jpg","pages/44.jpg","pages/45.jpg",
  "pages/46.jpg"
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
