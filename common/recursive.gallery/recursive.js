class Recursive {
  constructor() {
    const isTouchScreen = "maxTouchPoints" in navigator && navigator.maxTouchPoints > 0;
    let touchPosition = {x: -100, y: -100};

    this.listeners = {};
    window.addEventListener("message", this.onMessage);
    if (isTouchScreen) {
      document.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
          const evt = e.touches[0];
          touchPosition = { x: evt.screenX, y: evt.screenY };
          this.dispatchMouseEvent("down", touchPosition);
        }
      });
      document.addEventListener("touchmove", (e) => {
        touchPosition = {x: -100, y: -100};
      });
      document.addEventListener("touchend", (e) => {
        this.dispatchMouseEvent("up", touchPosition);
      });
    } else {
      document.addEventListener("mousedown", (evt) => this.dispatchMouseEvent("down", { x: evt.screenX, y: evt.screenY }));
      document.addEventListener("mouseup", (evt) => this.dispatchMouseEvent("up", { x: evt.screenX, y: evt.screenY }));
    }

    this.handshake();
  }

  dispatchMouseEvent(type, position) {
    window.parent.postMessage({ mouse: type, position });
  }

  handshake() {
    window.parent.postMessage({ ready: true });
  }

  onMessage(e) {
    if (e.data === "stop" || e.data === "start") {
      document.dispatchEvent(new CustomEvent(e.data));
    }
  }
}

(() => {
  window.addEventListener("load", () => new Recursive());
})();
