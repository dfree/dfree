(function ($) {
  var white = "#FFFFFF";
  var black = "#000000";

  var brushVariationNum = 20;
  var maxCharLength = 10;

  function getDigitalCharacterLine(length) {
    var chars = "";
    for (var i = 0; i < length; i++) {
      chars += Math.random() < 0.5 ? "1" : "0";
    }
    return chars;
  }
  function getBrush(id, width, height, num, fontSize) {
    var brushCanvas = $.create(
      id,
      "",
      { width: width, height: height },
      "canvas"
    );
    var brushCtx = brushCanvas.getContext("2d");

    brushCtx.fillStyle = black;
    brushCtx.font = fontSize + "px Inconsolata";
    //brushCtx.fillText("10010100101001001010010001010", 0, 20);
    for (var i = 0; i < num; i++) {
      var charLength = Math.round($.random(6, maxCharLength));
      brushCtx.fillText(
        getDigitalCharacterLine(charLength),
        Math.random() * (width - (fontSize / 2) * charLength),
        Math.random() * (height - fontSize) + fontSize
      );
    }

    return brushCanvas;
  }

  var brushes = [];
  function generateBrushes(renderSize) {
    /* var largeBrushes = []; */
    brushes = [];
    var maxBrushSize = {
      min: {
        width: renderSize.width / 2,
        height: renderSize.height / 8,
      },
      max: {
        width: renderSize.width / 4,
        height: renderSize.height / 5,
      },
    };

    // large brushes
    for (var i = 0; i < brushVariationNum; i++) {
      var width = $.random(maxBrushSize.min.width, maxBrushSize.max.width);
      var height = $.random(maxBrushSize.min.height, maxBrushSize.max.height);
      brush = getBrush(
        "large-brush-" + i,
        width,
        height,
        2,
        renderSize.height / 13
      );
      brushes.push({
        width: width,
        height: height,
        brush: brush,
      });
    }
  }

  /*

    On load

    */

  window.onload = function () {
    var init;

    var W;
    var H;

    var maxSize = {
      width: 1236,
      height: 540,
    };

    var isMouseDown = false;
    var mousePos = null; // the value {x:0, y:0} got picked up by tick() and got reset after each draw

    var canvasBg = $.id("canvas_bg");
    var ctxBg = canvasBg.getContext("2d");
    var canvasMiddle = $.id("canvas_middle");
    var ctxMiddle = canvasMiddle.getContext("2d");
    var canvasFront = $.id("canvas_front");
    var ctxFront = canvasFront.getContext("2d");

    var bgImg = $.id("bg");
    var frontImg = $.id("front");
    var message = $.id("message");
    var main = $.id("main");
    var button = $.id("button");

    var resizeTimeout = 0;
    init = function () {
      TweenPlugin.activate([CSSPlugin]);
      main.style.display = "block";
      $.delay(0.2, function () {
        button.style.display = "block";
        message.style.display = "block";
      });
      reset();
      resize();
      canvasFront.addEventListener("touchstart", handleDragStart, false);
      canvasFront.addEventListener("mousedown", handleDragStart, false);
      document.addEventListener("touchend", handleDragEnd, false);
      document.addEventListener("mouseup", handleDragEnd, false);
      document.addEventListener("touchmove", handleDragMove, false);
      document.addEventListener("mousemove", handleDragMove, false); /*  */
      window.addEventListener("resize", resize, false);
      button.addEventListener("click", restart, false);

      tick();
      startCamera();
    };

    function reset() {
      var all = $.id("main").getElementsByTagName("img");
      for (var i = 0; i < all.length; i++) {
        all[i].style.display = "none";
      }
    }

    function resize() {
      W = document.documentElement.clientWidth;
      H = document.documentElement.clientHeight;
      $.set("body", { width: W, height: H });
      canvasBg.width = W;
      canvasBg.height = H;
      canvasMiddle.width = W;
      canvasMiddle.height = H;
      canvasFront.width = W;
      canvasFront.height = H;
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(start, 60);
    }
    var imgWidth;
    var imgHeight;
    var x;
    var y;
    function start() {
      var scale = 0.8;
      imgWidth = Math.round(Math.min(maxSize.width, W * scale));
      imgHeight = (imgWidth / maxSize.width) * maxSize.height;
      x = W / 2 - imgWidth / 2;
      y = H / 2 - imgHeight / 2;

      camcorder.style =
        "left: " +
        x +
        "px; top:" +
        y +
        "px; width:" +
        imgWidth +
        "px; height: " +
        imgHeight +
        "px;";

      ctxBg.drawImage(bgImg, x, y, imgWidth, imgHeight);
      drawDollar();
      generateBrushes({ width: imgWidth, height: imgHeight });

      message.style.fontSize = imgHeight * 0.1 + "px";
      message.style.bottom = imgHeight * 0.08 + "px";
      console.log("ms", message);
    }

    var turning = false;
    function restart() {
      if (!turning) {
        turning = true;
        $.tween("main", 0.8, { rotationY: 90, ease: Power2.easeIn });
        $.delay(0.8, function () {
          drawDollar();
          $.set("main", { rotationY: 270 });
          $.tween("main", 0.8, {
            rotationY: 360,
            ease: Power2.easeOut,
            onComplete: function () {
              $.set("main", { rotationY: 0 });
              turning = false;
            },
          });
        });
      }
    }

    function drawDollar() {
      ctxMiddle.globalCompositeOperation = "source-over";
      ctxMiddle.drawImage(frontImg, x, y, imgWidth, imgHeight);
      ctxMiddle.globalCompositeOperation = "destination-out";
    }

    function handleDragStart(e) {
      const eventTarget = e.touches ? e.touches[0] : e;
      isMouseDown = true;
      mousePos = { x: eventTarget.pageX, y: eventTarget.pageY };
    }
    function handleDragMove(e) {
      if (isMouseDown) {
        const eventTarget = e.touches ? e.touches[0] : e;
        mousePos = { x: eventTarget.pageX, y: eventTarget.pageY };
      }
    }
    function handleDragEnd() {
      isMouseDown = false;
    }

    function tick() {
      if (mousePos) {
        var brush = brushes[Math.floor(Math.random() * brushes.length)];
        ctxMiddle.drawImage(
          brush.brush,
          mousePos.x - brush.width * 0.4,
          mousePos.y - brush.height / 2
        );

        mousePos = null;
      }
      window.requestAnimationFrame(tick);
    }
    /* function drawElement(id, reset, isVisible) {
            var item = elements[id];
            var ctx = item.ctx;
            var maskCtx = item.maskCtx;
            var bounds = item.bounds;
            ctx.clearRect(0, 0, bounds.width, bounds.height);
            if (reset) {
              if (isVisible) {
                maskCtx.fillStyle = black;
                maskCtx.beginPath();
                maskCtx.rect(0, 0, bounds.width, bounds.height);
                maskCtx.fill();
              } else {
                maskCtx.clearRect(0, 0, bounds.width, bounds.height);
              }
            }
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(item.img, -bounds.x, -bounds.y);
      
            ctx.globalCompositeOperation = "destination-in";
            if (endFill.opacity) {
              maskCtx.globalAlpha = endFill.opacity;
              maskCtx.fillStyle = black;
              maskCtx.beginPath();
              maskCtx.rect(0, 0, bounds.width, bounds.height);
              maskCtx.fill();
            }
            ctx.drawImage(item.mask, 0, 0);
          } */
    const video = $.id("camera");
    const camcorder = $.id("camcorder");

    function startCamera() {
      /* const constraints = {
        video: {
          width: {
            min: 1280,
            ideal: 1920,
            max: 2560,
          },
          height: {
            min: 720,
            ideal: 1080,
            max: 1440,
          },
          facingMode: "user",
        },
      }; */
      var constraints = { video: { facingMode: "user" }, audio: false };
      startStream(constraints);
    }
    const startStream = async (constraints) => {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
          track = stream.getTracks()[0];
          video.srcObject = stream;
        })
        .catch(function (error) {
          console.error("Oops. Something is broken.", error);
        });
      /* const stream = await navigator.mediaDevices.getUserMedia(constraints);
      handleStream(stream); */
    };
    const handleStream = (stream) => {
      video.srcObject = stream;
    };
    init();
  };
})({
  id: function (name) {
    return document.getElementById(name);
  },
  delay: function (time, func, props) {
    var prp = props || [];
    TweenLite.delayedCall(time, func, prp);
  },
  from: function (name, time, props) {
    return TweenLite.from(
      typeof name === "string" ? this.id(name) : name,
      time,
      props
    );
  },
  tween: function (name, time, props) {
    return TweenLite.to(
      typeof name === "string" ? this.id(name) : name,
      time,
      props
    );
  },
  set: function (name, props) {
    return TweenLite.set(
      typeof name === "string" ? this.id(name) : name,
      props
    );
  },
  create: function (name, parent, props, src) {
    var elem = document.createElement(
      src === "canvas" ? "canvas" : src ? "img" : "div"
    );

    if (src === "canvas") {
      if (props.width) {
        elem.width = props.width;
      }
      if (props.height) {
        elem.height = props.height;
      }
    }
    if (src) {
      elem.src = src;
    }
    elem.id = name;
    if (parent) {
      this.id(parent).appendChild(elem);
    }
    props = props || {};
    var newProps = {};
    Object.keys(props).forEach(function (key) {
      newProps[key] = props[key];
    });
    this.set(elem, newProps);
    return elem;
  },
  kill: function (name) {
    return TweenLite.killTweensOf(
      typeof name === "string" ? this.id(name) : name
    );
  },
  random: function (a, b) {
    return Math.random() * (b - a) + a;
  },
});
