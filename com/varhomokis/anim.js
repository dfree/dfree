(function ($) {
	window.onload = function(e) {
		var init;

		var W = 0;
		var H = 0;
		
		var cover = null;
		var ctx = null;

		var fractal = null;
		var fractal_ctx = null;

		var bg_color = '#f3f3f3';
		var shape_color = '#ff7b00';

		var size = {width:300, height:300};

		var resetValues = {
			branchRotation:{value:0},
			branchX:{value:-50},
			branchY:{value:-50},
			scale:{value:100},
			rotate:{value:0},
			moveX:{value:0},
			moveY:{value:0},
			transformOriginX:{value:0},
			transformOriginY:{value:0},
		};

		var settings = {
			branches:{
				name: 'Branches',
				value:8,
				edge:[1,30],
				type:'slider',
			},
			branchRotation:{
				name: 'Branch Rotation',
				value: null,
				type:'dynamic',
			},
			
			iteration:{
				name: 'Iteration',
				value:3,
				edge:[1,7],
				type:'slider',
			},
			size:{
				name: 'Scale',
				value: {...size},
				type:'input',
			},
			scale:{
				name: 'Scale',
				value:80,
				edge:[1,100],
				type:'slider',
				percent: true,
			},
			rotate:{
				name: 'Rotate',
				value:20,
				edge:[0, 360],
				type:'slider',
			},
			branchX:{
				name: 'Branch Shift X',
				value:0,
				edge:[-100, 100],
				type:'slider',
				percent: true,
			},
			branchY:{
				name: 'Branch Shift Y',
				value:0,
				edge:[-100, 100],
				type:'slider',
				percent: true,
			},
			moveX:{
				name: 'Move X',
				value:-80,
				edge:[-100, 100],
				type:'slider',
				percent: true,
			},
			moveY:{
				name: 'Move Y',
				value:0,
				edge:[-100, 100],
				type:'slider',
				percent: true,
			},
			transformOriginX:{
				name: 'Origin X',
				value:0,
				edge:[-100, 100],
				type:'slider',
				percent: true,
			},
			transformOriginY:{
				name: 'Origin Y',
				value:0,
				edge:[-100, 100],
				type:'slider',
				percent: true,
			},
		}
		var values = {};
		var template = null;

		var ratio = {value:0};

		var shortest = false;
		var clear = true;
		var tween_time = 0.6;

		init = function() {
			TweenPlugin.activate([CSSPlugin]);
			$.id('content').style.display = 'block';
			cover = $.id('cover');
			ctx = cover.getContext('2d');
			fractal = $.id('fractal');
			fractal_ctx = fractal.getContext('2d');
			fractal_ctx.save();
			template = $.id('template');
			setDimension();
			reset();
			createSettings();
			resize();
			window.addEventListener('resize', resize);
			document.addEventListener('keydown', getTogether);
			document.addEventListener('keyup', getFractal);
			if(shortest){
				$.tween(ratio, tween_time, {value:1, ease:Power1.easeInOut, onUpdate:drawCanvas, onComplete:()=>{zooming = false;}});
			}else{
				var keys = Object.keys(resetValues);
				for(var i = 0; i < keys.length; i++){
					$.tween(values[keys[i]], tween_time, {value:settings[keys[i]].value, ease:Power1.easeInOut, onUpdate:i ? drawCanvas : null, onComplete:()=>{zooming = false;}});
				}
			}
		}();

		function reset() {
			$.set('template', {display:'none'});
			$.set('content', {width:'100%', height:'100%', overflow:'hidden', background:bg_color});
			$.set('img', {display:'none', width:'100%', height:'auto', marginLeft: '50%', transform: 'translateX(-50%)', filter: 'blur(6px)'});
			var keys = Object.keys(settings);
			
			for(var i = 0; i < keys.length; i++){
				values[keys[i]] = {};
				values[keys[i]].value = !shortest ? resetValues[keys[i]] ? resetValues[keys[i]].value : settings[keys[i]].value : settings[keys[i]].value;
			};

			settings.branchRotation.value = 360/settings.branches.value;
			values.branchRotation.value = shortest ? 360/settings.branches.value : 0;
			// setBgColor('#f3f3f3');
		};

		var keyDown = false;
		var ease = Power1.easeOut;
		var zooming = false;

		function getTogether(e){
			if(e.code === 'Space' && !keyDown){
				keyDown = true;
				zooming = true;
				console.log('in');
				if(shortest){
					$.tween(ratio, tween_time, {value:0, ease:ease, onUpdate:drawCanvas, onComplete:()=>{zooming = false;}});
				}else{
					var keys = Object.keys(resetValues);
					for(var i = 0; i < keys.length; i++){
						$.tween(values[keys[i]], tween_time, {value:resetValues[keys[i]].value, ease:Power1.easeInOut, onUpdate:!i ? drawCanvas : null, onComplete:()=>{zooming = false;}});
					}
				}
			}
		};

		function getFractal(){
			if(keyDown){
				keyDown = false;
				zooming = true;
				console.log('out');
				if(shortest){
					$.tween(ratio, tween_time, {value:1, ease:ease, onUpdate:drawCanvas, onComplete:()=>{zooming = false;}});
				}else{
					var keys = Object.keys(resetValues);
					for(var i = 0; i < keys.length; i++){
						$.tween(values[keys[i]], tween_time, {value:settings[keys[i]].value, ease:Power1.easeInOut, onUpdate:!i ? drawCanvas : null, onComplete:()=>{zooming = false;}});
					}
				}
			}
		};
		
		
		function createSettings(){
			var keys = Object.keys(settings);
			for(var i = 0; i < keys.length; i++){
				var item = settings[keys[i]];
				if(item.type == 'slider'){
					settings[keys[i]].input = $.slider(keys[i], 'settings', item);
					settings[keys[i]].input.addEventListener('input', setSettings);
					settings[keys[i]].text = $.text(keys[i]+'_text', 'settings', item.name+': '+item.value);
				}
			}
			var check = $.text('check_text', 'settings', 'Change Movement');
			check.addEventListener('click', () => {shortest = !shortest});
			var check = $.text('clear_text', 'settings', 'Change Draw Methode');
			check.addEventListener('click', () => {clear = !clear});
		}

		function setSettings(e){
			var item = settings[e.currentTarget.id];
			item.value = e.currentTarget.value;
			$.tween(values[e.currentTarget.id], 0.6, {value:e.currentTarget.value, ease:Power2.easeOut, onUpdate:drawCanvas});
			item.text.innerHTML = item.name+': '+Math.floor(e.currentTarget.value)+' '+(item.percent ? '%' : '');
			values.branchRotation.value = settings.branchRotation.value = 360/settings.branches.value;
			drawCanvas();
		}


		function setDimension(){
			W = document.documentElement.clientWidth;
			H = document.documentElement.clientHeight;
		};

		function resize(){
			setDimension();
			cover.width = W;
			cover.height = H;
			fractal.width = W;
			fractal.height = H;
			drawCanvas();
		};

		function drawCanvas() {
			fractal_ctx.resetTransform();
			ctx.resetTransform();
			if(clear){
				fractal_ctx.clearRect(0, 0, W, H);
			}
			ctx.clearRect(0, 0, W, H);

			for(var i = 0; i < settings.branches.value; i++){
				drawBranch(values.branchRotation.value*i);
			}

			
			/* ctx.globalCompositeOperation = 'source-over';
			ctx.fillStyle = bg_color;
			ctx.rect(0, 0, W, H);
			ctx.fill();
			ctx.globalCompositeOperation = 'destination-out';
			ctx.drawImage(fractal, 0, 0); */
		}

		function drawBranch(rota) {
			fractal_ctx.resetTransform();
			fractal_ctx.fillStyle = '#FF0000';
			fractal_ctx.translate(W/2, H/2);
			fractal_ctx.rotate(rota * Math.PI / 180);
			fractal_ctx.translate(
				values.branchX.value/100 * values.size.value.width, 
				values.branchY.value/100 * values.size.value.height
			);
			var targetPos = {x: W/2-values.size.value.width/2, y: H/2-values.size.value.height/2}
			for(var i = 0; i < values.iteration.value; i++){
				if(shortest){
					var originMatrix = fractal_ctx.getTransform();
					var r = ratio.value;
					
					fractal_ctx.setTransform(
						1 + (originMatrix.a - 1) * r,
						originMatrix.b * r,
						originMatrix.c * r,
						1 + (originMatrix.d - 1) * r,
						targetPos.x + (originMatrix.e - targetPos.x) * r,
						targetPos.y + (originMatrix.f - targetPos.y) * r,
					);
				}

				fractal_ctx.drawImage(template, 0, 0, values.size.value.width, values.size.value.height);

				if(shortest){
					fractal_ctx.setTransform(originMatrix);
				};
				//fractal_ctx.fill();
				fractal_ctx.translate(
					-values.transformOriginX.value/100 * values.size.value.width, 
					-values.transformOriginY.value/100 * values.size.value.height
					);
				fractal_ctx.scale(values.scale.value/100, values.scale.value/100);
				fractal_ctx.rotate(values.rotate.value * Math.PI / 180);
				fractal_ctx.translate(
					values.moveX.value/100 * values.size.value.width, 
					values.moveY.value/100 * values.size.value.height,
					);
			}
		}
		function setBgColor(color){
			 bg_color = color;
		}


		function random(a,b){
			return Math.random()*(b-a)+a;
		}
	};
})({
	id: function(name){
		return document.getElementById(name);
	},
	delay: function(time, func, props){
		var prp = props || [];
		TweenLite.delayedCall(time, func, prp);
	},
	from: function(name, time, props){
		return TweenLite.from(typeof name === "string" ? this.id(name) : name, time, props);
	},
	tween: function(name, time, props){
		return TweenLite.to(typeof name === "string" ? this.id(name) : name, time, props);
	},
	set: function(name, props){
		return TweenLite.set(typeof name === "string" ? this.id(name) : name, props);
	},
	create: function(name, parent, props, src){
		var elem = document.createElement(src === "canvas" ? "canvas" : src ? "img" : "div");

		if(src === "canvas"){
			if(props.width){
				elem.width = props.width;
			}
			if(props.height){
				elem.height = props.height;
			}
		}
		if(src){
			elem.src = src;
		}
		elem.id = name;
		this.id(parent).appendChild(elem);
		props = props || {};
		this.set(elem, props);
		return elem;
	},
	text: function(name, parent, content){
		var text = document.createElement('p');
		text.id = name;
		text.innerHTML = content;
		text.classList.add("text");
		this.id(parent).appendChild(text);
		return text;
	},
	slider: function(name, parent, props){
		var slider = document.createElement('input');
		slider.id = name;
		slider.type = 'range';
		slider.min = props.edge[0];
		slider.max = props.edge[1];
		slider.value = props.value;
		slider.classList.add("slider");
		this.id(parent).appendChild(slider);
		return slider;
	},
	checkbox: function(name, parent, props){
		var slider = document.createElement('input');
		slider.id = name;
		slider.type = 'checkbox';
		slider.value = props.value;
		slider.classList.add("checkbox");
		this.id(parent).appendChild(slider);
		return slider;
	},
	kill: function(name){
		return TweenLite.killTweensOf(typeof name === "string" ? this.id(name) : name);
	}
});