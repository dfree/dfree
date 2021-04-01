(function () {
  window.onload = function (e) {
    var W = 300;
    var H = 300;
    var body = document.getElementById("body");
    var logo = document.getElementById("logo");
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
    var language = LANG.HU;
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

    init = function () {
      tick_helper();
      resize();
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
      contentWrapper.addEventListener("click", nextArt);
      infoButton.addEventListener("click", onInfo);
      document.addEventListener("keydown", onKeyDown);
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

      /* if (!actMenu) {
        TweenMax.delayedCall(0.4, openFooter);
      } else {
      } */
    }
    function stage2() {
      menuClick("manual");
      console.log("stage 2");
    }

    function stage3() {
      nextButton.style.pointerEvents = "none";
      TweenMax.to(nextButton, buttonTime, { opacity: 0, ease: Power1.easeOut });
      backButton.style.display = "block";
      backClick();
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
      TweenMax.set(interactions, { pointerEvents: "none" });
      TweenMax.set(menuCloseButton, { pointerEvents: "none" });
    }
    function disableMenuBg() {
      TweenMax.set(interactions, { pointerEvents: "auto" });
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
        console.log("nam", getString(curr.name, lang));
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
      logo.style.backgroundColor = "var(--primary)";
      openArrowButton();
      if (!actMenu) {
        closeFooter();
      }
    }

    function closeCleanMode() {
      cleanMode = false;
      openList("main-menu");
      logo.style.backgroundColor = "var(--secondary)";
      closeArrowButton();
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
      console.log(actTheme, mainData);
      if (actTheme) {
        var root = document.documentElement;
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

    function onKeyDown(e) {
      console.log(e.key);
      switch (e.key) {
        case "Enter":
          nextArt();
          break;
        case "ArrowRight":
          nextGallery();
          break;
        case "ArrowLeft":
          prevGallery();
          break;
        case " ":
          toggleCleanMode();
          break;
        case "Backspace":
          backClick();
          break;
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
      console.log("actInfo", actInfo);
      if (actInfo && !actMenu && !cleanMode) {
        openInfoButton();
      }
    }

    function onInfo() {
      if (actInfo) {
        var mainPath = gallerySetup.list[gallerySetup.act];
        var link = mainPath+'/'+getString(actInfo, language);
        console.log('link', link);
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
      var ownTheme = gallerySetup.items[gallerySetup.list[gallerySetup.act]].theme;
        actTheme = !actMenu && ownTheme ? ownTheme : mainData.default;
        updateTheme();
      galleryIsUpdating = true;
      startArtwork();
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
      console.log("finished");
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

    /*
     *
     *	Canvas
     *
     */

    var projectionGap = 20;

    var projection = {
      getRenderRectangle: function (image) {
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
          h = (image.width / w) * image.width;
        }
        return {
          x: displaySetup.width / 2 - w / 2,
          y: displaySetup.height / 2 - h / 2,
          width: w,
          height: h,
        };
      },
    };
    function drawArtwork() {
      if (artworks.length && artworks[actArt].img) {
        clearDisplay();
        var imgW = artworks[actArt].img.naturalWidth;
        var imgH = artworks[actArt].img.naturalHeight;
        var renderRect = projection.getRenderRectangle({
          width: imgW,
          height: imgH,
        });
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
         if(document.fullscreenElement){
             document.exitFullscreen();
         }else{
            body.requestFullscreen();
         }
     }
    function random(a, b) {
      return Math.random() * (b - a) + a;
    }
  };
})();
