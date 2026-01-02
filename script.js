const container = document.getElementById("book-container");

const pageFlip = new St.PageFlip(container, {
  width: 450,
  height: 650,
  showCover: true
});

pageFlip.loadFromImages([
  "sayfalar/1.jpg","sayfalar/2.jpg","sayfalar/3.jpg","sayfalar/4.jpg","sayfalar/5.jpg",
  "sayfalar/6.jpg","sayfalar/7.jpg","sayfalar/8.jpg","sayfalar/9.jpg","sayfalar/10.jpg",
  "sayfalar/11.jpg","sayfalar/12.jpg","sayfalar/13.jpg","sayfalar/14.jpg","sayfalar/15.jpg",
  "sayfalar/16.jpg","sayfalar/17.jpg","sayfalar/18.jpg","sayfalar/19.jpg","sayfalar/20.jpg",
  "sayfalar/21.jpg","sayfalar/22.jpg","sayfalar/23.jpg","sayfalar/24.jpg","sayfalar/25.jpg",
  "sayfalar/26.jpg","sayfalar/27.jpg","sayfalar/28.jpg","sayfalar/29.jpg","sayfalar/30.jpg",
  "sayfalar/31.jpg","sayfalar/32.jpg","sayfalar/33.jpg","sayfalar/34.jpg","sayfalar/35.jpg",
  "sayfalar/36.jpg","sayfalar/37.jpg","sayfalar/38.jpg","sayfalar/39.jpg","sayfalar/40.jpg",
  "sayfalar/41.jpg","sayfalar/42.jpg","sayfalar/43.jpg","sayfalar/44.jpg","sayfalar/45.jpg",
  "sayfalar/46.jpg"
]);

const videoPages = {
  1:  "videos/v01.mp4",
  5:  "videos/v5.mp4",
  17: "videos/v17.mp4",
  22: "videos/v22.mp4",
  24: "videos/v24.mp4",
  26: "videos/v26.mp4",
  41: "videos/v41.mp4"
};

const video = document.createElement("video");
video.muted = true;
video.autoplay = true;
video.loop = true;
video.playsInline = true;
video.style.width = "100%";
video.style.height = "100%";
video.style.objectFit = "cover";

pageFlip.on("flip", e => {
  const pageNo = e.data + 1;

  if (videoPages[pageNo]) {
    video.src = videoPages[pageNo];
    container.innerHTML = "";
    container.appendChild(video);
    video.play().catch(()=>{});
  }
});
