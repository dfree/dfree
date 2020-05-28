(function () {
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
				buttons.style = 'position:absolute;left:50%;top:50%;opacity:0.6;';
				parent.appendChild(wrapper);
				parent.appendChild(buttons);
				for(var i = 0; i < setup.length; i++){
					var setting = setup[i];
					var element = {};
					element.id = setting.id;

					element.slice = document.createElement('div');
					element.slice.style = 
						'position:absolute;left:'+(-slice.width/2)+'px;top:0;width:'+slice.width+'px;height:'+slice.height+'px;'+
						'transform:rotate('+(rota * i)+'deg);'+
						'transform-origin:50% 0%;mask-image:url(wheel/img/mask.svg);-webkit-mask-image:url(wheel/img/mask.svg);'//clip-path: polygon(50% 0%, -10% 100%, 110% 100%);-webkit-clip-path: polygon(50% 0%, -10% 100%, 110% 100%);';

					element.container = document.createElement('div');
					element.container.style = 
						'position:absolute;left:'+container.x+'px;top:'+container.y+'px;cursor:pointer;'+
						'transform-origin:0px 0px;transform:rotate('+(-rota * i)+'deg);';
					element.videoHolder = document.createElement('div');
					element.videoHolder.style = 'position:absolute;left:'+(-setting.width/2)+'px;top:'+(-setting.height/2)+'px;width:'+setting.width+'px;height:'+setting.height+'px;overflow:hidden;';
					element.video = document.createElement('video');
					element.video.id = setting.id;
					element.video.muted = 'true';
					element.video.class = 'video-js';
					element.video.loop = true;
					element.video.poster = setting.img;
					
					element.source = document.createElement('source');
					element.source.setAttribute('src', setting.video+'.mp4');

					videos[setting.id] = element.video;
					
					element.button = document.createElement('object');
					element.button.data = 'wheel/img/mask.svg';
					element.button.type = 'image/svg+xml';
					element.button.id = setting.id+"_button";
					element.button.style = 
						'position:absolute;left:'+(-slice.width/2)+'px;top:0;width:'+slice.width+'px;height:'+slice.height+'px;'+
						'transform-origin:50% 0%;transform:scale(1, 0.713);'
					element.video.appendChild(element.source);
					element.container.appendChild(element.videoHolder);
					element.videoHolder.appendChild(element.video);
					element.slice.appendChild(element.container);
					
					var buttonBranch = document.createElement('div');
					buttonBranch.style = 'transform:rotate('+(rota * i)+'deg);';
					var buttonContainer = document.createElement('div');
					buttonContainer.style = 'transform:scale(1, 1.4);'
					var containerRota = document.createElement('div');
					containerRota.style = 'position:absolute;width:'+slice.height+'px;height:'+slice.height+'px;'+
						'transform-origin:0px 0px; transform:rotate(45deg);overflow:hidden;';
						var svgRota = document.createElement('div');
					svgRota.style = 'position:absolute;'+
						'transform-origin:0px 0px; transform:rotate(-45deg);';
					svgRota.appendChild(element.button);
					containerRota.appendChild(svgRota);
					buttonContainer.appendChild(containerRota);
					buttonBranch.appendChild(buttonContainer);
					buttons.appendChild(buttonBranch);
					wrapper.appendChild(element.slice);

					elements.push(element);

					element.button.onload = function(e){
						var path = e.currentTarget.contentDocument.documentElement.firstElementChild;
						path.id = e.currentTarget.id+'_shape';
						path.addEventListener('mouseover', function(e){ startVideo(e.target.id.split('_')[0]) });
						path.addEventListener('mouseout', function(e){ stopVideo(e.target.id.split('_')[0]) });

						path.addEventListener('touchstart', function(e){ startVideo(e.target.id.split('_')[0]) });
						path.addEventListener('touchend', function(e){ stopVideo(e.target.id.split('_')[0]) });
					};
				}
				requestAnimationFrame(setupVideojs)
			}
		}

		function setupVideojs() {
			for(var i = 0; i < elements.length; i++){
				//videojs(elements[i].id);
			}
		}
		function startVideo(id) {
			console.log('start_'+id)
			videos[id].play();
		}

		function stopVideo(id) {
			console.log('stop_'+id)
			videos[id].pause();
		}

		init();
	};
})();