const bookElement = document.getElementById("book");

/* =========================================
   SAYFA TANIMLARI
   type: "image" | "video"
========================================= */
const pages = [
  { type: "video", src: "videolar/v01.mp4" }, // 1
  { type: "image", src: "sayfalar/2.jpg" },
  { type: "image", src: "sayfalar/3.jpg" },
  { type: "image", src: "sayfalar/4.jpg" },
  { type: "video", src: "videolar/v05.mp4" }, // 5
  { type: "image", src: "sayfalar/6.jpg" },
  { type: "image", src: "sayfalar/7.jpg" },
  { type: "image", src: "sayfalar/8.jpg" },
  { type: "image", src: "sayfalar/9.jpg" },
  { type: "image", src: "sayfalar/10.jpg" },
  { type: "image", src: "sayfalar/11.jpg" },
  { type: "image", src: "sayfalar/12.jpg" },
  { type: "image", src: "sayfalar/13.jpg" },
  { type: "image", src: "sayfalar/14.jpg" },
  { type: "image", src: "sayfalar/15.jpg" },
  { type: "image", src: "sayfalar/16.jpg" },
  { type: "video", src: "videolar/v17.mp4" }, // 17
  { type: "image", src: "sayfalar/18.jpg" },
  { type: "image", src: "sayfalar/19.jpg" },
  { type: "image", src: "sayfalar/20.jpg" },
  { type: "image", src: "sayfalar/21.jpg" },
  { type: "video", src: "videolar/v22.mp4" }, // 22
  { type: "image", src: "sayfalar/23.jpg" },
  { type: "video", src: "videolar/v24.mp4" }, // 24
  { type: "image", src: "sayfalar/25.jpg" },
  { type: "video", src: "videolar/v26.mp4" }, // 26
  { type: "image", src: "sayfalar/27.jpg" },
  { type: "image", src: "sayfalar/28.jpg" },
  { type: "image", src: "sayfalar/29.jpg" },
  { type: "image", src: "sayfalar/30.jpg" },
  { type: "image", src: "sayfalar/31.jpg" },
  { type: "image", src: "sayfalar/32.jpg" },
  { type: "image", src: "sayfalar/33.jpg" },
  { type: "image", src: "sayfalar/34.jpg" },
  { type: "image", src: "sayfalar/35.jpg" },
  { type: "image", src: "sayfalar/36.jpg" },
  { type: "image", src: "sayfalar/37.jpg" },
  { type: "image", src: "sayfalar/38.jpg" },
  { type: "image", src: "sayfalar/39.jpg" },
  { type: "image", src: "sayfalar/40.jpg" },
  { type: "video", src: "videolar/v41.mp4" }, // 41
  { type: "image", src: "sayfalar/42.jpg" },
  { type: "image", src: "sayfalar/43.jpg" },
  { type: "image", src: "sayfalar/44.jpg" },
  { type: "image", src: "sayfalar/45.jpg" },
  { type: "image", src: "sayfalar/46.jpg" }
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
