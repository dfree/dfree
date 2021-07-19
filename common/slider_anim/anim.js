(function ($) {
	window.onload = function(e) {
		var init;
		var W = 300;
		var H = 300;

		var slider;

		var scales = [0.7, 16];
		var origin = [W/2, H/2];
		var targetOrigin = [110.5, 124.2];

		var layers =[
			{name:"layer_0", fade:0},
			{name:"layer_1", fade:0.2},
			{name:"layer_2", fade:0.4},
			{name:"layer_3", fade:0.6},
			{name:"layer_4", fade:0.8},
		];
		var originOffset = 10;
		var fade_amount = 0.2;
		init = function() {
			reset();
		}();

		

		function reset() {
			slider = document.getElementById("slider");
			slider.value = 0;
			slider.addEventListener("input", scaleGraphics);
			layers.forEach((curr, i) => {
				curr.on = false;
				$.set(layers[i].name, {alpha:fade_amount});
			});
			scaleGraphics();
		};

		function scaleGraphics() {
			var ratio = slider.value / 100;
			var t_time = 0.6;
			layers.forEach((curr, i) => {
				if(i === layers.length - 1){
					if(ratio >= layers[i].fade && !layers[i].on){

						layers[i].on = true;
						$.tween(layers[i].name, t_time, {alpha:1, ease:Power2.easeInOut});
					}
					if(ratio < layers[i].fade && layers[i].on){
						layers[i].on = false;
						$.tween(layers[i].name, t_time, {alpha:fade_amount, ease:Power2.easeInOut});
					}
				}else{
					if(ratio >= layers[i].fade && ratio < layers[i + 1].fade && !layers[i].on){
						layers[i].on = true;
						$.tween(layers[i].name, t_time, {alpha:1, ease:Power2.easeInOut});
					}
					if((ratio < layers[i].fade || ratio > layers[i + 1].fade) && layers[i].on){
						layers[i].on = false;
						$.tween(layers[i].name, t_time, {alpha:fade_amount, ease:Power2.easeInOut});
					}
				}
				
			});
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
	kill: function(name){
		return TweenLite.killTweensOf(typeof name === "string" ? this.id(name) : name);
	}
});