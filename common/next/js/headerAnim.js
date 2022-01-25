// capital W and H always representing the actual screen size
var W = 0;
var H = 0;

var documentLoaded = false;
var booksLoaded = false;

// if letItDraw is true, it initiates a drawing sequence in tick()
var letItDraw = false;
var isTouchDevice = "ontouchstart" in window;
var headerContainer; // <div/> html element
var headerText; // <img/> html element
var headerTextDimensions = { width: 0, height: 0 };
var headerProjection = { x: 0, y: 0, width: 0, height: 0 };
var headerContainerBounds = { x: 0, y: 0, width: 0, height: 0 };
var lightOrigin = { x: 0, y: 0 };
var light = null; // set on init
var lightTween = null;
var mousePos = null;
var activeBook = -1;

var cursor = { x: 0, y: 0 };
var prevCursor = null;

var mouseTween = null;
var DIRECTION = {
  LEFT: "left",
  RIGHT: "right",
};
var shadowSrc = "img/shadow.png";

//debug
var printer = document.createElement("div");

var imagesLoaded = 0;
var bookPrototype = {
  src: "img/book_1.jpg", // relative path to the book's image file 
  startDelay: 0, // fade in delay
  depth: 0, // book's virtual 3D distance from the page (0 - 0.8), ideally all books have different depths
  originX: 0, // x center of the book
  originY: 0, // y center of the book
  originWidth: 0, // book width relative to the original background image size
  originHeight: 0, // book height relative to the original background image size
  x: 0, // book's rendered x top-left corner position
  y: 0, // book's rendered y top-left corner position
  width: 0, // book's rendered width
  height: 0, // book's rendered height
  img: null, // the actual loaded image
  shadow: null, // shadow image
  moveX: 0, // added drag position x
  moveY: 0, // added drag position y
  canvas: null, // book image rendered on a canvas in actual size
  ctx: null, // book canvas context
  shadowCanvas: null, // shadow image rendered on a canvas in actual size
  shadowCtx: null, // shadow canvas context
  shadowX: 0, // shadows's rendered x top-left corner position
  shadowY: 0, // shadows's rendered y top-left corner position
  shadowWidth: 0, // shadows's rendered width
  shadowHeight: 0, // shadows's rendered height
  offScreen: false, // if true, the book is not rendered anymore
};
// all sizes measured by placing the books on the original text image
var bookSetup = [
  {
    src: "img/book_0.png",
    startDelay: 0.8,
    depth: 0.8,
    originX: -171,
    originY: 141,
    originWidth: 185,
    originHeight: 230,
  },
  {
    src: "img/book_1.png",
    startDelay: 0.6,
    depth: 0.6,
    originX: -73,
    originY: 527,
    originWidth: 191,
    originHeight: 227,
  },
  {
    src: "img/book_2.png",
    startDelay: 0.3,
    depth: 0.3,
    originX: 233,
    originY: 375,
    originWidth: 168,
    originHeight: 227,
  },
  {
    src: "img/book_3.png",
    startDelay: 0.5,
    depth: 0.4,
    originX: 562,
    originY: 14,
    originWidth: 160,
    originHeight: 216,
  },
  {
    src: "img/book_4.png",
    startDelay: 0.2,
    depth: 0.7,
    originX: 558,
    originY: 440,
    originWidth: 181,
    originHeight: 254,
  },
  {
    src: "img/book_5.png",
    startDelay: 0.6,
    depth: 0.2,
    originX: 828,
    originY: 579,
    originWidth: 152,
    originHeight: 230,
  },
  {
    src: "img/book_6.png",
    startDelay: 0.9,
    depth: 0.82,
    originX: 1038,
    originY: 232,
    originWidth: 241,
    originHeight: 315,
  },
];

var books = [];

/*

  INITIALIZATION

*/

