(function ($) {
	window.onload = function(e) {
		var init;

		var W = 600;
		var H = 400;

		var rectPoints = [
			{x:10, y:10},
			{x:110, y:10},
			{x:110, y:110},
			{x:10, y:110},
		];
		var rectPointsArray = [];
		var polyPoints = [
			{x:20, y:20},
			{x:40, y:20},
			{x:40, y:40},
			{x:20, y:40},
			{x:20+60, y:20+60},
			{x:40+60, y:20+60},
			{x:40+60, y:40+60},
			{x:20+60, y:40+60},
			{x:70, y:70},
			{x:60, y:60},
			{x:50, y:50},
		];
		var dragged = -1;
		var offset;
		init = function() {
			TweenPlugin.activate([CSSPlugin]);
			$.id("wrapper").style.display = "block";
			reset();
		}();

		

		function reset() {
			offset = {x:$.id("wrapper").offsetLeft, y: $.id("wrapper").offsetTop};
			document.addEventListener("mouseup", mouseUp);
			document.addEventListener("mousemove", mouseMove, false);
			rectPoints.forEach((point, i) => {
				var elem = $.create("corner_"+i, "box", {x:point.x, y:point.y});
				elem.classList.add("corner");
				elem.addEventListener("mousedown", mouseDown);
				rectPointsArray.push(point.x);
				rectPointsArray.push(point.y);
			});
			polyPoints.forEach((point, i) => {
				var elem = $.create("poly_"+i, "box", {x:point.x, y:point.y});
				elem.classList.add("poly");
			});
		};
		
		function mouseDown(e){
			dragged = parseInt(e.currentTarget.id.split("_")[1]);
		};
		function mouseUp(e){
			dragged = -1;
		};
		function mouseMove(e){
			if(dragged >= 0){
				$.set("corner_"+dragged, {x:e.clientX-offset.x, y:e.clientY-offset.y});
				renderPoly();
			}

		};

		function renderPoly(){
			var rectTran = [];
			rectPoints.forEach((c, i) => {
				rectTran.push($.id("corner_"+i)._gsTransform.x);
				rectTran.push($.id("corner_"+i)._gsTransform.y);
			});
			var perspectiveTran = PerspT(rectTran, rectPointsArray);
			polyPoints.forEach((point, i) => {
				var new_point = perspectiveTran.transformInverse(point.x, point.y);
				$.set("poly_"+i, {x:new_point[0], y:new_point[1]});
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
		return TweenLite.from(typeof name === 'string' ? this.id(name) : name, time, props);
	},
	tween: function(name, time, props){
		return TweenLite.to(typeof name === 'string' ? this.id(name) : name, time, props);
	},
	set: function(name, props){
		return TweenLite.set(typeof name === 'string' ? this.id(name) : name, props);
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
		return TweenLite.killTweensOf(typeof name === 'string' ? this.id(name) : name);
	}
});