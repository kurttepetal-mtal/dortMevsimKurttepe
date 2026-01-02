const book = document.getElementById("book");

const pageFlip = new St.PageFlip(book, {
  width: 450,
  height: 650,
  showCover: true
});

/* ===============================
   SAYFA DİZİSİ
   VIDEO = MP4
   RESİM = JPG
================================ */

pageFlip.loadFromImages([
  "videolar/v01.mp4",   // 1
  "sayfalar/2.jpg",     // 2
  "sayfalar/3.jpg",     // 3
  "sayfalar/4.jpg",     // 4
  "videolar/v05.mp4",   // 5
  "sayfalar/6.jpg",
  "sayfalar/7.jpg",
  "sayfalar/8.jpg",
  "sayfalar/9.jpg",
  "sayfalar/10.jpg",
  "sayfalar/11.jpg",
  "sayfalar/12.jpg",
  "sayfalar/13.jpg",
  "sayfalar/14.jpg",
  "sayfalar/15.jpg",
  "sayfalar/16.jpg",
  "videolar/v17.mp4",   // 17
  "sayfalar/18.jpg",
  "sayfalar/19.jpg",
  "sayfalar/20.jpg",
  "sayfalar/21.jpg",
  "videolar/v22.mp4",   // 22
  "sayfalar/23.jpg",
  "videolar/v24.mp4",   // 24
  "sayfalar/25.jpg",
  "videolar/v26.mp4",   // 26
  "sayfalar/27.jpg",
  "sayfalar/28.jpg",
  "sayfalar/29.jpg",
  "sayfalar/30.jpg",
  "sayfalar/31.jpg",
  "sayfalar/32.jpg",
  "sayfalar/33.jpg",
  "sayfalar/34.jpg",
  "sayfalar/35.jpg",
  "sayfalar/36.jpg",
  "sayfalar/37.jpg",
  "sayfalar/38.jpg",
  "sayfalar/39.jpg",
  "sayfalar/40.jpg",
  "videolar/v41.mp4",   // 41
  "sayfalar/42.jpg",
  "sayfalar/43.jpg",
  "sayfalar/44.jpg",
  "sayfalar/45.jpg",
  "sayfalar/46.jpg"
]);