function initBeforeLoad() {
  bookSetup.sort(function (a, b) {
    if (a.depth < b.depth) return -1;
    if (a.depth > b.depth) return 1;
    return 0;
  });
  for (var i = 0; i < bookSetup.length; i++) {
    var newBook = Object.assign({}, bookPrototype);
    Object.keys(bookSetup[i]).forEach(function(key){
      newBook[key] = bookSetup[i][key];
    });
    books.push(newBook);
  }

  for (var i = 0; i < books.length; i++) {
    var book = books[i];
    book.img = new Image();
    book.img.onload = function () {
      imagesLoaded++;
      if (imagesLoaded == books.length) {
        booksLoaded = true;
        console.log("books loaded");
        if (documentLoaded) {
          startBooks();
        }
      }
    };
    book.img.src = book.src;
    book.shadow = new Image();
    book.shadow.src = shadowSrc;
    book.canvas = document.createElement("canvas");
    book.canvas.style.opacity = 0;
    book.canvas.imageSmoothingEnabled = true;
    book.ctx = book.canvas.getContext("2d");
    book.shadowCanvas = document.createElement("canvas");
    book.shadowCanvas.style.opacity = 0;
    book.shadowCtx = book.shadowCanvas.getContext("2d");
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
    resize();
    initBooks();
    printer.style = "position: fixed; top: 10px; left: 10px; font-size: 20px;";
    // document.body.appendChild(printer);
    printer.innerHTML = "0 : 0 : 0";

    window.addEventListener("resize", resize);
    if (!isTouchDevice) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mouseleave", onMouseLeave);
    } else {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        document.addEventListener("click", touchEnd);
      }
      window.addEventListener("deviceorientation", handleOrientation);

      printer.innerHTML = "0 : 0 : 0 : added";
    }
    document.body.addEventListener("touchend", touchEnd);
    document.addEventListener("scroll", function () {
      requestAnimationFrame(renderBooks);
    });
    headerContainer.style.opacity = 1;
  }
}

var gyroEventAdded = false;
function touchEnd() {
  if (!gyroEventAdded) {
    gyroEventAdded = true;
    printer.innerHTML = "0 : 0 : 0 : cool";
    DeviceOrientationEvent.requestPermission()
      .then((permissionState) => {
        if (permissionState === "granted") {
          //window.removeEventListener("deviceorientation", handleOrientation);
          //window.addEventListener("deviceorientation", handleOrientation);
        }
      })
      .catch(console.error);
  }
}
function handleOrientation(event) {
  gyroEventAdded = true;
  printer.innerHTML =
    "gyroscope <br/>x: " +
    Math.round(event.gamma) +
    "<br/>y: " +
    Math.round(event.beta) +
    "<br/>alpha:" +
    Math.round(event.alpha);
  if (
    event.gamma > -90 &&
    event.gamma < 90 &&
    event.beta < 70 &&
    event.beta > -70
  ) {
    mousePos = {
      x: ((event.gamma + 90) / 180) * W,
      y: ((event.beta + 90) / 180) * H,
    };
  }
  letItDraw = true;
}

window.addEventListener("load", initOnLoad);

function resize() {
  W = window.innerWidth;
  H = window.innerHeight;
  mousePos = { x: W / 2, y: H / 2 };
  headerContainerBounds = headerContainer.getBoundingClientRect();
  headerContainerBounds.x += window.scrollX;
  headerContainerBounds.y += window.scrollY;
  console.log(headerContainerBounds.y);
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

  lightOrigin = { x: W / 2, y: H / 2 };
  light = { x: lightOrigin.x, y: lightOrigin.y };

  if (documentLoaded && booksLoaded) {
    resizeBooks();
  }

  frameSkipper = false;
  letItDraw = true;
}

function isBookUnderMouse(mouse, book) {
  if (
    mouse.x > book.x &&
    mouse.x < book.x + book.width &&
    mouse.y > book.y &&
    mouse.y < book.y + book.height
  ) {
    return true;
  }
  return false;
}
function onMouseDown(e) {
  var mouse = { x: e.pageX, y: e.pageY };
  for (var i = 0; i < books.length; i++) {
    var book = books[i];
    if (isBookUnderMouse(mouse, book)) {
      activeBook = i;
    }
  }
}
function onMouseUp(e) {
  activeBook = -1;
}

function onMouseLeave(e) {
  activeBook = -1;
  prevCursor = null;
  onMouseMove({ pageX: W / 2, pageY: H / 2, screenX: W / 2, screenY: H / 2 });
}

function onMouseMove(e) {
  if (!prevCursor) {
    prevCursor = { x: e.pageX, y: e.pageY };
  } else {
    prevCursor = cursor;
  }

  cursor = { x: e.pageX, y: e.pageY };

  if (mouseTween) {
    mouseTween.invalidate();
  }

  mouseTween = gsap.to(mousePos, {
    duration: 0.8,
    x: e.screenX,
    y: e.screenY,
    ease: "power1.out",
    onUpdate: function () {
      letItDraw = true;
    },
  });
  if (activeBook >= 0) {
    var book = books[activeBook];
    book.moveX += cursor.x - prevCursor.x;
    book.moveY += cursor.y - prevCursor.y;
  }
}

/*

  DRAWING

*/
// reduce framerate from 60fps to 30fps by skipping every second frame
var frameSkipper = false;
var bookContainer = null;

function initBooks() {
  bookContainer = document.createElement("div");
  bookContainer.style =
    "position: fixed; left: 0; top:0; pointer-events: none;";
  document.body.appendChild(bookContainer);
  documentLoaded = true;

  console.log("documentLoaded", booksLoaded);
  if (booksLoaded) {
    startBooks();
  }
}

