class Recursive {
  constructor() {
    this.listeners = {};
    this.handshake();
    window.addEventListener("message", this.onMessage);
  }

  handshake() {
    window.parent.postMessage({ ready: true });
  }

  onMessage(e) {
    if (e.data === "stop" || e.data === "start") {
      document.dispatchEvent(new CustomEvent(e.data));
      console.log("DISPATCH", e.data);
    }
  }
}

(() => {
  window.addEventListener("load", () => new Recursive());
})();
