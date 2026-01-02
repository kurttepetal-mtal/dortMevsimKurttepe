const book = document.getElementById("book");

/* === SAYFALAR === */
const pages = [
  { type: "video", src: "videos/v01.mp4" },
  { type: "image", src: "pages/2.jpg" },
  { type: "image", src: "pages/3.jpg" },
  { type: "image", src: "pages/4.jpg" },

  { type: "video", src: "videos/v05.mp4" },
  { type: "image", src: "pages/6.jpg" },
  { type: "image", src: "pages/7.jpg" },

  { type: "video", src: "videos/v17.mp4" },
  { type: "image", src: "pages/18.jpg" },

  { type: "video", src: "videos/v22.mp4" },
  { type: "image", src: "pages/23.jpg" },

  { type: "video", src: "videos/v24.mp4" },
  { type: "image", src: "pages/25.jpg" },

  { type: "video", src: "videos/v26.mp4" },
  { type: "image", src: "pages/27.jpg" },

  { type: "video", src: "videos/v41.mp4" },
  { type: "image", src: "pages/42.jpg" }
];

/* === DOM’A EKLE === */
pages.forEach(p => {
  const page = document.createElement("div");
  page.className = "page";

  const wrapper = document.createElement("div");
  wrapper.className = "media-wrapper";

  if (p.type === "image") {
    const img = document.createElement("img");
    img.src = p.src;
    wrapper.appendChild(img);
  } else {
    const video = document.createElement("video");
    video.src = p.src;
    video.controls = true;
    video.muted = true;          // GitHub Pages şart
    video.playsInline = true;
    video.preload = "metadata"; // HIZLI
    wrapper.appendChild(video);
  }

  page.appendChild(wrapper);
  book.appendChild(page);
});

/* === FLIPBOOK === */
const pageFlip = new St.PageFlip(book, {
  width: 450,
  height: 650,
  showCover: true,
  maxShadowOpacity: 0.3
});

pageFlip.loadFromHTML(document.querySelectorAll(".page"));

/* === SAYFA DEĞİŞİNCE VİDEO KONTROL === */
pageFlip.on("flip", () => {
  document.querySelectorAll("video").forEach(v => v.pause());
});
