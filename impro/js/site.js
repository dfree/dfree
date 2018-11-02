

(function ($) {
	window.onload = function(e) {
		var init, W, H, grid, optimizedResize,
		act, act_size, font_sizes, font_ratio, max_font_sizes, min_font_sizes, window_max, window_min,
		menu_alpha_off, anim_max_size, anim_size, anim_x, anim_y, anim_delay,
		master_mask, masks, mask_dot_area, text_width, mobile_footer_pos,
		menu_num,
		loaded_script_num, anim_inited, anim_ready, skip_fist_adjust, loader_on;

		loaded_script_num = 0;
		skip_fist_adjust = true;

		W = 300;
		H = 300;
		
		menu_num = 8;
		act = -1;

		font_ratio = 1;
		font_sizes = {desktop: {sml:16, mm:18, mid:22, lrg:76}, mobile: {sml:9, mm:10, mid:14, lrg:45}}; // this is changing
		font_sizes_max = {desktop: {sml:16, mm:18, mid:22, lrg:76}, mobile: {sml:9, mm:10, mid:14, lrg:45}};
		font_sizes_min = {desktop: {sml:16, mm:18, mid:20, lrg:80}, mobile: {sml:9, mm:10, mid:14, lrg:45}};
		
		window_max = {desktop:1050, mobile:580};
		window_min = -120;

		grid = {
			count:{col:3, row:5},

			desktop: {
				font:{sml:1, mid:1, lrg:1},
				grid_start:{x:0.0563, y:0.0911},
				grid_size:{width:0.1849, height:0.147}, //grid_size:{width:0.1449, height:0.147},
				grid_gap:{width:0.0177, height:0.03},
				anim_pos:{x:0.3824, y:0, width:0.6176, height:1, scale:0.72},
				menu:{x:0.9437, y:0.0911}, //y:0.0911
				logo:{x:0.9437, y:0.92, width:120, height:30}
			},
			mobile: {
				font:{sml:1, mid:1, lrg:1},
				grid_start:{x:0.0989, y:0.0611},
				grid_size:{width:0.3789, height:0.0885},
				grid_gap:{width:0.0463, height:0.0268},
				anim_pos:{x:0, y:0.4545, width:1, height:0.3854, scale:1},//y:0.6145
				menu:{x:0.9437, y:0.9275}, //y:0.90
				logo:{x:0.9437, y:0.92, width:120, height:30}
			}
		};
		var mobile_mid = -24;
		var mobile_adjust = [10, mobile_mid, mobile_mid, mobile_mid, mobile_mid, mobile_mid, mobile_mid, 0];
		var mobile_slide;
		var mobile_slide_max = 100;

		optimizedResize = (function() {
		    var callbacks = [], running = false;
		    function resizer() {if (!running) {running = true;if (window.requestAnimationFrame) {window.requestAnimationFrame(runCallbacks);} else {setTimeout(runCallbacks, 66);}}}
		    function runCallbacks() {callbacks.forEach(function(callback) {callback();});running = false;}
		    function addCallback(callback) {if (callback) {callbacks.push(callback);}}
		    return {add: function(callback) {if (!callbacks.length) {window.addEventListener('resize', resizer);}addCallback(callback);}
		    }
		}());

		var wait_for_root = -1;

		var date;
		var touch_start_time = 0;
		var xUp = 0;                                    
		var yUp = 0;

		// IMPRO

		var icons = {
			width:324,
			height:531,
		}
		init = function() {
			TweenPlugin.activate([CSSPlugin]);
			act_size = "desktop";
			
			start();
			resize();
			intro();
			document.addEventListener('click', rotateStage, false); 
			document.addEventListener('touchstart', handleTouchStart, false);        
			document.addEventListener('touchmove', handleTouchMove, false);
			document.addEventListener('touchend', handleTouchEnd, false);
			
		}();
		function start() {
			$.set("rota", {rotation:0});
			$.set("rota_counter", {rotation:0});
			rotateHelper();
			window.requestAnimationFrame(tick_helper);
			optimizedResize.add(resize);
		}

		function intro(){
			rotateStage();

		}

		/*
		*
		*	RESIZE staff
		*
		*/


		function resize(){
			W = document.documentElement.clientWidth;
			H = document.documentElement.clientHeight;
			$.set("body", {width:W, height:H});
			$.set("grid", {x:W/2, y:H/2, width:W, height:H});
			

			if(W/H < 0.85){
				act_size = "mobile";
			}else{
				act_size = "desktop";
			}
			var font_ratio = (H-window_min)/(window_max[act_size]-window_min);

			for(let platform in font_sizes){
				for(let type in font_sizes[platform]){
					font_sizes[platform][type] = (font_sizes_max[platform][type]-font_sizes_min[platform][type])*font_ratio+font_sizes_min[platform][type];
				}
			}

			if(act_size == "mobile"){
				//$.set("anim_move", {y:font_ratio*mobile_adjust[act]});
			}else{
				//$.set("anim_move", {y:0});
			}
			


		    text_width = grid[act_size].grid_size.width*W*2+grid[act_size].grid_gap.width*W*2;
		    var elements = $.class("page");
			for (var i=0; i < elements.length; i++) {
			     $.set(elements[i], {fontSize:font_sizes[act_size].lrg*font_ratio});
			}

		    /*
		    elements = $.class("title");
			for (var i=0; i < elements.length; i++) {
			     $.set(elements[i], {width:title_width, fontSize:font_sizes[act_size].lrg*font_ratio});
			}
			elements = $.class("mid");
			for (var i=0; i < elements.length; i++) {
			     $.set(elements[i], {fontSize:font_sizes[act_size].mid*font_ratio});
			}
			*/


			// IMPRO

			var size = W > H ? W : H;

			elements = $.class("wrap");
			for (var i=0; i < elements.length; i++) {
			     $.set(elements[i], {x:-size, y:0, width:size*2, height:size*2});
			}
			
			elements = $.class("wrap_back");
			for (var i=0; i < elements.length; i++) {
			     $.set(elements[i], {x:-W/2, y:-H/2, width:W, height:H});
			}

			$.set("rota_counter", {x:size});

			elements = $.class("content");
			for (var i=0; i < elements.length; i++) {
			     $.set(elements[i], {x:-W/2, y:-H/2, width:W, height:H});
			}

			elements = $.class("content_back");
			for (var i=0; i < elements.length; i++) {
			     $.set(elements[i], {x:0, y:0, width:W, height:H});
			}

			elements = $.class("logo");
			for (var i=0; i < elements.length; i++) {
			     $.set(elements[i], {x:W/2-115, y:H/2-72});
			}

			elements = $.class("icon");
			for (var i=0; i < elements.length; i++) {
				var h = H*0.46;
				var w = h/icons.height*icons.width;
				var top = elements[i].classList.contains('top') ? H/2-(H/2*0.1)-h : H/2+H/2*0.1;
			    $.set(elements[i], {
			    	x:W/2 - w/2,
			    	y: top,
			    	width:w, 
			    	height:h
			    });
			}

		}

		

	

		var ticker = 0;
		function tick_helper(){
			
			tick();
			window.requestAnimationFrame(tick_helper);
		}
		function tick(){
			ticker++;
			

			if(ticker > 1){
				ticker = 0;
				
			}
		}
		
		//
		//
		// Swipe Stuff
		//
		//

		var xDown = null;                                                        
		var yDown = null;                                                        

		function handleTouchStart(evt) {                                         
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
			            //nextMenu("left");
			        } else {
			            //prevMenu("right");
			        }                       
			    }
			    xDown = null;
			    yDown = null;   
		    }else{
		    	rotateStage();
		    }                                          
		};



		function rotateStage(){
			var r1 = $.id("rota")._gsTransform.rotation-180;
			r1 -= r1%180;
			var r2 = $.id("rota_counter")._gsTransform.rotation+180;
			r2 -= r2%180;
			$.tween("rota", 1.2, {rotation:r1, ease:Power3.easeInOut});
			$.tween("rota_counter", 1.2, {rotation:r2, ease:Power3.easeInOut});
		}

		function rotateHelper(){
			rotateStage();
			$.delay(3.6, rotateHelper);
		}
		function rand(a,b){
			return Math.random()*(b-a)+a;
		}
	};
})({
	id: function(name){
		return document.getElementById(name);
	},
	class: function(name){
		return document.getElementsByClassName(name);
	},
	delay: function(time, func, props){
		var prp = props || [];
		TweenMax.delayedCall(time, func, prp);
	},
	from: function(name, time, props){
		return TweenMax.from(typeof name === 'string' ? this.id(name) : name, time, props);
	},
	tween: function(name, time, props){
		return TweenMax.to(typeof name === 'string' ? this.id(name) : name, time, props);
	},
	set: function(name, props){
		return TweenMax.set(typeof name === 'string' ? this.id(name) : name, props);
	},
	create: function(name, parent, props, src){
		var elem = document.createElement(src ? 'img' : 'div');
		if(src){
			elem.src = src;
		}
		elem.id = name;
		this.id(parent).appendChild(elem);
		props = props || {};
		this.set(elem, props);
		return elem;
	},
	kill: function(name){
		return TweenMax.killTweensOf(typeof name === 'string' ? this.id(name) : name);
	}
});