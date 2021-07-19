(function () {
	window.onload = function(e) {
		var DEMO = true;
		var parent = document.getElementById('wheel');
		var scaleContainer = document.createElement('div');
		var video_size = 520;
		var slice = {width: 520, height: 450};
		var container = {x:slice.width/2, y:270};
		var rota = 72;
		var originalSize = 900;
		var elements = [];
		var videos = {};
		var links = {};
		function init() {
			console.log(parent.dataset.config)
			var setup = JSON.parse(parent.dataset.config).setup;
			var root = JSON.parse(parent.dataset.config).asset_root;
			if(parent){
				wrapper = document.createElement('div');
				var buttons = document.createElement('div');
				wrapper.style = 'position:absolute;pointer-events:none;';
				buttons.style = 'position:absolute;opacity:0.1;';
				scaleContainer.appendChild(buttons);
				scaleContainer.appendChild(wrapper);
				parent.appendChild(scaleContainer);
				
				for(var i = 0; i < setup.length; i++){
					var setting = setup[i];
					var element = {};
					element.id = setting.id;

					element.slice = document.createElement('div');
					element.slice.style = 
						'position:absolute;left:'+(-slice.width/2)+'px;top:0;width:'+slice.width+'px;height:'+slice.height+'px;'+
						'transform:rotate('+(rota * i)+'deg);'+
						'transform-origin:50% 0%;mask-image:url('+root+'img/mask.svg);-webkit-mask-image:url('+root+'img/mask.svg);'

					element.container = document.createElement('div');
					element.container.style = 
						'position:absolute;left:'+container.x+'px;top:'+container.y+'px;cursor:pointer;'+
						'transform:rotate('+(-rota * i)+'deg);';

					var videoX = setting.x || 0;
					var videoY = setting.y || 0;

					element.videoHolder = document.createElement('div');
					element.videoHolder.style = 'position:absolute;left:'+(-setting.width/2+videoX)+'px;top:'+(-setting.height/2+videoY)+'px;width:'+setting.width+'px;height:'+setting.height+'px;overflow:hidden;';
					element.video = document.createElement('video');
					element.video.id = setting.id;
					element.video.muted = 'true';
					element.video.class = 'video-js';
					element.video.loop = true;
					element.video.preload = 'auto';
					element.video.playsInline = true;
					element.video.poster = root+setting.img;
					element.source = document.createElement('source');
					if(setting.video && !DEMO){
						element.source.setAttribute('src', root+setting.video+'.mp4');
					}

					videos[setting.id] = element.video;
					links[setting.id] = setting.link;

					element.video.appendChild(element.source);
					element.container.appendChild(element.videoHolder);
					element.videoHolder.appendChild(element.video);
					element.slice.appendChild(element.container);

					element.button = document.createElement('object');
					element.button.data = ''+root+'img/mask.svg';
					element.button.id = setting.id+"_button";
					element.button.style = 
						'position:absolute;left:'+(-slice.width/2)+'px;top:0;width:'+slice.width+'px;height:'+slice.height+'px;'+
						'transform-origin:50% 0%;transform:scale(1, 0.713);'
					
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
						path.style='cursor:pointer;';
						path.id = e.currentTarget.id+'_shape';
						path.addEventListener('mouseover', function(e){ startVideo(e.target.id.split('_')[0]); });
						path.addEventListener('mouseout', function(e){ stopVideo(e.target.id.split('_')[0]); });
						path.addEventListener('click', function(e){ 
							stopVideo(e.target.id.split('_')[0]); 
							clickThrough(e.target.id.split('_')[0]);
						});
						path.addEventListener('touchstart', function(e){ 
							e.preventDefault(); 
							startVideo(e.target.id.split('_')[0]);
						});
						path.addEventListener('touchend', function(e){
							e.preventDefault(); 
							stopVideo(e.target.id.split('_')[0]);
							clickThrough(e.target.id.split('_')[0]);
						});
					};
				}
				window.addEventListener('resize', resize);
				resize();
			}
		}
		function resize() {
			var bounds = parent.getBoundingClientRect();
			var scale = bounds.width < bounds.height ? bounds.width / originalSize : bounds.height / originalSize;
			scaleContainer.style = 'position:absolute;left:50%;top:50%;transform:scale('+scale+')';

		}
		function startVideo(id) {
			if(!DEMO){
				videos[id].play();
			}
		}

		function stopVideo(id) {
			if(!DEMO){
				videos[id].pause();
			}
		}

		function clickThrough(id) {
			console.log(links)
			if(links[id]){
				location.href = links[id];
			}
		}
		init();
	};
})();