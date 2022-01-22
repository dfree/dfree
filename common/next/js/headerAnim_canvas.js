// capital W and H always representing the actual screen size
var W = 0;
var H = 0;

// if letItDraw is true, it initiates a drawing sequence in tick()
var letItDraw = false;

var headerContainer; // <div/> html element
var headerText; // <img/> html element
var headerTextDimensions = { width: 0, height: 0 };
var headerProjection = { x: 0, y: 0, width: 0, height: 0 };
var headerContainerBounds = { x: 0, y: 0, width: 0, height: 0 };
var lightOrigin = { x: 0, y: 0 };
var light = null; // set on init
var lightTween = null;
var DIRECTION = {
  LEFT: "left",
  RIGHT: "right",
};
// all sizes measured by placing the books on the original text image
var books = [
  {
    startDelay: 0.2,
    depth: 1.2,
    originX: 474, // center of the book
    originY: 289, // center of the book
    originWidth: 109,
    originHeight: 151,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    src: "img/book_1.jpg",
    img: null, // the actual loaded image
    loaded: false,
    speedX: 0.1,
    speedY: 0.05,
    canvas: null,
  },
];

/*

  INITIALIZATION

*/

function initBeforeLoad() {
  for (var i = 0; i < books.length; i++) {
    var book = books[i];
    book.img = new Image();
    book.img.src = book.src;
    book.img.onload = function () {
      book.loaded = true;
    };
  }
}
initBeforeLoad();

function initOnLoad() {
  headerContainer = document.getElementById("header-container");
  headerText = document.getElementById("header-text");

  // if we are missing headerContainer or headerText on the page, the script wont initialize
  if (headerContainer && headerText) {
    headerTextBounds = headerText.getBoundingClientRect();
    headerTextDimensions = {
      width: headerTextBounds.width,
      height: headerTextBounds.height,
    };
    initDraw();
    resize();
    window.addEventListener("resize", resize);
    headerContainer.style.opacity = 1;
  }
}
window.addEventListener("load", initOnLoad);

function resize() {
  W = window.innerWidth;
  H = window.innerHeight;
  headerContainerBounds = headerContainer.getBoundingClientRect();
  headerContainerBounds.x -= window.scrollX;
  headerContainerBounds.y -= window.scrollY;

  if (
    headerContainerBounds.width / headerContainerBounds.height <
    headerTextDimensions.width / headerTextDimensions.height
  ) {
    headerProjection = {
      width: headerContainerBounds.width,
      height:
        (headerContainerBounds.width / headerTextDimensions.width) *
        headerTextDimensions.height,
    };
  } else {
    headerProjection = {
      width:
        (headerContainerBounds.height / headerTextDimensions.height) *
        headerTextDimensions.width,
      height: headerContainerBounds.height,
    };
  }
  headerProjection.x =
    headerContainerBounds.x +
    (headerContainerBounds.width - headerProjection.width) / 2;

  headerProjection.y =
  headerContainerBounds.y +
  (headerContainerBounds.height - headerProjection.height) / 2;

  headerText.style.width = headerProjection.width + "px";
  headerText.style.height = headerProjection.height + "px";

  lightOrigin = { x: W / 2, y: H / 10 };
  if (!light) {
    light = { x: lightOrigin.x, y: lightOrigin.y };
    /* gsap.to(light, {
      duration: 1,
      y: lightOrigin.y,
      ease: 'power2.inOut',
      onUpdate: function () {
        console.log(light.y); //logs the value on each update.
      },
    }); */
  }

  requestAnimationFrame(resizeBooks);

  canvas.width = W;
  canvas.height = H;

  frameSkipper = false;
  letItDraw = true;
}

/*

  DRAWING

*/
// reduce framerate from 60fps to 30fps by skipping every second frame
var frameSkipper = false;
var canvas = null;
var ctx = null;

function initDraw() {
  canvas = document.createElement("canvas");
  canvas.style = "position: fixed; left: 0; top:0; pointer-events: none;";
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  tick();
  moveBooks();
}

function tick() {
  if (frameSkipper) {
    frameSkipper = false;
  } else {
    frameSkipper = true;
    if (letItDraw) {
      letItDraw = false;
      draw();
    }
  }
  requestAnimationFrame(tick);
}

function draw() {
  positionBooks();
  drawBooks();
}

function resizeBooks() {
  var scale = headerProjection.width / headerTextDimensions.width;
  for (var i = 0; i < books.length; i++) {
    var book = books[i];
    if(!book.canvas){
      book.canvas = document.createElement("canvas");
    }
    var bookCtx = book.canvas.getContext('2d');

    book.width = book.originWidth * scale;
    book.height = book.originHeight * scale;
    book.canvas.width = book.width;
    book.canvas.height = book.height;
    if (book.loaded) {
      bookCtx.clearRect(0, 0, book.width, book.height);
      bookCtx.drawImage(book.img, 0, 0, book.width, book.height);
    }
  }
}
function positionBooks() {
  var scale = headerProjection.width / headerTextDimensions.width;
  for (var i = 0; i < books.length; i++) {
    var book = books[i];
    book.x = book.originX * scale + headerProjection.x - book.width;
    book.y = book.originY * scale + headerProjection.y - book.height;
  }
}

function drawBooks() {
  ctx.clearRect(0, 0, W, H);
  for (var i = 0; i < books.length; i++) {
    var book = books[i];
    ctx.resetTransform();
    if (book.canvas) {
      ctx.drawImage(book.canvas, book.x, book.y, book.width, book.height);
    }
  }
}

function moveBooks() {
  for (var i = 0; i < books.length; i++) {
    var book = books[i];
    book.originX += book.speedX;
    book.originY += book.speedY;
  }
  letItDraw = true;
  requestAnimationFrame(moveBooks);
}

