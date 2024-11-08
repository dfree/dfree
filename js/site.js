

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
		font_sizes = {desktop: {sml:16, mm:18, mid:22, lrg:96}, mobile: {sml:9, mm:10, mid:14, lrg:45}}; // this is changing
		font_sizes_max = {desktop: {sml:16, mm:18, mid:22, lrg:96}, mobile: {sml:9, mm:10, mid:14, lrg:45}};
		font_sizes_min = {desktop: {sml:16, mm:18, mid:20, lrg:80}, mobile: {sml:9, mm:10, mid:14, lrg:45}};
		
		window_max = {desktop:1050, mobile:580};
		window_min = -120;

		anim_max_size = 1050;
		anim_size = 0;
		
		anim_delay = 0.6;

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

		mobile_footer_pos = 0.836;

		masks = {};
		mask_dot_area = 16;
		mask_size = {width:1280, height:700};
		//mask_size = {width:300, height:300};
		menu_alpha_off = 0.3;

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

		init = function() {
			TweenPlugin.activate([CSSPlugin]);
			act_size = "desktop";
			
			start();
			resize();
			intro();
			$.delay(1.5, newMenuHelper, [0]);

			var ctx = $.id("canvas").getContext('2d');
			ctx.drawImage($.id("anim_cover"),0,0);
			$.set("anim_cover", {autoAlpha:0});
			$.set("loader", {autoAlpha:0});
			$.set("anim_move", {x:0, y:0});
			optimizedResize.add(resize);
			$.set("cover", {autoAlpha:0});

			
			document.addEventListener('touchstart', handleTouchStart, false);        
			document.addEventListener('touchmove', handleTouchMove, false);
			document.addEventListener('touchend', handleTouchEnd, false);

			$.id("mail").innerHTML = "d"+String.fromCharCode(64)+"dfree.co.uk";
			$.id("mail").addEventListener('click', gotoMail, false);
			$.id("name").addEventListener('click', gotoMail, false);
			$.set("name", {cursor:"pointer"});
			$.id("linkedin").addEventListener('click', gotoLink, false);
			$.id("footer").addEventListener('click', gotoLink, false);

			loadScript("src/create.js", scriptReady);
			
		}();
		function loadScript(url, callback){

		    var script = document.createElement("script")
		    script.type = "text/javascript";

		    if (script.readyState){  //IE
		        script.onreadystatechange = function(){
		            if (script.readyState == "loaded" ||
		                    script.readyState == "complete"){
		                script.onreadystatechange = null;
		                callback();
		            }
		        };
		    } else {  //Others
		        script.onload = function(){
		            callback();
		        };
		    }

		    script.src = url;
		    document.getElementsByTagName("head")[0].appendChild(script);
		}

		function scriptReady(){
			loaded_script_num++;
			if(loaded_script_num == 1){
				loadScript("anim/anim.js?1530707933021", scriptReady);
			}
			if(loaded_script_num == 2){
				loadScript("js/adobe.js", scriptReady);
			}
		}
		function gotoLink(){
			openInNewTab("https://www.linkedin.com/in/davidszucs/");
		}
		function gotoMail(){
			openInNewTab("mailto:d"+String.fromCharCode(64)+"dfree.co.uk?subject=Hello%20there!");
		}
		function openInNewTab(url) {
		 	window.open(url, '_blank');		
		}
		function start() {

			// menu
			createMenu();

			for (var i = 0; i < menu_num; i++) {
				var from = "left";
				switch(i){
					case 0:
						from = "right";
					break;
					case 1:
						from = "bottom";
					break;
					case 2:
						from = "top";
					break;
					case 3:
						from = "left";
					break;
					case 4:
						from = "right";
					break;
					case 5:
						from = "top";
					break;
					case 6:
						from = "left";
					break;
					case 7:
						from = "bottom";
					break;
				}
				createMask(i);
				masks["m_"+i].from = from;
				$.set("stage_"+i, {autoAlpha:0});
				var from = "top";
			
			}
			
			$.set("footer", {zIndex:10});

			window.requestAnimationFrame(tick_helper);

		}

		function intro(){

			$.from("anim", 1, {alpha:0, ease:Sine.easeIn});
			$.from("name", 1, {delay:0.4, alpha:0, ease:Sine.easeIn});
			$.from("title", 1, {delay:0.6, alpha:0, ease:Sine.easeIn});
			$.set("anim", {left:-($.id("anim")._gsTransform.x-W/2)-anim_size/2, top:-($.id("anim")._gsTransform.y-H/2)-anim_size/2});
			$.set("menu", {alpha:0});
			$.tween("loader", 1, {delay:1.8, autoAlpha:0.3, ease:Sine.easeInOut});
			loader_on = true;
		}

		var loader_prop = {num_0:10, num_1:10, act_num_0:0, act_num_1:0};
		var loader_frame_skipper = false;
		function loaderTick(){
			var str = "";
			loader_prop.act_num_0 = loader_prop.act_num_1 = 0;
			for(var i = 0; i < loader_prop.num_0 + loader_prop.num_1; i++){
				var add;
				if(loader_prop.act_num_0 >= loader_prop.num_0){
					add = 1;
				}else if(loader_prop.act_num_1 >= loader_prop.num_1){
					add = 0;
				}else{
					add = Math.random() < 0.5 ? 0 : 1;
				}
				if(add){
					loader_prop.act_num_1++;
				}else{
					loader_prop.act_num_0++;
				}
				str += add;
			}
			if(!loader_frame_skipper){
				document.getElementById("loader").innerHTML = str;
			}
			loader_frame_skipper = !loader_frame_skipper;
			
		}
		function intro_outro(){
			$.tween("anim", 0.8, {delay:0.4, left:0, top:0, ease:Power1.easeInOut});
			if(act_size == "mobile"){
				$.tween("anim_move", 0.8, {delay:0.4+0.06, y:font_ratio*mobile_adjust[act], ease:Power1.easeInOut});
			}
			$.tween("menu", 0.8, {delay:0.8, alpha:1, ease:Sine.easeOut});
			TweenMax.killTweensOf($.id("loader"));
			$.tween("loader", 0.6, {delay:0, autoAlpha:0, ease:Sine.easeInOut, onComplete:function(){loader_on = false}});

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
			$.set("grid", {width:W, height:H});
			

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
				$.set("anim_move", {y:font_ratio*mobile_adjust[act]});
			}else{
				$.set("anim_move", {y:0});
			}
			

			var grid_x = grid[act_size].grid_start.x*W;
			var grid_y = grid[act_size].grid_start.y*H;

			var anim_width = grid[act_size].anim_pos.x*W;
			var title_width = act_size == "mobile" ? grid[act_size].grid_size.width*W*2+grid[act_size].grid_gap.width*W : 700;

			var _w = W*grid[act_size].anim_pos.width;
			var _h = H*grid[act_size].anim_pos.height;
			anim_size = _w/_h >= _h/_w ? _h : _w;
			anim_size = anim_size*grid[act_size].anim_pos.scale > anim_max_size ? anim_max_size : anim_size*grid[act_size].anim_pos.scale;
			anim_x = grid[act_size].anim_pos.x*W+grid[act_size].anim_pos.width*W/2-anim_size/2;
			anim_y = grid[act_size].anim_pos.y*H+grid[act_size].anim_pos.height*H/2-anim_size/2;

			if(act_size == "mobile"){

			}

			$.set("anim", {	zIndex:10,
							x:anim_x, 
							y:anim_y
						});
		
			$.set("canvas", {width:anim_size, height:anim_size});

			var row;
			var col;
			var elem;

			for (var r=0; r < grid.count.row; r++) {
				row = $.class("r_"+r);
				for(var e = 0; e < row.length; e++){
					var _r = r;//-1 < 0 ? 0 : r-1;
					var _height = row[e].classList.contains("double") ? (grid[act_size].grid_size.height*H*2)+grid[act_size].grid_gap.height : grid[act_size].grid_size.height*H;
					var _y = grid_y+grid[act_size].grid_size.height*H*_r+grid[act_size].grid_gap.height*H*r;
					_y = act_size == "mobile" && r == 4 ? mobile_footer_pos*H : _y;
					$.set(row[e], {y:_y, 
								height:_height
					});
				}
			}
			for (var c=0; c < grid.count.col; c++) {
				col = $.class("c_"+c);
				for(var e = 0; e < col.length; e++){
					var _width, _x;
					switch(c){
						case 0:
							_width = grid[act_size].grid_size.width*W*2+grid[act_size].grid_gap.width*W;
							_x = 0;
						break;
						case 1:
							_width = grid[act_size].grid_size.width*W;
							_x = 0;
						break;
						case 2:
							_width = grid[act_size].grid_size.width*W;
							_x = grid[act_size].grid_size.width*W+grid[act_size].grid_gap.width*W;
						break;
					}
					
					$.set(col[e], {x:grid_x+_x, width:_width});
				}
		    }

		    text_width = grid_x+grid[act_size].grid_size.width*W*2+grid[act_size].grid_gap.width*W*2;
		    var elements = $.class("stage");
			for (var i=0; i < elements.length; i++) {
			     $.set(elements[i], {fontSize:font_sizes[act_size].sml*font_ratio});
			}

		    elements = $.class("title");
			for (var i=0; i < elements.length; i++) {
			     $.set(elements[i], {width:title_width, fontSize:font_sizes[act_size].lrg*font_ratio});
			}
			elements = $.class("mid");
			for (var i=0; i < elements.length; i++) {
			     $.set(elements[i], {fontSize:font_sizes[act_size].mid*font_ratio});
			}

			elements = $.class("mask");
			for (let m in masks) {
			     $.set(masks[m].mask, {width:W, height:H});
			     if(masks[m].displayed){
			     	setActivePosition(masks[m]);
			     }else{
			     	$.set(masks[m].mask, {x:0, y:0});
			     }
			     positionMask(masks[m]);
			}

			$.set("menu", {zIndex:10, width:grid[act_size].menu.x*W, y:grid[act_size].menu.y*H, fontSize:font_sizes[act_size].mm*font_ratio});
			
			var loader_size = 600;
			$.set("loader", {fontSize:font_sizes[act_size].sml*font_ratio, x:W/2-loader_size/2, y:H*0.68, width:loader_size, height:0});

			/*$.set("logo", {zIndex:10, x:grid[act_size].logo.x*W, y:grid[act_size].logo.y*H});
			$.set("logo_img", {alpha:0.3, x:-grid[act_size].logo.width*font_ratio, y:-grid[act_size].logo.height*font_ratio, width:grid[act_size].logo.width*font_ratio, height:grid[act_size].logo.height*font_ratio});*/
			//console.log("resized "+W+" "+H);


		}


		/*
		*
		*	Menu staffer
		*
		*/


		var menu_time = 0.6;

		function newMenuHelper(num){
			anim_ready = true;
			wait_for_root = num;
		}
		function newMenu(num){

			anim_root.setNext(nextMenu);
			var move_delay = 0;

			if(num != act){
				if(act >= 0){
					$.tween("menu_"+act, menu_time, {alpha:menu_alpha_off});
					if(!isMaskClosing()){
						closeStage(act);
						closeAnim(act);
					}
				}else{
					intro_outro();
					$.delay(0.6, openStage, [num]);
					move_delay = 0.64;
				}
				
				if(act == 7){
					move_delay = 0.8;
				}

				act = num;
				//console.log("menu_"+act);
				//anim_root.move(act);
				$.tween("menu_"+act, 0, {delay:move_delay, onComplete:moveHelper, onCompleteParams:[act]});
				$.tween("menu_"+act, menu_time, {alpha:1});
				$.tween("menu_"+act, menu_time, {delay:!move_delay ? menu_time : move_delay, onComplete:allowNext});
				
			}
		}
		function moveHelper(num){
			anim_root.move(act);
			if(!skip_fist_adjust){
				if(act_size == "mobile"){
					if($.id("anim_move")._gsTransform.y != font_ratio*mobile_adjust[act]){
						$.tween("anim_move", 1.2, {delay:0.033, y:font_ratio*mobile_adjust[act], ease:Quint.easeInOut});
					}
				}else{
					if($.id("anim_move")._gsTransform.y != 0){
						$.tween("anim_move", 1.2, {delay:0.033, y:0, ease:Quint.easeInOut});
					}
				}
				
			}else{
				skip_fist_adjust = false;
			}
		}

		function createMenu(){
			
			for (var i = 0; i < menu_num; i++) {
				$.id("menu_"+i).addEventListener("click", menuClick);
				$.set("menu_"+i, {alpha:menu_alpha_off});
			}
		}

		function menuClick(e){
			newMenu(parseInt(e.target.id.split("_")[1]));
		}
		var next_allowed = true;
		function allowNext(){
			next_allowed = true;
		}
		function nextMenu(swipe){
			//console.log("next menu "+act+" targ: ");
			if(next_allowed){
				if(act < menu_num-1){
					next_allowed = false;
					if(swipe){
						masks["m_"+act].from = swipe == "left" ? "right" : "left";
						positionMask(masks["m_"+act]);
			     		setActivePosition(masks["m_"+act]);
			    		var o = masks["m_"+(act+1)];
						o.from = swipe;
			    		positionMask(o);

					}
					newMenu(act+1);
				}
			}
		}
		function prevMenu(swipe){
			if(next_allowed){
				if(act > 0){
					next_allowed = false;
					if(swipe){
						masks["m_"+act].from = swipe == "left" ? "right" : "left";

						positionMask(masks["m_"+act]);
						setActivePosition(masks["m_"+act]);
						var o = masks["m_"+(act-1)];
						o.from = swipe;
			    		positionMask(o);

					}
					newMenu(act-1);
				}
			}
		}


		/*
		*
		*	Stage staffer
		*
		*/


		function openStage(num){
			for (var i = 0; i < menu_num; i++) {
				if(num != i){
					$.set(masks["m_"+i].mask, {autoAlpha:0});
					$.set("stage_"+i, {autoAlpha:0});
					masks["m_"+i].displayed = false;
				}else{
					$.set(masks["m_"+i].mask, {zIndex:6, autoAlpha:1});
					$.set("stage_"+i, {zIndex:5, autoAlpha:1});
					masks["m_"+i].displayed = true;
					openMask(num, masks["m_"+num].from);
					if(num == 0 || num == 1 || num == 2 || num == 3 || num == 4 || num == 5 || num == 6 || num == 7){
						TweenMax.killDelayedCallsTo(openAnim);
						var d = anim_delay;
						if(closing_anim == 7){
							d = 1;
							//console.log("LONGG DELAY");
						}
						$.delay(d, openAnim, [num]);
					}
				}
			}
			tick();
		}

		function closeStage(num){
			$.set(masks["m_"+num].mask, {zIndex:4, autoAlpha:1});
			$.set("stage_"+num, {zIndex:3});
			closeMask(num);
		}
		function openAnim(num){
			if(num == act){
				masks["m_"+num].animated = true;
				if(anim_root.open){
					anim_root.open(num);
				}else{
					$.delay(1, openAnimHelper, [num]);
				}
			}
		}
		function openAnimHelper(num){
			anim_root.open(num);
		}
		function playAnim(){
			
		}

		var closing_anim = 0;

		function closeAnim(num){

			if(masks["m_"+num].animated){
				//console.log("close anim "+num);
				masks["m_"+num].animated = false;
				anim_root.close(num);
				closing_anim = num;
			}
		}


		/*
		*
		*	Mask stuff
		*
		*/


		function createMask(l){
				if(!master_mask){
					drawMask();
				}

				var m = document.createElement('div');
				m.classList.add("mask");
				m.id = "m_"+l
				$.id("grid").appendChild(m);
				$.set(m, {autoAlpha:0, pointerEvents: "none"});
				

				var mw = document.createElement('div');
				mw.classList.add("mask_wrap");
				$.set(mw, {x:0, y:0});
				m.appendChild(mw);

				var mc = document.createElement('div');
				mc.classList.add("mask_cover");
				mw.appendChild(mc);

				var i = document.createElement('img');
				i.id = "i_"+l;
				i.classList.add("mask_img");
				mw.appendChild(i);
				
				
				$.set(i, {alpha:1, width:mask_size.width, height:mask_size.height});
				var dataUrl = master_mask.toDataURL();
				i.src = dataUrl;

				masks["m_"+l] = {num:l, stage:$.id("stage_"+l), mask:m, wrap:mw, cover:mc, img:i, active:"", pos:0, from:"", animated:false};
				positionMask(l);

		}

		function drawMask(){
			master_mask = document.createElement('canvas');
			master_mask.width = mask_size.width;
			master_mask.height = mask_size.height;

			var area = mask_dot_area;

			var ctx = master_mask.getContext('2d');
			var step_num = {
				x:Math.round(mask_size.width/area),
				y:Math.round(mask_size.height/area)
			}

			ctx.beginPath();
			ctx.rect(0, 0, mask_size.width, mask_size.height);
			ctx.fillStyle = "#A21212";
			ctx.fill();
			var gap = 0;

			for (var h = 0; h < step_num.x; h++){
				for (var v = 0; v < step_num.y; v++){
					var size = area*0.7*(v/step_num.y)*(v/step_num.y);
					//var size = Math.sqrt(size*size);
					gap = v%2 ? 0 : area/2;
					DrawCircle(
						ctx,
						gap+h*area,
						v*area,
						size
					)
				}
			}

			ctx.globalCompositeOperation = 'destination-out';
			ctx.beginPath();
			
			ctx.rect(0,mask_size.height-20,mask_size.width,20);
			ctx.fillStyle = "#FFFFFF";
			ctx.fill();

			ctx.save();
		}
		function DrawCircle(ctx, x, y, radius){
			ctx.globalCompositeOperation = 'destination-out';
			ctx.beginPath();
			
			ctx.arc(x, y, radius, 0, Math.PI * 2, true);
			ctx.fillStyle = "#FFFFFF";
			ctx.fill();
		}

		function openMask(num, from){

			//console.log("openMask "+num);

			$.set(masks["m_"+num].wrap, {x:0, y:0});
			masks["m_"+num].from = from;
			masks["m_"+num].active = "open";
			positionMask(masks["m_"+num]);
			if(masks["m_"+num].from == "left"){
				$.set(masks["m_"+num].wrap, {x:text_width-W});
			}
			
		}
		function positionMask(m){
			//console.log(m);
			switch(m.from){
				case "top":
					$.set(m.img, {y:H, transformOrigin:"0 0"});
				break;
				case "right":
					$.set(m.img, {rotation:90, x:1, y:0, transformOrigin:"0 0"});//-mask_size.height
				break;
				case "bottom":
					$.set(m.img, {rotation:180, x:mask_size.width, y:0, transformOrigin:"0 0"});
				break;
				case "left":
					$.set(m.img, {rotation:270, x:W, y:H, transformOrigin:"0 0"});
					
				break;
			}
		}
		function setActivePosition(m){
			switch(m.from){
				case "top":
					$.set(m.wrap, {x:0, y:-H-mask_size.height});
				break;
				case "right":
					$.set(m.wrap, {x:text_width+mask_size.height, y:0});
				break;
				case "bottom":
					$.set(m.wrap, {x:0, y:H+mask_size.height});
				break;
				case "left":
					$.set(m.wrap, {x:-W-mask_size.height, y:0});
				break;
			}
		}
		function closeMask(num){
			masks["m_"+num].active = "close";
			var from = masks["m_"+num].from;
		}



		var ticker = 0;
		var mask_stepper = 4;
		function tick_helper(){
			if(anim_ready && !anim_inited && anim_init){
				anim_inited = true;
				anim_init();
			}
			if(wait_for_root != -1 && anim_root && anim_root.setNext && anim_root.open){
				anim_root.open(-1);
				wait_for_root = -1;
			}
			// anim.js increase firstframe in the root twice with registerAnimFrame(); (first anim loaded, second when images loaded)
			if(firstframe == 2 && act < 0){
				newMenu(0);
			}
			if(loader_on){
				loaderTick();
			}
			tick();
			window.requestAnimationFrame(tick_helper);
		}
		function tick(){
			ticker++;
			

			if(ticker > 1){
				ticker = 0;
				for (let m in masks){
					if(masks[m].active != ""){
						var dir = 1;
						var ready_to_close;
						var opened;
						if(masks[m].active == "close"){
							dir = -1;
						}
						switch(masks[m].from){
							case "top":
								$.set(masks[m].wrap, {y:masks[m].wrap._gsTransform.y-mask_dot_area*mask_stepper*dir});
								if((dir > 0 && masks[m].wrap._gsTransform.y < -H-mask_size.height) || ( dir < 0 && masks[m].wrap._gsTransform.y >= 0)){
									if(masks[m].active == "close"){
										ready_to_close = masks[m];
									}else{
										opened = masks[m];
									}
									masks[m].active = "";
								}
							break;
							case "right":
								$.set(masks[m].wrap, {x:masks[m].wrap._gsTransform.x+mask_dot_area*mask_stepper*dir});
								if((dir > 0 && masks[m].wrap._gsTransform.x > text_width+mask_size.height) || ( dir < 0 && masks[m].wrap._gsTransform.x <= 0)){
									if(masks[m].active == "close"){
										ready_to_close = masks[m];
									}else{
										opened = masks[m];
									}
									masks[m].active = "";
								}
							break;
							case "bottom":
								$.set(masks[m].wrap, {y:masks[m].wrap._gsTransform.y+mask_dot_area*mask_stepper*dir});
								if((dir > 0 && masks[m].wrap._gsTransform.y > H+mask_size.height) || ( dir < 0 && masks[m].wrap._gsTransform.y <= 0)){
									if(masks[m].active == "close"){
										ready_to_close = masks[m];
									}else{
										opened = masks[m];
									}
									masks[m].active = "";
								}
							break;
							case "left":
								$.set(masks[m].wrap, {x:masks[m].wrap._gsTransform.x-mask_dot_area*mask_stepper*dir});
								if((dir > 0 && masks[m].wrap._gsTransform.x < -W-mask_size.height) || ( dir < 0 && masks[m].wrap._gsTransform.x >= text_width-W)){
									if(masks[m].active == "close"){
										ready_to_close = masks[m];
									}else{
										opened = masks[m];
									}
									masks[m].active = "";
								}
							break;
						}
						if(ready_to_close){
							openStage(act);
							if(act != ready_to_close.num){
								
								//$.set(ready_to_close.stage, {autoAlpha:0});
								//$.set(ready_to_close.mask, {autoAlpha:0});
							}
						}
						if(opened){
							$.set(opened.mask, {autoAlpha:0});
						}
					}
				}
			}
		}
		function isMaskClosing(){
			for (let m in masks) {
				if(masks[m].active == "close"){
					return true;
				}
			}
			return false;
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
			            nextMenu("left");
			        } else {
			            prevMenu("right");
			        }                       
			    }
			    xDown = null;
			    yDown = null;   
		    }                                          
		};
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