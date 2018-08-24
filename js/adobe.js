(function () {
	
	var adobe = function(e) {
		var init, canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;
		var init = function() {
			canvas = document.getElementById("canvas");
			var comp=AdobeAn.getComposition("CA4233849EDF43388EB4FE3E317AF7AE");
			var lib=comp.getLibrary();
			handleComplete({},comp);
			var loader = new createjs.LoadQueue(false);
			loader.addEventListener("fileload", function(evt){handleFileLoad(evt,comp)});
			loader.addEventListener("complete", function(evt){handleComplete(evt,comp)});
			var lib=comp.getLibrary();
			loader.loadManifest(lib.properties.manifest);
			/*canvas.addEventListener("click", function(){
				console.log(exportRoot.getState());
				exportRoot.toggle();
			});*/

		}();
		function handleFileLoad(evt, comp) {
			var img=comp.getImages();	
			if (evt && (evt.item.type == "image")) { img[evt.item.id] = evt.result; }	
		}
		function handleComplete(evt,comp) {
			//This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
			var lib=comp.getLibrary();	
			var ss=comp.getSpriteSheet();

			var queue = evt.target;
			var ssMetadata = lib.ssMetadata;
			for(i=0; i<ssMetadata.length; i++) {
				ss[ssMetadata[i].name] = new createjs.SpriteSheet( {"images": [queue.getResult(ssMetadata[i].name)], "frames": ssMetadata[i].frames} )
			}

			exportRoot = new lib.anim();
			stage = new lib.Stage(canvas);
			stage.addChild(exportRoot);	
			//Registers the "tick" event listener.
			fnStartAnimation = function() {
				createjs.Ticker.setFPS(lib.properties.fps);
				createjs.Ticker.addEventListener("tick", stage);
			}	    
			AdobeAn.compositionLoaded(lib.properties.id);
			fnStartAnimation();
			registerAnimRoot(exportRoot);
		}
	};
	if (window.addEventListener) // W3C standard
	{
	  window.addEventListener('load', adobe, false); // NB **not** 'onload'
	} 
	else if (window.attachEvent) // Microsoft
	{
	  window.attachEvent('onload', adobe);
	}
})();