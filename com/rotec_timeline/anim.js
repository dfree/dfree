(function ($) {
	window.onload = function(e) {
		
		var full_months = 0;
		var colors = ["#ef5350","#ec407a","#9a519f","#775ba6","#5e6ab1","#569fd7","#43b3e6","#35c1d6","#24a699","#66bb6a","#9bcb65","#d3e059","#feed57","#ffcb28","#faa628","#f26f46"];
		var list = ["a/","b/","c/","d/","e/","f/","g/","h/","i/","j/","k/","l/","m/","n/","o/"];
		var line_height = 16;
		var thick_height = 50;
		var gap = 5;
		var start_y = 30;
		var side_gap = 30;
		var top_gap = 120;
		var finish_gap = 214;
		var animated = false;

		var border = "10px 10px 10px 0px";

		function over(e) {
			e = e || window.event;
			var id = e.currentTarget.id.split("_");
		   	anim_one(id[1]+"_"+id[2]);
		}
		function out(e) {
		    e = e || window.event;
			var id = e.currentTarget.id.split("_");
		    release_one(id[1]+"_"+id[2]);
		}

		init = function() {
			TweenPlugin.activate([CSSPlugin]);
			banner = $.id("banner");
			$.create("canvas", "body");
			$.create("container", "canvas");
			$.id("canvas").style.display = "block";
			$.set("canvas", {alpha:0})
			$.tween("canvas", 0.6, {alpha:1, ease: setInterval.easeOut});
			build();
			resize();
			window.onresize = resize;
		}();

		function build() {
			for(var i = 0; i < setup.length; i++){
				full_months += setup[i].months;
			}
			$.create("main_title", "canvas", {y:30, fontSize:32, textAlign:"center"});
			$.id("main_title").innerHTML = title;

			for(var i = 0; i < setup.length; i++){
				setup[i].obj = $.create("mile_"+i, "container");
				setup[i].obj.innerHTML = '<span class="title" style="color:#42a046">'+setup[i].name+'</span><br/><span class="time">'+setup[i].time+'</span>';
				setup[i].details = $.create("miles_"+i, "container", {y:360, alpha:0});
				setup[i].details.innerHTML += '<span style="color:#42a046">'+setup[i].name+'</span> '+setup[i].time+'<br/><br/>';
				setup[i].details.className = "details";
				var pos = 0;

				for(var l = 0; l < setup[i].lines.length; l++){
					var color = setup[i].lines[l].color ? colors[setup[i].lines[l].color] : colors[l];
					var height = setup[i].lines[l].thick ? thick_height : line_height;
					var line = setup[i].lines[l].obj = $.create("line_"+i+"_"+l, "mile_"+i, {
						backgroundColor:color,
						height:height,
						y:start_y+pos,
						overflow:"hidden",
						color:"#efefef",
						paddingTop:2,
						borderRadius:border,
						cursor:"cell",
						userSelect:"none"
					});

					line.addEventListener("mouseenter", over);
					
					line.addEventListener("mouseleave", out);


					pos += (height+gap);
					line.className = "line";
					line.innerHTML = '<span class="tooltip" style="margin-left:1px;"> &nbsp'+list[l]+'</span>';
					setup[i].details.innerHTML += '<p id="detail_'+i+'_'+l+'" style="margin-bottom:5px;"><span class="list_item" style="color:'+color+'">'+list[l]+'</span> <span id="txt_'+i+'_'+l+'">'+setup[i].lines[l].name+'</span></p>';
					
				}
				setup[i].fin = $.create("fin_"+i, "mile_"+i, {textAlign:"right", verticalAlign: "bottom", y:finish_gap, height: 27, color:"#FF00000"});
				setup[i].fin.innerHTML = '<span class="finish">'+setup[i].finish+'</span>';
				setup[i].end_line = $.create("end_line_"+i, "mile_"+i, {width:2, height:240, backgroundColor:setup[i].finish != "" ? "#FF0000" : "rgba(0, 0, 0, 0)"});
				
				$.delay(0.1, setup_txt);
				
			}
		};
		function setup_txt(){
			for(var i = 0; i < setup.length; i++){
				for(var l = 0; l < setup[i].lines.length; l++){
					$.set("txt_"+i+"_"+l, {lineHeight: 1.2});
					$.tween(setup[i].details, 0.8, {delay: 1.5+i*0.1, alpha:1});
					$.id("txt_"+i+"_"+l).addEventListener("mouseenter", over);
					$.id("txt_"+i+"_"+l).addEventListener("mouseleave", out);
				}
			}
		}
		function resize(){
			var W = $.id("canvas").offsetWidth-2*side_gap;
			var H = $.id("canvas").offsetHeight;
			$.set("main_title", {width:W});
			$.set("container", {x:side_gap, y:top_gap, width:W, height:H/2});

			var mile_start = 0;
			var details_start = 0;
			var details_width = W/setup.length;

			for(var i = 0; i < setup.length; i++){
				var width = W/full_months*setup[i].months;
				
				$.set(setup[i].obj, {x:mile_start, width:width});
				
				$.set(setup[i].details, {x:details_start, width:details_width-50});
				$.set(setup[i].fin, { width:width-3});
				$.set(setup[i].end_line, {x:width});

				for(var l = 0; l < setup[i].lines.length; l++){

					var x = width*(setup[i].lines[l].start/100)+6;
					var w = width*((setup[i].lines[l].end - setup[i].lines[l].start)/100)-10;
					
					$.set(setup[i].lines[l].obj, {x:x, width:w});
				}
				mile_start += width;
				details_start += details_width+10;
			}

		}
		if(!animated){
			animated = true;
			anim();
		}
	}
	function anim(){
		for(var i = 0; i < setup.length; i++){
			for(var l = 0; l < setup[i].lines.length; l++){

				$.from(setup[i].lines[l].obj, 1, {width:0, delay:i*0.2, ease:Power2.easeInOut});
			}
		}
	}
	function anim_one(id){
		$.tween("line_"+id, 0.35, {zIndex: 1, boxShadow: "0px 0px 2px rgba(255,255,255,0.85), 4px 3px 9px rgba(0,0,0,0.4)", ease:Power1.easeOut});
		$.tween("txt_"+id, 0.3, {fontWeight: 500, color:"#000000", ease:Power1.easeOut});
	}
	function release_one(id){
		// colors is a duplicate from the root... sorry about it :P
		var colors = ["#ef5350","#ec407a","#9a519f","#775ba6","#5e6ab1","#569fd7","#43b3e6","#35c1d6","#24a699","#66bb6a","#9bcb65","#d3e059","#feed57","#ffcb28","#faa628","#f26f46"];
		var _id = id.split("_");
		var color = colors[setup[parseInt(_id[0])].lines[parseInt(_id[1])].color];

		$.tween("line_"+id, 0.36, {zIndex: 0, boxShadow: "none", ease:Power1.easeOut});
		$.tween("txt_"+id, 0.3, {color:"#666666", ease:Power1.easeOut});
	}
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
	},
	rand: function(arr){
		return arr[0]+(arr[1]-arr[0])*Math.random();
	}
});