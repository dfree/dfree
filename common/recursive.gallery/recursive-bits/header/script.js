const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const colors = [
  //[0, 90, 50]
  [0, 152, 87],
  /* [26, 188, 156], // Turquoise
  [46, 204, 113], // Emerald
  [52, 152, 219], // Peter River
  [155, 89, 182], // Amethyst
  [52, 73, 94], // Wet Asphalt
  [22, 160, 133], // Green Sea
  [39, 174, 96], // Nephritis
  [41, 128, 185], // Belize Hole
  [142, 68, 173], // Wisteria
  [44, 62, 80], // Midnight Blue
  [241, 196, 15], // Sun Flower
  [230, 126, 34], // Carrot
  [231, 76, 60], // Alizarin
  [236, 240, 241], // Clouds
  [243, 156, 18], // Orange
  [211, 84, 0], // Pumpkin
  [192, 57, 43], // Pomegranate
  [254, 174, 188], */
];

let rects /* : {
  x: number;
  y: number;
  delay: number;
  duration: number;
  c: [number, number, number, number];
  row: number;
  col: number;
}[] */ = [];
let SIZE = 0;
let SPACE = 0;
let width = 0;
let height = 0;
let columns = 0;
let rows = 0;
let mouseX = -1;
let mouseY = -1;
let smoothMouseX = 0;
let smoothMouseY = 0;
let img;
let tID = 0;
let mID = 0;
let then = performance.now() * -20;

const opacity = 25;

function animate(now) {
  requestAnimationFrame(animate);

  const diff = now - then;
  then = now - diff;

  const data = img.data;

  if (mouseX !== -1) {
    smoothMouseX += (mouseX - smoothMouseX) * 0.15;
    smoothMouseY += (mouseY - smoothMouseY) * 0.15;
  }

  if (paused) return;

  const dd = Math.min(Math.max(Math.hypot(smoothMouseX - mouseX, smoothMouseY - mouseY) * 0.3, opacity), 140);

  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    const time = r.duration + r.delay;
    const delta = diff % time;
    const finished = delta > time && Math.random() < 0.6;

    const c = r.c;

    if (!finished && c[0] !== 0) {
      c[3] -= c[3] * 0.01;
    }

    if (c[3] <= 50) {
      c[0] = 0;
      c[1] = 0;
      c[2] = 0;
      c[3] = delta > r.delay ? 50 : opacity;
    }

    //if (mouseX != -1 && c[0] === 0 && Math.random() > 0.4) {
    if (mouseX != -1) {
      const d = Math.hypot(smoothMouseX - r.x, smoothMouseY - r.y) - 38;
      //if (d < dd * Math.random()) {
      if (d < dd * Math.random()) {
        const newC = colors[Math.floor(Math.random() * colors.length)];
        c[0] = newC[0];
        c[1] = newC[1];
        c[2] = newC[2];
        c[3] = 180;
      }
    }

    for (let j = 0; j <= SIZE; j++) {
      for (let k = 0; k <= SIZE; k++) {
        const n = (r.x + j + (r.y + k + j) * width) * 4;
        // const n = ((r.x + j + (r.y + k) * width) * 8) + 4;
        data[n] = c[0];
        data[n + 1] = c[1];
        data[n + 2] = c[2];
        data[n + 3] = c[3];
      }
    }
  }

  ctx.putImageData(img, 0, 0);
}

window.addEventListener(
  "mousemove",
  (e) => {
    mID && cancelManualMove();

    onMouseMove(e);

    smoothMouseX = mouseX;
    smoothMouseY = mouseY;

    mID && cancelAnimationFrame(mID);

    window.addEventListener("mousemove", onMouseMove);
  },
  { once: true }
);

canvas.addEventListener("touchstart", (e) => {
  mID && cancelManualMove();

  e.preventDefault();

  onMouseMove(e.touches[0]);

  smoothMouseX = mouseX;
  smoothMouseY = mouseY;
});

window.addEventListener("touchmove", (e) => onMouseMove(e.touches[0]));

function onResize() {
  rects = [];
  width = window.innerWidth;
  height = window.innerHeight;

  if (width < 768) {
    SIZE = 2;
    SPACE = 2;
  } else {
    SIZE = 2;
    SPACE = 2;
  }

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = "#fff";

  columns = Math.ceil(width / SIZE / SPACE);
  rows = Math.ceil(height / SIZE / SPACE);

  for (let i = 0; i < columns * rows; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);

    rects.push({
      x: col * SPACE * SIZE,
      y: row * SPACE * SIZE,
      delay: Math.random() * 15000,
      duration: Math.random() * 5000 + 1000,
      c: [0, 0, 0, 30],
      row,
      col,
    });
  }

  img = ctx.createImageData(width, height);
}

function onMouseMove(e) {
  clearTimeout(tID);

  mouseX = e.pageX;
  mouseY = e.pageY;

  tID = setTimeout(() => {
    mouseX = -1;
    mouseY = -1;
  }, 350);
}

function manualMouseMove(t) {
  mID = requestAnimationFrame(manualMouseMove);

  t *= 0.001;

  mouseX = width * 0.5 + Math.cos(t * 2.1) * Math.cos(t * 0.8) * width * 0.5;
  mouseY = height * 0.5 + Math.sin(t * 3.1) * Math.tan(Math.sin(t * 0.8)) * height * 0.5;
}

function cancelManualMove() {
  cancelAnimationFrame(mID);
  mID = 0;
}

window.addEventListener("load", () => {
  document.querySelector(".screen").append(canvas);
});

addEventListener("resize", onResize);

let paused = true;
document.addEventListener("start", () => {
  paused = false;
});
document.addEventListener("stop", () => {
  paused = true;
});

onResize();
requestAnimationFrame(animate);
