// capital W and H always representing the actual screen size
var W = 0;
var H = 0;

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

// all sizes measured by placing the books on the original text image
var books = [
  {
    startDelay: 0.2,
    depth: 0.2,
    originX: 674, // center of the book
    originY: 289, // center of the book
    originWidth: 109,
    originHeight: 151,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    src: "img/book_1.jpg",
    img: null, // the actual loaded image
    speedX: 0.1,
    speedY: 0.05,
    shadow: null,
    moveX: 0,
    moveY: 0,
  },
  {
    startDelay: 0.4,
    depth: 0.8,
    originX: 163, // center of the book
    originY: 419, // center of the book
    originWidth: 145,
    originHeight: 188,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    src: "img/book_2.jpg",
    img: null, // the actual loaded image
    speedX: 0.1,
    speedY: -0.05,
    shadow: null,
    moveX: 0,
    moveY: 0,
  },
];

/*

  INITIALIZATION

*/

function initBeforeLoad() {
  books.sort(function (a, b) {
    if (a.depth < b.depth) return -1;
    if (a.depth > b.depth) return 1;
    return 0;
  });

  for (var i = 0; i < books.length; i++) {
    var book = books[i];
    book.img = new Image();
    book.img.style.opacity = 0;
    book.img.src = book.src;
    book.shadow = new Image();
    book.shadow.src = shadowSrc;
    book.shadow.style.opacity = 0;
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
    initBooks();
    resize();
    //printer.style = 'position: absolute; top: 10px; left: 10px; font-size: 20px;'
    document.body.appendChild(printer);
    printer.innerHTML = "0 : 0 : 0";

    window.addEventListener("resize", resize);
    if (!isTouchDevice) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mouseleave", onMouseLeave);
    } else {
      document.addEventListener("click", touchEnd);
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
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      // Handle iOS 13+ devices.
      DeviceMotionEvent.requestPermission()
        .then((state) => {
          if (state === "granted") {
            window.addEventListener("devicemotion", handleOrientation);
          } else {
            console.error("Request to access the orientation was rejected");
          }
        })
        .catch(console.error);
    } else {
      // Handle regular non iOS 13+ devices.
      window.addEventListener("devicemotion", handleOrientation);
    }
  }
}
function handleOrientation(event) {
  printer.innerHTML = event.alpha + " : " + event.beta + " : " + event.gamma;
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
  /* if (!light) {
    light = { x: lightOrigin.x, y: lightOrigin.y };
  } */

  resizeBooks();

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
  //light = { x: e.screenX, y: e.screenY };
  //mousePos = { x: e.screenX, y: e.screenY };
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

  var baseFadeDelay = 0.4;

  for (var i = 0; i < books.length; i++) {
    var book = books[i];
    book.shadow.style.position = "absolute";
    bookContainer.appendChild(book.shadow);
    gsap.to(book.shadow, {
      duration: 1,
      opacity: (1 - book.depth) * 0.5,
      delay: baseFadeDelay + book.startDelay,
      ease: "power2.inOut",
    });

    book.img.style.position = "absolute";
    bookContainer.appendChild(book.img);
    gsap.to(book.img, {
      duration: 1,
      opacity: 1,
      delay: baseFadeDelay + book.startDelay,
      ease: "power2.inOut",
    });
  }

  tick();
  // moveBooks();
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
    //var bookCenterX = book.originX * scale + headerProjection.x;
    //var bookCenterY = book.originY * scale + headerProjection.y - (scrollY  * (1 + book.depth / 4));
    book.x = bookCenterX - book.width / 2;
    book.y = bookCenterY - book.height / 2;
    book.img.style.transform = "translate(" + book.x + "px, " + book.y + "px)";

    var lightDistance = {
      x: bookCenterX - light.x,
      y: bookCenterY - light.y,
    };

    var shadow = book.shadow;
    var shadowWidth = book.width * (1.05 + book.depth / 6);
    var shadowHeight = book.height * (1.05 + book.depth / 6);
    var shadowX =
      bookCenterX -
      shadowWidth / 2 +
      (lightDistance.x / W) * (headerProjection.width / 60) * multiplyBookDepth;
    var shadowY =
      bookCenterY -
      shadowHeight / 2 +
      (lightDistance.y / W) * (headerProjection.width / 60) * multiplyBookDepth;
    shadow.style.width = shadowWidth + "px";
    shadow.style.height = shadowHeight + "px";
    shadow.style.transform = "translate(" + shadowX + "px, " + shadowY + "px)";
  }
}

function resizeBooks() {
  var scale = headerProjection.width / headerTextDimensions.width;
  for (var i = 0; i < books.length; i++) {
    var book = books[i];
    book.width = book.originWidth * scale;
    book.height = book.originHeight * scale;
    book.img.style.width = book.width + "px";
    book.img.style.height = book.height + "px";
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
