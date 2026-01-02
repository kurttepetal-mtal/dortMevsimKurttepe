const bookElement = document.getElementById("book");

/* =========================================
   SAYFA TANIMLARI
   type: "image" | "video"
========================================= */
const pages = [
   { type: "video", src: "videos/v01.mp4" },
  { type: "image", src: "pages/2.jpg" },
  { type: "image", src: "pages/3.jpg" },
  { type: "image", src: "pages/4.jpg" },

  { type: "video", src: "videos/v05.mp4" },
  { type: "image", src: "pages/6.jpg" },
  { type: "image", src: "pages/7.jpg" },
  { type: "image", src: "pages/8.jpg" },
  { type: "image", src: "pages/9.jpg" },
  { type: "image", src: "pages/10.jpg" },
  { type: "image", src: "pages/11.jpg" },
  { type: "image", src: "pages/12.jpg" },
  { type: "image", src: "pages/13.jpg" },
  { type: "image", src: "pages/14.jpg" },
  { type: "image", src: "pages/15.jpg" },
  { type: "image", src: "pages/16.jpg" },

  { type: "video", src: "videos/v17.mp4" },
  { type: "image", src: "pages/18.jpg" },
  { type: "image", src: "pages/19.jpg" },
  { type: "image", src: "pages/20.jpg" },
  { type: "image", src: "pages/21.jpg" },

  { type: "video", src: "videos/v22.mp4" },
  { type: "image", src: "pages/23.jpg" },

  { type: "video", src: "videos/v24.mp4" },
  { type: "image", src: "pages/25.jpg" },

  { type: "video", src: "videos/v26.mp4" },
  { type: "image", src: "pages/27.jpg" },
  { type: "image", src: "pages/28.jpg" },
  { type: "image", src: "pages/29.jpg" },
  { type: "image", src: "pages/30.jpg" },
  { type: "image", src: "pages/31.jpg" },
  { type: "image", src: "pages/32.jpg" },
  { type: "image", src: "pages/33.jpg" },
  { type: "image", src: "pages/34.jpg" },
  { type: "image", src: "pages/35.jpg" },
  { type: "image", src: "pages/36.jpg" },
  { type: "image", src: "pages/37.jpg" },
  { type: "image", src: "pages/38.jpg" },
  { type: "image", src: "pages/39.jpg" },
  { type: "image", src: "pages/40.jpg" },

  { type: "video", src: "videos/v41.mp4" },
  { type: "image", src: "pages/42.jpg" },
  { type: "image", src: "pages/43.jpg" },
  { type: "image", src: "pages/44.jpg" },
  { type: "image", src: "pages/45.jpg" },
  { type: "image", src: "pages/46.jpg" }
];
/* =========================================
   HTML SAYFALARI OLUŞTUR
========================================= */
pages.forEach(p => {
  const page = document.createElement("div");
  page.className = "page";

  if (p.type === "image") {
    const img = document.createElement("img");
    img.src = p.src;
    page.appendChild(img);
  } else {
    const video = document.createElement("video");
    video.src = p.src;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.controls = true; // istersen kaldırabilirsin
    page.appendChild(video);
  }

  bookElement.appendChild(page);
});

/* =========================================
   FLIPBOOK
========================================= */
const pageFlip = new St.PageFlip(bookElement, {
  width: 450,
  height: 650,
  showCover: true
});

pageFlip.loadFromHTML(document.querySelectorAll(".page"));
