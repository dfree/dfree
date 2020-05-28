(function ($) {
	window.onload = function(e) {
		var parent = document.getElementById('wheel');
		var video_size = 520;
		var slice = {width: 520, height: 450};
		var container = {x:slice.width/2, y:270};
		var rota = 72;

		var setup = [
			{id: 'water', video: 'wheel/videos/water', img: 'wheel/img/water.jpg', width: video_size, height: video_size},
			{id: 'water2', video: 'wheel/videos/water', img: 'wheel/img/water.jpg', width: video_size, height: video_size},
			{id: 'water3', video: 'wheel/videos/water', img: 'wheel/img/water.jpg', width: video_size, height: video_size},
			{id: 'water4', video: 'wheel/videos/water', img: 'wheel/img/water.jpg', width: video_size, height: video_size},
			{id: 'water5', video: 'wheel/videos/water', img: 'wheel/img/water.jpg', width: video_size, height: video_size},
		];
		var elements = [];
		var videos = {};

		function init() {
			if(parent){
				var wrapper = document.createElement('div');
				var buttons = document.createElement('div');
				wrapper.style = 'position:absolute;left:50%;top:50%;pointer-events:none;';
				buttons.style = 'position:absolute;left:50%;top:50%;';
				parent.appendChild(buttons);
				parent.appendChild(wrapper);

				for(var i = 0; i < setup.length; i++){
					var setting = setup[i];
					var element = {};
					element.id = setting.id;

					element.slice = document.createElement('div');
					element.slice.style = 
						'position:absolute;left:'+(-slice.width/2)+'px;top:0;width:'+slice.width+'px;height:'+slice.height+'px;'+
						'transform:rotate('+(rota * i)+'deg);'+
						'transform-origin:50% 0%;mask-image:url(wheel/img/mask.svg);-webkit-mask-image:url(wheel/img/mask.svg);';

					element.container = document.createElement('div');
					element.container.style = 
						'position:absolute;left:'+container.x+'px;top:'+container.y+'px;cursor:pointer;'+
						'transform-origin:0px 0px;transform:rotate('+(-rota * i)+'deg);';

					element.video = document.createElement('video');
					element.video.id = setting.id;
					element.video.muted = 'true';
					element.video.class = 'video-js';
					element.video.loop = true;
					element.video.style = 
						'transform:translate(-50%, -50%);';
					element.source = document.createElement('source');
					element.source.setAttribute('src', setting.video+'.mp4');

					videos[setting.id] = element.video;

					element.button = document.createElement('object');
					element.button.data = 'wheel/img/mask.svg';
					element.button.type = 'image/svg+xml';
					element.button.id = setting.id+"_button";
					element.button.style = 
						'position:absolute;left:'+(-slice.width/2)+'px;top:0;width:'+slice.width+'px;height:'+slice.height+'px;'+
						'transform:rotate('+(rota * i)+'deg);'+
						'transform-origin:50% 0%;border:1px solid black, clip-path: polygon(50% 0%, -10% 100%, 110% 100%);-webkit-clip-path: polygon(50% 0%, -10% 100%, 110% 100%);'
					element.video.appendChild(element.source);
					element.container.appendChild(element.video);
					element.slice.appendChild(element.container);
					buttons.appendChild(element.button);
					wrapper.appendChild(element.slice);

					elements.push(element);

					element.button.onload = function(e){
						var path = e.currentTarget.contentDocument.documentElement.firstElementChild;
						path.id = e.currentTarget.id+'_shape'
						path.addEventListener('mouseenter', function(e){ startVideo(e.target.id.split('_')[0]) })
						path.addEventListener('mouseleave', function(e){ stopVideo(e.target.id.split('_')[0]) });
					};
				}
			}
			requestAnimationFrame(setupPlayers);
		}

		function startVideo(id) {
			videos[id].play();
		}

		function stopVideo(id) {
			videos[id].pause();
		}

		init();
	};
})({
	id: function(name){
		return document.getElementById(name);
	},
});