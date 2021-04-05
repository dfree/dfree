(function () {
  window.onload = function (e) {
    var W = 300;
    var H = 300;

    var root = document.documentElement;
    var body = document.getElementById("body");
    var logo = document.getElementById("logo");
    var mainMenu = document.getElementById("main-menu");
    var contentWrapper = document.getElementById("content-wrapper");
    var controlButton = document.getElementById("control-button");
    var controlButtonArrow = document.getElementById("control-button-arrow");
    var controlPanel = document.getElementById("control-panel");
    var controlPanelBg = document.getElementById("control-panel-bg");
    var interactions = document.getElementById("interactions");
    var menuCloseButton = document.getElementById("menu-close-button");
    var infoButton = document.getElementById("info-button");
    var iframeContainer = document.getElementById("iframe-container");
    var popup = document.getElementById("popup");
    var loader = document.getElementById("loader");
    var backButton = document.getElementById("back-button");
    var nextButton = document.getElementById("next-button");
    var count = document.getElementById("count");
    var artTitle = document.getElementById("art-title");
    var artDetails = document.getElementById("art-details");
    var leftArrow = document.getElementById("left-arrow");
    var rightArrow = document.getElementById("right-arrow");
    var fullscreenButton = document.getElementById("fullscreen-button");

    var display = document.getElementById("display");
    var displaySetup = {
      canvas: display,
      ctx: display.getContext("2d"),
      width: 0,
      height: 0,
    };

    var OPEN = "open";
    var LOADING = "loading";
    var DEVICE = {
      MOBILE: "mobile",
      DESKTOP: "desktop",
    };
    var VIEW = {
      LANDSCAPE: "landscape",
      PORTRAIT: "portrait",
    };
    var LANG = { EN: "en", HU: "hu" };
    var language = navigator.language === "hu-HU" ? LANG.HU : LANG.EN;
    var actView = VIEW.LANDSCAPE;
    var actDevice = DEVICE.DESKTOP;
    var actMenu = null;
    var actInfo = true; // it will continue the url for the html page
    var actTheme = null;
    var cleanMode = false;
    var actArt = 0;
    var actStage = 1;
    // if allowToDraw  is true, the image is getting drawn in the next request frame cycle
    var allowToDraw = false;
    var shiftDown = false;
    var altDown = false;
    var isPlaying = false;
    var mouseDown = false;
    var mouseDownStartPos = null;
    var mousePos = { x: 0, y: 0 };
    var touchAnchor = null;

    init = function () {
      tick_helper();
      resize();
      /* 
      var contentClay = new Clay("#content-wrapper");
      contentClay.on("resize", resize); */

      TweenMax.to(loader, 0, { autoAlpha: 1 });
      window.addEventListener("resize", resize, false);
      initControl();
      setupMenu(mainData.menu, "main-menu", language);
      TweenMax.set(popup, { autoAlpha: 0 });
      actTheme = mainData.default;
      updateTheme();
      startGallery(mainData.works);
      menuClick("enter_active");
      openList("main-menu");
      if (actStage === 1) {
        stage1();
      }
      logo.addEventListener("click", toggleCleanMode);
      infoButton.addEventListener("click", onInfo);

      /* desktop listeners */

      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);
      contentWrapper.addEventListener("mousedown", onMouseDown, false);
      document.addEventListener("mousemove", onMouseMove, { passive: false });
      document.addEventListener("mouseup", onMouseUp, false);
      //document.addEventListener("mouseleave", onMouseUp, false);
      //contentWrapper.addEventListener("click", onClick, false);
      document.addEventListener("keyup", onKeyUp);
      document.addEventListener("wheel", onScroll);
      /* touch listeners */
      contentWrapper.addEventListener("contextmenu", clearEvent);
      contentWrapper.addEventListener("tap", onClick, {
        passive: false,
      });
      contentWrapper.addEventListener("touchstart", onTouchDown, {
        passive: false,
      });
      document.addEventListener("touchmove", onTouchMove, { passive: false });
      document.addEventListener("touchend", onTouchUp, { passive: false });

      // reset some mobile shit
      /* document.addEventListener(
        "touchstart",
        (event) => {
          if (event.touches.length > 1) {
            event.preventDefault();
            event.stopPropagation();
          }
        },
        { passive: false }
      ); */

      /* document.addEventListener('touchstart', handleTouchStart, false);        
			document.addEventListener('touchmove', handleTouchMove, false);
			document.addEventListener('touchend', handleTouchEnd, false); */
    };

    // start with data !!!!!!
    loadSetupData(init);

    /*
     *
     *	Stages
     *
     */

    function stage1() {
      backButton.style.display = "none";
      TweenMax.to(nextButton, 1.1, {
        delay: 0.1,
        opacity: 1,
        ease: Power1.easeIn,
      });
      TweenMax.delayedCall(0.1, openList, ["main-menu"]);
    }

    function stage2() {
      menuClick("manual");
      console.log("stage 2");
    }

    function getActTheme() {
      var ownTheme =
        gallerySetup.items[gallerySetup.list[gallerySetup.act]].theme;
      return !actMenu && ownTheme ? ownTheme : mainData.default;
    }

    function stage3() {
      nextButton.style.pointerEvents = "none";
      TweenMax.to(nextButton, buttonTime, { opacity: 0, ease: Power1.easeOut });
      backButton.style.display = "block";
      backClick();

      actTheme = getActTheme();

      updateTheme();
      console.log("stage 3");
    }

    function getString(item, lang) {
      if (typeof item === "string") {
        return item;
      } else {
        if (item[lang]) {
          return item[lang];
        } else {
          return "string error " + item;
        }
      }
      return "";
    }

    /*
     *
     *	Control
     *
     */

    var isControlOpen = false;
    var buttonEase = CustomEase.create(
      "custom",
      "M0,0,C0.634,0.256,0.276,1,1,1"
    );
    var buttonTime = 0.3;
    var controlPanelBounds = null;
    var controlButtonBounds = null;

    function toggleControl() {
      isControlOpen = !isControlOpen;
      controlPanelBounds = controlPanel.getBoundingClientRect();
      controlButtonBounds = controlButton.getBoundingClientRect();

      if (isControlOpen) {
        disableMenuBg();
        TweenMax.to(controlPanelBg, buttonTime, {
          rotation: 0,
          y: 0,
          ease: buttonEase,
        });
        TweenMax.to(controlPanelBg, buttonTime / 4, {
          opacity: 1,
          ease: buttonEase,
        });
        TweenMax.to(controlPanel, buttonTime, { y: 0, ease: Power1.easeInOut });
        TweenMax.to(controlButtonArrow, buttonTime, {
          rotation: -180,
          ease: buttonEase,
        });
      } else {
        enableMenuBg();
        TweenMax.to(controlPanelBg, buttonTime, {
          rotation: 45,
          ease: buttonEase,
        });
        if (cleanMode) {
          TweenMax.to(controlPanelBg, buttonTime * 0.6, {
            delay: buttonTime * 0.4,
            opacity: 0.01,
            ease: Power2.easeOut,
          });
        }
        TweenMax.to(controlPanel, buttonTime, {
          y: -controlPanelBounds.height + controlButtonBounds.height,
          ease: Power4.easeOut,
        });
        TweenMax.to(controlButtonArrow, buttonTime, {
          rotation: 0,
          ease: buttonEase,
        });
      }
    }
    function enableMenuBg() {
      TweenMax.set(controlPanel, { pointerEvents: "none" });
      TweenMax.set(menuCloseButton, { pointerEvents: "none" });
    }
    function disableMenuBg() {
      TweenMax.set(controlPanel, { pointerEvents: "auto" });
      TweenMax.set(menuCloseButton, { pointerEvents: "auto" });
    }
    function initControl() {
      controlPanelBg.addEventListener("click", toggleControl, false);
      menuCloseButton.addEventListener("click", toggleControl, false);
      fullscreenButton.addEventListener("click", toggleFullscreen, false);
    }
    function resizeControl() {
      controlPanelBounds = controlPanel.getBoundingClientRect();
      controlButtonBounds = controlButton.getBoundingClientRect();
      if (isControlOpen) {
        disableMenuBg();
        TweenMax.set(controlPanelBg, { rotation: 0 });
        TweenMax.set(controlPanel, { y: 0 });
      } else {
        enableMenuBg();
        TweenMax.set(controlPanelBg, { rotation: 45 });
        TweenMax.set(controlPanel, {
          y: -controlPanelBounds.height + controlButtonBounds.height,
        });
      }
    }

    function openArrowButton() {
      if (!isControlOpen) {
        TweenMax.to(controlPanelBg, 0.8, { opacity: 0.01 });
      }
      controlButtonArrow.querySelectorAll("polygon")[0].style.fill =
        "var(--primary)";
    }
    function closeArrowButton() {
      if (!isControlOpen) {
        TweenMax.to(controlPanelBg, 0.8, { opacity: 1 });
      }
      controlButtonArrow.querySelectorAll("polygon")[0].style.fill =
        "var(--negative)";
    }
    /*
     *
     *	RESIZE
     *
     */

    function resize() {
      console.log("resize");
      W = document.documentElement.clientWidth;
      H = document.documentElement.clientHeight;
      body.style = "width:" + W + "px; height:" + H + "px;";

      // TOD: override this one with proper device checking
      if (W / H < 0.85) {
        actDevice = DEVICE.MOBILE;
      } else {
        actDevice = DEVICE.DESKTOP;
      }
      resizeControl();
      /*

      RESIZE CANVAS
   
      */
      var bounds = contentWrapper.getBoundingClientRect();
      projection.resetBounds(
        {
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
        },
        projection.getScale() < 1.2
      );
      displaySetup.width = display.width = Math.floor(bounds.width);
      displaySetup.height = display.height = Math.floor(bounds.height);

      allowToDraw = true;
      // TOD: set root fontsize here based on height and width ratio
    }

    function tick_helper() {
      tick();
      window.requestAnimationFrame(tick_helper);
    }
    function tick() {
      if (allowToDraw) {
        allowToDraw = false;
        drawArtwork();
      }
    }

    //
    //
    // DATA
    //
    //

    mainData = null;

    function loadSetupData() {
      readTextFile("./setup.json", setupDataLoaded);
    }
    function setupDataLoaded(data) {
      mainData = data;
      init();
    }

    function readTextFile(file, callback) {
      var rawFile = new XMLHttpRequest();
      rawFile.overrideMimeType("application/json");
      rawFile.open("GET", file, true);
      rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
          callback(JSON.parse(rawFile.responseText));
        }
      };
      rawFile.send(null);
    }

    //usage:

    //
    //
    // Swipe Stuff
    //
    //

    var xDown = null;
    var yDown = null;

    /* function handleTouchStart(evt) {                                         
		    xDown = evt.touches[0].clientX;                                      
		    yDown = evt.touches[0].clientY;
		    date = new Date();
		    touch_start_time = date.getTime();                                      
		};                                                
		function handleTouchMove(evt) {
		   xUp = evt.touches[0].clientX;                                    
		   yUp = evt.touches[0].clientY;                                    
		};
		function handleTouchEnd(evt) {
			date = new Date();
			var new_time = date.getTime();
			var del = new_time-touch_start_time;
			//console.log("del "+del);
			if(del < 400){
			    if ( ! xDown || ! yDown ) {
			        return;
			    }
			    var xDiff = xDown - xUp;
			    var yDiff = yDown - yUp;

			    if ( Math.abs( xDiff ) > Math.abs( yDiff ) &&  Math.abs( xDiff ) > W*0.2) {
			        if ( xDiff > 0 ) {
			            nextMenu("left");
			        } else {
			            prevMenu("right");
			        }                       
			    }
			    xDown = null;
			    yDown = null;   
		    }                                          
		}; */

    /*
     *
     *	Menu
     *
     */

    var menu = [];

    function getSeparator() {
      var separator = document.createElement("div");
      separator.innerHTML = "|";
      separator.classList.add("separator");
      return separator;
    }
    function setupMenu(data, parent, lang) {
      var parentElement = document.getElementById(parent);
      parentElement.innerHTML = "";

      data.forEach(function (curr, i) {
        var name = document.createElement("div");
        name.innerHTML = getString(curr.name, lang);
        parentElement.appendChild(name);
        name.addEventListener("click", function () {
          menuClick(curr.id);
        });
        if (i !== data.length - 1) {
          parentElement.appendChild(getSeparator());
        }
      });

      backButton.addEventListener("click", backClick);
      nextButton.addEventListener("click", nextClick);
    }

    var newIframe = null;
    var iframeTime = 0.7;

    function openIframe(path) {
      TweenMax.to(popup, iframeTime, { autoAlpha: 1, ease: Power1.easeInOut });
      newIframe = document.createElement("iframe");
      newIframe.style.width = "100%";
      newIframe.style.height = "100%";
      newIframe.style.backgroundColor = "transparent";
      newIframe.allowTransparency = "true";
      newIframe.setAttribute("src", path);
      iframeContainer.innerHTML = "";
      iframeContainer.appendChild(newIframe);
      TweenMax.to(iframeContainer, 0, { opacity: 0 });
      openBackButton();
      closeFooter(true);
      closeDisplay();
      openLoader();
      newIframe.addEventListener("load", function (e) {
        closeLoader();
        TweenMax.to(iframeContainer, iframeTime, {
          opacity: 1,
          ease: Power2.easeInOut,
        });
      });
    }
    function menuClick(id) {
      console.log("menu click", id);
      for (var i = 0; i < mainData.menu.length; i++) {
        var item = mainData.menu[i];
        if (item.id === id && actMenu !== id) {
          actMenu = id;
          openIframe(getString(item.link, language));
        }
      }
    }

    function openLoader() {
      loader.style.display = "block";
      TweenMax.to(loader, 0, { opacity: 1 });
    }

    function closeLoader() {
      TweenMax.to(loader, 0.2, {
        opacity: 0,
        onComplete: function () {
          loader.style.display = "none";
        },
      });
    }

    function openList(id) {
      document.getElementById(id).classList.add(OPEN);
    }
    function closeList(id) {
      document.getElementById(id).classList.remove(OPEN);
    }
    function openInfoButton() {
      if (actInfo) {
        infoButton.classList.add(OPEN);
        infoButton.style.pointerEvents = "auto";
      }
    }
    function closeInfoButton() {
      infoButton.classList.remove(OPEN);
      infoButton.style.pointerEvents = "none";
    }

    function openBackButton() {
      backButton.classList.add(OPEN);
      backButton.style.pointerEvents = "auto";
    }
    function closeBackButton() {
      backButton.classList.remove(OPEN);
      backButton.style.pointerEvents = "none";
    }

    function openFooter(quick) {
      TweenMax.delayedCall(0, openList, ["arrows"]);
      TweenMax.delayedCall(0.2, openList, ["art-title"]);
      TweenMax.delayedCall(0.4, openList, ["art-details"]);
      TweenMax.delayedCall(quick ? 0.7 : 1.2, openInfoButton);
    }

    function closeFooter() {
      TweenMax.delayedCall(0, closeList, ["arrows"]);
      TweenMax.delayedCall(0, closeList, ["art-title"]);
      TweenMax.delayedCall(0, closeList, ["art-details"]);
      TweenMax.delayedCall(0, closeInfoButton);
    }

    function toggleCleanMode() {
      TweenMax.killAll(false, false, true);
      console.log("cleanMode", cleanMode);
      if (cleanMode) {
        closeCleanMode();
      } else {
        openCleanMode();
      }
    }
    function openCleanMode() {
      cleanMode = true;
      closeList("main-menu");
      mainMenu.style.pointerEvents = "none";
      logo.style.backgroundColor = "var(--primary)";
      root.style.setProperty("--global-gap", "var(--small-global-gap)");
      root.style.setProperty("--logo-size", "var(--small-logo-size)");
      root.style.setProperty("--logo-left", "var(--small-logo-left)");
      root.style.setProperty("--logo-top", "var(--small-logo-top)");
      root.style.setProperty("--gap-transition", "var(--gap-transition-delay)");
      root.style.setProperty(
        "--description-margin",
        "var(--large-description-margin)"
      );
      root.style.setProperty(
        "--logo-mobile-top",
        "var(--logo-mobile-top-small)"
      );

      openArrowButton();
      startCanvasScale(0.65);
      if (!actMenu) {
        closeFooter();
      }
    }

    function closeCleanMode() {
      cleanMode = false;
      openList("main-menu");
      mainMenu.style.pointerEvents = "all";
      logo.style.backgroundColor = "var(--secondary)";
      root.style.setProperty("--global-gap", "var(--large-global-gap)");
      root.style.setProperty("--logo-size", "var(--large-logo-size)");
      root.style.setProperty("--logo-left", "var(--large-logo-left)");
      root.style.setProperty("--logo-top", "var(--large-logo-top)");
      root.style.setProperty("--gap-transition", "var(--gap-transition-base)");
      root.style.setProperty(
        "--description-margin",
        "var(--small-description-margin)"
      );
      root.style.setProperty(
        "--logo-mobile-top",
        "var(--logo-mobile-top-large)"
      );

      closeArrowButton();
      startCanvasScale();
      if (!actMenu && !cleanMode) {
        openFooter(true);
      }
    }

    function backClick() {
      TweenMax.to(popup, iframeTime, {
        opacity: 0,
        ease: Power2.easeInOut,
        onComplete: function () {
          iframeContainer.innerHTML = "";
        },
      });
      actMenu = null;
      closeBackButton();
      if (!cleanMode) {
        openFooter(true);
      }
      openDisplay();
    }

    var scaleInterval = 0;
    var scaleOffTimeout = 0;
    var scaleRepeat = 20;
    var scaleStop = 300;
    function startCanvasScale(delay) {
      if (delay) {
        // scaleOffTimeout = setInterval(resize, 40);
        clearTimeout(scaleOffTimeout);
        scaleOffTimeout = setTimeout(delayedCanvasScale, delay * 1000);
      } else {
        delayedCanvasScale();
      }
    }
    function delayedCanvasScale() {
      clearInterval(scaleInterval);
      clearTimeout(scaleOffTimeout);
      scaleInterval = setInterval(resize, scaleRepeat);
      scaleOffTimeout = setTimeout(stopCanvasScale, scaleStop);
    }
    function stopCanvasScale() {
      clearInterval(scaleInterval);
    }
    function nextClick() {
      if (actStage === 2) {
        actStage = 0;
        stage3();
      }
      if (actStage === 1) {
        actStage = 2;
        stage2();
      }
    }

    function updateTheme() {
      if (actTheme) {
        if (!actTheme.darkMode) {
          root.style.setProperty("--primary", "var(--white)");
          root.style.setProperty("--secondary", "var(--black)");
        } else {
          root.style.setProperty("--primary", "var(--black)");
          root.style.setProperty("--secondary", "var(--white)");
        }
        root.style.setProperty("--negative", actTheme.frame);
        root.style.setProperty("--positive", actTheme.background);
      }
    }

    /*
     *
     *	Keys
     *
     */

    function onKeyUp(e) {
      stopArt(e);
    }
    function onKeyDown(e) {
      if (e.repeat) {
        return;
      }
      switch (e.key) {
        case "Enter":
          if (actStage) {
            nextClick();
          } else {
            startArtTimer(); // timer first
          }
          break;
        case "ArrowRight":
          if (actStage) {
            nextClick();
          } else {
            nextGallery();
          }
          break;
        case "ArrowLeft":
          prevGallery();
          break;
        case "ArrowUp":
          nextArt();
          break;
        case "ArrowDown":
          prevArt();
          break;
        case " ":
          toggleCleanMode();
          break;
        case "Backspace":
          backClick();
          break;
        case "Shift":
          shiftDown = true;
          if (mouseDown) {
            startPan();
          }
          break;
        case "Alt":
          altDown = true;
          if (mouseDown) {
            startZoom();
          }
          break;
      }
    }
    function onKeyUp(e) {
      if (e.repeat) {
        return;
      }
      switch (e.key) {
        case "Enter":
          stopArt();
          nextArt();

          interactionStop();
          break;
        case "Shift":
          shiftDown = false;
          stopPan();
          break;
        case "Alt":
          altDown = false;
          stopZoom();
          break;
      }
    }

    function registerMouse(points) {
      if (points[0]) {
        mousePos = points[0];
      }
      if (points[1]) {
        touchAnchor = {
          x: points[0].x + (points[1].x - points[0].x) / 2,
          y: points[0].y + (points[1].y - points[0].y) / 2,
        };
      } else {
        touchAnchor = null;
      }
    }

    function onClick(e) {
      if (shiftDown || altDown) {
        return;
      }
      if (!(e && e.which && e.which !== 1)) {
        nextArt();
      }
    }

    function mDown(points, touch, buttonWhich) {
      if (touch || buttonWhich === 1) {
        console.log("DOWN", touch, buttonWhich);
        mouseDown = true;
        mouseDownStartPos = points[0];
        registerMouse(points);
        // timer first!
        startArtTimer();
        if (altDown || (points.length === 2 && touch)) {
          startZoom();
        } else if (shiftDown) {
          startPan();
        }
      }
      console.log("buttonWhich", buttonWhich);
      if (buttonWhich === 2 || buttonWhich === 3) {
        startPan();
      }
    }

    function mMove(points, touch) {
      registerMouse(points);
      if (interaction) {
        handleZoom();
      }
    }

    function mUp(points, touch) {
      mouseDown = false;

      if (
        mouseDownStartPos &&
        projection.getDistance(mouseDownStartPos, mousePos) < 10
      ) {
        onClick();
      }
      mouseDownStartPos = null;
      registerMouse(points);
      stopArt();
      interactionStop();
      stopZoom();
      stopPan();
    }

    function onMouseDown(e) {
      clearEvent(e);
      mDown([{ x: e.pageX, y: e.pageY }], false, e.which);
    }

    function onMouseMove(e) {
      clearEvent(e);
      mMove([{ x: e.pageX, y: e.pageY }]);
    }

    function onMouseUp(e) {
      clearEvent(e);
      mUp([{ x: e.pageX, y: e.pageY }]);
    }

    function onTouchDown(e) {
      clearEvent(e);
      var points = [];
      for (var i = 0; i < e.targetTouches.length; i++) {
        points.push({
          x: e.targetTouches[i].pageX,
          y: e.targetTouches[i].pageY,
        });
      }
      mDown(points, true);
    }
    function onTouchMove(e) {
      clearEvent(e);
      var points = [];
      for (var i = 0; i < e.targetTouches.length; i++) {
        points.push({
          x: e.targetTouches[i].pageX,
          y: e.targetTouches[i].pageY,
        });
      }
      mMove(points, true);
    }
    function onTouchUp(e) {
      //no need clearEvent(e) here!
      var points = [];
      for (var i = 0; i < e.targetTouches.length; i++) {
        points.push({
          x: e.targetTouches[i].pageX,
          y: e.targetTouches[i].pageY,
        });
      }
      mUp(points, true);
    }

    function onScroll(e) {
      //console.log("scroll");
      var staticGap = 100;
      var maxDelta = 40;
      var delta = e.deltaY > maxDelta ? maxDelta : e.deltaY < -maxDelta ? -maxDelta : e.deltaY;
      var fakeMouseMove = delta / 2;

      projection.startZoom(mousePos, {
        x: mousePos.x,
        y: mousePos.x + staticGap,
      });
      projection.updateZoom(mousePos, {
        x: mousePos.x,
        y: mousePos.x + staticGap + fakeMouseMove,
      });
      projection.stopZoom();
      allowToDraw = true;
    }
    function clearEvent(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
    /*
     *
     *	Gallery
     *
     */

    var gallerySetup = {
      act: 0,
      all: 0,
      items: {},
      list: [],
    };
    function galleryDataLoaded(data) {
      console.log("gallery", data);
    }
    function startGallery(galleryData) {
      gallerySetup.act = 0;
      gallerySetup.all = galleryData.length;
      gallerySetup.items = {};
      gallerySetup.list = galleryData;

      galleryData.forEach(function (path) {
        try {
          readTextFile(path + "/setup.json", function (data) {
            gallerySetup.items[path] = data;
            if (
              Object.keys(gallerySetup.items).length ===
              gallerySetup.list.length
            ) {
              //updateDetails();
              //updateTitles();
              updateGallery();
            }
          });
        } catch (e) {
          console.log("Error with path " + path);
        }
      });

      leftArrow.addEventListener("click", prevGallery);
      rightArrow.addEventListener("click", nextGallery);
    }

    function updateGalleryLine(parentElement, data) {
      parentElement.innerHTML = "";
      data.forEach(function (curr, i) {
        var name = document.createElement("span");
        name.innerHTML = getString(curr, language);
        parentElement.appendChild(name);
        if (i !== data.length - 1) {
          parentElement.appendChild(getSeparator());
        }
      });
    }
    function updateDetails() {
      count.innerHTML = gallerySetup.act + 1 + " / " + gallerySetup.all;
    }
    function updateTitles() {
      var gallery = gallerySetup.items[gallerySetup.list[gallerySetup.act]];
      var titles = [];
      if (gallery.sub_title) {
        titles.push(gallery.sub_title);
      }
      if (gallery.title) {
        titles.push(gallery.title);
      }
      if (gallery.author) {
        titles.push(gallery.author);
      }
      updateGalleryLine(artTitle, titles);

      var details = [];
      if (gallery.details) {
        gallery.details.forEach(function (detail) {
          details.push(detail);
        });
      }
      updateGalleryLine(artDetails, details);

      if (gallery.info) {
        actInfo = gallery.info;
      } else {
        actInfo = null;
      }
      if (actInfo && !actMenu && !cleanMode) {
        openInfoButton();
      }
    }

    function onInfo() {
      if (actInfo) {
        var mainPath = gallerySetup.list[gallerySetup.act];
        var link = mainPath + "/" + getString(actInfo, language);
        console.log("link", link);
        openIframe(link);
      }
    }
    function nextGallery() {
      gallerySetup.act++;
      if (gallerySetup.act >= gallerySetup.all) {
        gallerySetup.act = 0;
      }
      updateGallery();
    }
    function prevGallery() {
      gallerySetup.act--;
      if (gallerySetup.act < 0) {
        gallerySetup.act = gallerySetup.all - 1;
      }
      updateGallery();
    }

    var galleryIsUpdating = false;
    function updateGallery() {
      TweenMax.killAll(false, false, true);
      closeList("art-title");
      closeList("art-details");
      updateDetails();
      closeInfoButton();
      TweenMax.delayedCall(galleryIsUpdating ? 0.4 : 1, function () {
        galleryIsUpdating = false;
        updateTitles();
        if (!actMenu && !cleanMode) {
          openFooter();
        }
      });
      actTheme = getActTheme();
      updateTheme();
      galleryIsUpdating = true;
      startArtwork();
      setOriginRect(true);
    }

    var artworks = [];
    var artworkRegister = 0;
    var artworkIsLoading = false;
    function startArtwork() {
      var mainPath = gallerySetup.list[gallerySetup.act];
      var gallery = gallerySetup.items[mainPath];
      var art = gallery.artwork;
      actArt = 0;
      clearArtwork();
      openLoader();
      if (art) {
        art.forEach(function (path) {
          var img = new Image();
          img.onload = function (e) {
            artworkRegister++;
            if (artworkRegister === art.length) {
              artworkFinishedLoading();
            }
          };

          var src = mainPath + "/" + path;
          img.src = src;

          artworks.push({
            img: img,
            src: src,
          });
        });
      }
      artworkIsLoading = true;
    }
    function artworkFinishedLoading() {
      artworkIsLoading = false;
      closeLoader();
      allowToDraw = true;
    }
    function clearArtwork() {
      artworks.forEach(function (curr) {
        if (curr.img) {
          curr.img.src = "";
          curr.img.onload = null;
          curr.img = null;
        }
      });
      artworks = [];
      artworkRegister = 0;
    }
    function nextArt() {
      actArt++;
      if (actArt >= artworks.length) {
        actArt = 0;
      }
      allowToDraw = true;
    }
    function prevArt(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.repeat) {
          return;
        }
      }
      actArt--;
      if (actArt < 0) {
        actArt = artworks.length - 1;
      }
      allowToDraw = true;
    }

    var timer = {};
    var interaction = false;
    var playDelay = 0.68;
    var playInterval = 0;
    var fps = 24.2;

    function interactionStart() {
      interaction = true;
      root.style.setProperty("--selectable", "none");
    }
    function interactionStop() {
      interaction = false;
      root.style.setProperty("--selectable", "auto");
    }
    function startArtTimer() {
      console.log("startArtTimer", interaction);
      /* if (interaction) {
        return;
      } */
      clearInterval(playInterval);
      TweenMax.killTweensOf(timer);
      TweenMax.to(timer, playDelay, { onComplete: playArt });
    }
    function stopArtTimer() {
      TweenMax.killTweensOf(timer);
      clearInterval(playInterval);
    }

    function playArt() {
      console.log("start art");
      if (isPanning || isZooming) {
        return;
      }
      isPlaying = true;
      clearInterval(playInterval);
      var framePerSec =
        gallerySetup.items[gallerySetup.list[gallerySetup.act]].fps;
      playInterval = setInterval(nextArt, 1000 / (framePerSec || fps));
    }
    function stopArt() {
      isPlaying = false;
      console.log("stop art");
      stopArtTimer();
    }
    function setOriginRect(reset) {
      if (artworks[actArt]) {
        var imgW = artworks[actArt].img.naturalWidth;
        var imgH = artworks[actArt].img.naturalHeight;
        projection.setOriginRectangle(
          {
            width: imgW,
            height: imgH,
          },
          reset
        );
      }
    }
    function drawArtwork() {
      if (artworks.length && artworks[actArt].img) {
        clearDisplay();
        setOriginRect();
        var renderRect = projection.getRenderRectangle();
        displaySetup.ctx.drawImage(
          artworks[actArt].img,
          renderRect.x,
          renderRect.y,
          renderRect.width,
          renderRect.height
        );
      }
    }
    function clearDisplay() {
      displaySetup.ctx.clearRect(0, 0, displaySetup.width, displaySetup.height);
    }
    function openDisplay() {
      TweenMax.to(display, buttonTime, { opacity: 1, ease: Power2.easeInOut });
    }
    function closeDisplay() {
      TweenMax.to(display, buttonTime, { opacity: 0, ease: Power2.easeInOut });
    }

    /*
     *
     *	Fullscreen
     *
     */

    function toggleFullscreen() {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        body.requestFullscreen();
      }
    }

    /*
     *
     *	Projection
     *
     */

    var projectionGap = 28;
    var projection = {
      gap: 20,
      minWidth: 100,
      maxWidth: 2000,
      bounds: { x: 0, y: 0, width: 0, height: 0 },
      anchor: { x: 0, y: 0 },
      eventOriginPoint: { x: 0, y: 0 },
      shift: { x: 0, y: 0 },
      scale: 1,
      sourceDimensions: { width: 0, height: 0 },
      renderRectangle: { x: 0, y: 0, width: 0, height: 0 },
      originRectangle: { x: 0, y: 0, width: 0, height: 0 },
      resetBounds: function (bounds, reset) {
        this.bounds = bounds;
        if (reset) {
          this.setOriginRectangle(this.sourceDimensions, true);
        }
      },
      getScale: function () {
        return this.renderRectangle.width / this.originRectangle.width;
      },
      startZoom: function (anchor, eventPoint) {
        this.registerState();
        this.anchor = anchor;
        this.eventOriginPoint = eventPoint;
      },
      updateZoom: function (eventAnchor, eventPoint) {
        var zoomShift = { x: 0, y: 0 };
        var scaleDistance =
          this.getDistance(eventAnchor, eventPoint) * 4 -
          this.getDistance(this.anchor, this.eventOriginPoint) * 4;

        this.scale =
          (this.renderRectangle.height + scaleDistance) /
          this.renderRectangle.height;

        var anchor = {
          x: this.anchor.x - this.bounds.x,
          y: this.anchor.y - this.bounds.y,
        };
        zoomShift = {
          x:
            this.renderRectangle.x -
            (anchor.x - (anchor.x - this.renderRectangle.x) * this.scale),
          y:
            this.renderRectangle.y -
            (anchor.y - (anchor.y - this.renderRectangle.y) * this.scale),
        };

        this.shift = {
          x: eventAnchor.x - this.anchor.x - zoomShift.x,
          y: eventAnchor.y - this.anchor.y - zoomShift.y,
        };
      },
      stopZoom: function () {
        this.registerState();
        this.anchor = { x: 0, y: 0 };
        this.eventOriginPoint = { x: 0, y: 0 };
      },
      startPan: function (anchor) {
        this.registerState();
        this.anchor = anchor;
      },
      updatePan: function (point) {
        this.shift = {
          x: point.x - this.anchor.x,
          y: point.y - this.anchor.y,
        };
      },
      stopPan: function (point) {
        this.registerState();
        this.anchor = { x: 0, y: 0 };
      },
      registerState: function () {
        this.renderRectangle = this.getModifiedRectangle();
        this.shift = { x: 0, y: 0 };
        this.scale = 1;
      },
      getOriginRectangle: function () {
        return this.originRectangle;
      },
      getRenderRectangle: function () {
        return this.getModifiedRectangle();
      },
      prevPos: {x: 0, y:0},
      prevShift: {x: 0, y:0},
      getModifiedRectangle: function () {
        if (!this.renderRectangle.width || !this.renderRectangle.height) {
          return this.originRectangle;
        }
        var rect = {
          x: this.renderRectangle.x + this.shift.x,
          y: this.renderRectangle.y + this.shift.y,
          width: this.renderRectangle.width * this.scale,
          height: this.renderRectangle.height * this.scale,
        };
        var lockPosition = 0;
        if (rect.width < this.minWidth) {
          lockPosition = -1;
          rect.width = this.minWidth;
          rect.height =
            (this.minWidth / this.originRectangle.width) *
            this.originRectangle.height;
        }
        if (rect.width > this.maxWidth) {
          lockPosition = 1;
          rect.width = this.maxWidth;
          rect.height =
            (this.maxWidth / this.originRectangle.width) *
            this.originRectangle.height;
        }
        if(lockPosition === -1){
          rect.x = rect.x - Math.abs((this.renderRectangle.width * this.scale) - rect.width) / 2;
          rect.y = rect.y - Math.abs((this.renderRectangle.height * this.scale) - rect.height) / 2;
        }
        if(lockPosition === 1){
          rect.x = rect.x + Math.abs((this.renderRectangle.width * this.scale) - rect.width) / 2;
          rect.y = rect.y + Math.abs((this.renderRectangle.height * this.scale) - rect.height) / 2;
        }
        var min = {
          x: -rect.height + this.gap,
          y: -rect.width + this.gap
        }
        var max = {
          x: this.bounds.width - this.gap,
          y: this.bounds.height - this.gap
        }
        //if(lockPosition){
          //rect.x = this.prevPos.x;
          //rect.y = this.prevPos.y;  
        //}else{
          rect.x = rect.x > max.x ? max.x : rect.x < min.x ? min.x : rect.x;
          rect.y = rect.y > max.y ? max.y : rect.y < min.y ? min.y : rect.y;
        //}

        this.prevPos = {x: rect.x, y: rect.y};
        return rect;
      },
      setOriginRectangle: function (image, reset) {
        var w;
        var h;
        if (
          displaySetup.width / image.width >
          displaySetup.height / image.height
        ) {
          h = displaySetup.height - 2 * projectionGap;
          w = (h / image.height) * image.width;
        } else {
          w = displaySetup.width - 2 * projectionGap;
          h = (w / image.width) * image.height;
        }
        this.originRectangle = {
          x: displaySetup.width / 2 - w / 2,
          y: displaySetup.height / 2 - h / 2,
          width: w,
          height: h,
        };
        this.sourceDimensions = {
          width: image.width,
          height: image.height,
        };
        if (reset) {
          this.renderRectangle = {
            x: this.originRectangle.x,
            y: this.originRectangle.y,
            width: this.originRectangle.width,
            height: this.originRectangle.height,
          };
        }
      },
      getDistance: function (pointA, pointB) {
        var xDiff = pointA.x - pointB.x;
        var yDiff = pointA.y - pointB.y;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
      },
    };

    /*
     *
     *	Zoom
     *
     */

    var anchor = null;
    var anchorOrigin = null;
    var scaler = null;
    var scalerOrigin = null;

    // zoom triggered on ALT
    var isZooming = false;

    var zoomStartPos = { x: 0, y: 0 };

    function startZoom() {
      interactionStart();
      isZooming = true;
      zoomStartPos = {
        x: mousePos.x,
        y: mousePos.y,
      };
      projection.startZoom(touchAnchor || zoomStartPos, mousePos);

      if (altDown) {
        stopArtTimer();
      }
      console.log("startZoom");
    }
    function updateZoom() {
      projection.updateZoom(touchAnchor || zoomStartPos, mousePos);
    }
    function stopZoom() {
      isZooming = false;
      console.log("stopZoom");
      projection.stopZoom();

      if (!shiftDown && isPlaying) {
        playArt();
        interactionStop();
      }
    }

    // zoom triggered on SHIFT
    var isPanning = false;
    function startPan(e) {
      interactionStart();
      isPanning = true;

      projection.startPan(mousePos);

      if (shiftDown) {
        stopArtTimer();
      }
      console.log("startPan", e);
    }
    function updatePan(e) {
      projection.updatePan(mousePos);
    }
    function stopPan(e) {
      projection.stopPan(mousePos);
      isPanning = false;
      if (!altDown && isPlaying) {
        playArt();
        interactionStop();
      }
      console.log("stopPan", e);
    }
    function handleZoom(point) {
      if (isZooming) {
        updateZoom();
        allowToDraw = true;
      } else if (isPanning) {
        updatePan();
        allowToDraw = true;
      }
    }
  };
})();
