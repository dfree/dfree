/* eslint-disable no-undef */
/* Shapes */
var svgContainer = document.getElementById('svgContainer');

/* const animation = bodymovin.loadAnimation({
  wrapper: svgContainer,
  renderer: 'svg', // Render format ('svg', 'canvas', 'html')
  loop: false, // Do not loop the animation
  autoplay: false, // Do not start playing the animation automatically
  path: 'path/to/your/lottie/file.json' // Path to your Lottie JSON file
}); */

var animItem = bodymovin.loadAnimation({
  wrapper: svgContainer,
  animType: 'svg',
  loop: false,
  autoplay: false,
  path: 'https://labs.nearpod.com/bodymovin/demo/markus/isometric/markus2.json'
});

const onMouseMove = (event) => {
  const rect = document.body.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const percentage = mouseX / rect.width; 

  const frame = percentage * animItem.totalFrames;
  animItem.goToAndStop(frame, true);
}

const onTouchMove = (event) => {
  if (event.touches.length >= 1) {
    onMouseMove(event.touches[0]);
  }
}

document.addEventListener('mousemove', onMouseMove);
document.addEventListener("touchmove", onTouchMove);