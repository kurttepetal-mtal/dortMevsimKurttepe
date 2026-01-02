/* =====================================================
   FLIPBOOK + VIDEO (STABİL SON SÜRÜM)
===================================================== */

const book = document.getElementById("book");

/* -----------------------------------------------------
   1) SAYFA TANIMLARI (46 SAYFA – TAM)
----------------------------------------------------- */
const pages = [
  { type: "video", src: "videos/v01.mp4" }, // 1
  { type: "image", src: "pages/2.jpg" },
  { type: "image", src: "pages/3.jpg" },
  { type: "image", src: "pages/4.jpg" },

  { type: "video", src: "videos/v05.mp4" }, // 5
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

  { type: "video", src: "videos/v17.mp4" }, // 17
  { type: "image", src: "pages/18.jpg" },
  { type: "image", src: "pages/19.jpg" },
  { type: "image", src: "pages/20.jpg" },
  { type: "image", src: "pages/21.jpg" },

  { type: "video", src: "videos/v22.mp4" }, // 22
  { type: "image", src: "pages/23.jpg" },

  { type: "video", src: "videos/v24.mp4" }, // 24
  { type: "image", src: "pages/25.jpg" },

  { type: "video", src: "videos/v26.mp4" }, // 26
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

  { type: "video", src: "videos/v41.mp4" }, // 41
  { type: "image", src: "pages/42.jpg" },
  { type: "image", src: "pages/43.jpg" },
  { type: "image", src: "pages/44.jpg" },
  { type: "image", src: "pages/45.jpg" },
  { type: "image", src: "pages/46.jpg" }
];

/* -----------------------------------------------------
   2) SAYFALARI DOM’A EKLE
----------------------------------------------------- */
pages.forEach(p => {
  const page = document.createElement("div");
  page.className = "page";

  if (p.type === "image") {
    page.innerHTML = `
      <img src="${p.src}" class="media">
    `;
  } else {
    // Video: src BAŞTA YOK → geç yüklenecek
    page.innerHTML = `
      <video
        class="media video"
        data-src="${p.src}"
        muted
        playsinline
        controls>
      </video>
    `;
  }

  book.appendChild(page);
});

/* -----------------------------------------------------
   3) PAGEFLIP
----------------------------------------------------- */
const pageFlip = new St.PageFlip(book, {
  width: 450,
  height: 650,
  showCover: true,
  maxShadowOpacity: 0.3
});

pageFlip.loadFromHTML(document.querySelectorAll(".page"));

/* -----------------------------------------------------
   4) VIDEO KONTROL – SAYFA AKTİF OLUNCA
----------------------------------------------------- */
function stopAllVideos() {
  document.querySelectorAll("video").forEach(v => {
    v.pause();
    v.removeAttribute("src");
  });
}

function playActiveVideos() {
  document.querySelectorAll(".page.-active video").forEach(v => {
    const src = v.dataset.src;
    if (!src) return;

    v.src = src;
    v.load();
    v.play().catch(() => {
      // autoplay engellenirse kullanıcı play’e basar
    });
  });
}

/* -----------------------------------------------------
   5) SAYFA DEĞİŞİNCE
----------------------------------------------------- */
pageFlip.on("flip", () => {
  stopAllVideos();

  // Flip animasyonu bitsin diye kısa gecikme
  setTimeout(() => {
    playActiveVideos();
  }, 250);
});

/* -----------------------------------------------------
   6) İLK AÇILIŞTA (KAPAK VIDEO İSE)
----------------------------------------------------- */
window.addEventListener("load", () => {
  setTimeout(() => {
    playActiveVideos();
  }, 300);
});
