(function ($) {
	window.onload = function(e) {
		var init;

		var W = 0;
		var H = 0;
		
		init = function() {
			TweenPlugin.activate([CSSPlugin]);
			$.id('content').style.display = 'block';
			reset();
			anim();
		}();

		function reset() {
			$.set('grad', {x:-document.documentElement.clientWidth});
			$.set('grad_2', {x:-document.documentElement.clientWidth});
			$.set('slogan', {alpha:0});
			$.set('separator', {alpha:0});
			$.set('cta', {alpha:0});
		};
		function anim() {
			$.tween('grad', 4.6, {x:document.documentElement.clientWidth, ease:Power1.easeOut, onComplete:function(){
				$.set('grad', {autoAlpha:0});
			}});
			$.delay(0.6, delayed);
		}
		function delayed() {
			$.tween('slogan', 1, {delay: 0.5, alpha:1, ease:Power1.easeInOut});
			$.tween('separator', 1, {delay: 0.9, alpha:1, ease:Power1.easeInOut});
			$.tween('cta', 2, {delay: 1.6, alpha:1, ease:Power1.easeInOut});
			$.tween('grad_2', 8, {delay:1.3, x:document.documentElement.clientWidth, ease:Power1.easeOut, onComplete:function(){
				$.set('grad_2', {autoAlpha:0});
			}});
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