function startBooks() {
  console.log("startBooks");
  resizeBooks();
  var baseFadeDelay = 0.4;
  for (var i = 0; i < books.length; i++) {
    var book = books[i];
    book.shadowCanvas.style.position = "absolute";
    bookContainer.appendChild(book.shadowCanvas);
    gsap.to(book.shadowCanvas, {
      duration: 1,
      opacity: 1,
      delay: baseFadeDelay + book.startDelay,
      ease: "power2.inOut",
    });

    book.canvas.style.position = "absolute";
    bookContainer.appendChild(book.canvas);
    gsap.to(book.canvas, {
      duration: 1,
      opacity: 1,
      delay: baseFadeDelay + book.startDelay,
      ease: "power2.inOut",
    });
  }
  tick();
}
function tick() {
  if (frameSkipper) {
    frameSkipper = false;
  } else {
    frameSkipper = true;
    if (letItDraw) {
      letItDraw = false;
      renderBooks();
    }
  }
  requestAnimationFrame(tick);
}

function isBookOnScreen(book) {
  var bookOff = false;
  var shadowOff = false;
  if (
    book.x + book.width < 0 ||
    book.y + book.height < 0 ||
    book.x > W ||
    book.y > H
  ) {
    bookOff = true;
  }
  if (
    book.shadowX + book.shadowWidth < 0 ||
    book.shadowY + book.shadowHeight < 0 ||
    book.shadowX > W ||
    book.shadowY > H
  ) {
    shadowOff = true;
  }
  if (bookOff && shadowOff) {
    return false;
  }
  return true;
}

function renderBooks() {
  var scale = headerProjection.width / headerTextDimensions.width;
  var scrollY = window.scrollY;
  for (var i = 0; i < books.length; i++) {
    var book = books[i];
    var mouseDistance = {
      x: book.originX * scale + headerProjection.x - mousePos.x,
      y: book.originY * scale + headerProjection.y - mousePos.y,
    };

    var multiplyBookDepth =
      (1 + book.depth) * (1 + book.depth) * (1 + book.depth);
    var bookCenterX =
      book.originX * scale +
      headerProjection.x +
      (mouseDistance.x / W) *
        (headerProjection.width / 60) *
        multiplyBookDepth *
        (1 + book.depth) +
      book.moveX;
    var bookCenterY =
      book.originY * scale +
      headerProjection.y +
      (mouseDistance.y / W) *
        (headerProjection.width / 60) *
        multiplyBookDepth *
        (1 + book.depth) -
      scrollY * (1 + book.depth / 2) +
      book.moveY;

    book.x = bookCenterX - book.width / 2;
    book.y = bookCenterY - book.height / 2;

    var lightDistance = {
      x: bookCenterX - light.x,
      y: bookCenterY - light.y,
    };

    book.shadowX =
      bookCenterX -
      book.shadowWidth / 2 +
      (lightDistance.x / W) * (headerProjection.width / 60) * multiplyBookDepth;
    book.shadowY =
      bookCenterY -
      book.shadowHeight / 2 +
      (lightDistance.y / W) * (headerProjection.width / 60) * multiplyBookDepth;

    if (isBookOnScreen(book)) {
      if (book.offScreen) {
        book.offScreen = false;
        book.canvas.style.visibility = "visible";
        book.shadowCanvas.style.visibility = "visible";
      }
      book.canvas.style.transform =
        "translate(" + book.x + "px, " + book.y + "px)";
      book.shadowCanvas.style.transform =
        "translate(" + book.shadowX + "px, " + book.shadowY + "px)";
    } else {
      if (!book.offScreen) {
        book.offScreen = true;
        book.canvas.style.visibility = "hidden";
        book.shadowCanvas.style.visibility = "hidden";
      }
    }
  }
}

function resizeBooks() {
  var scale = headerProjection.width / headerTextDimensions.width;
  for (var i = 0; i < books.length; i++) {
    var book = books[i];
    book.width = book.originWidth * scale;
    book.height = book.originHeight * scale;

    book.canvas.width = book.width * 2;
    book.canvas.height = book.height * 2;
    book.canvas.style.width = book.width + "px";
    book.canvas.style.height = book.height + "px";
    book.ctx.drawImage(book.img, 0, 0, book.width * 2, book.height * 2);

    book.shadowOpacity = (1 - book.depth) * 0.5;
    book.shadowWidth = book.width * (1.05 + book.depth / 6);
    book.shadowHeight = book.height * (1.05 + book.depth / 6);
    book.shadowCanvas.width = book.shadowWidth;
    book.shadowCanvas.height = book.shadowHeight;
    book.shadowCtx.globalAlpha = book.shadowOpacity;
    book.shadowCtx.drawImage(
      book.shadow,
      0,
      0,
      book.shadowWidth,
      book.shadowHeight
    );
  }
}
