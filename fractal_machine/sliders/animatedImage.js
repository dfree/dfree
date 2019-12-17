const animatedImage = (data) => {
	let global = {};
	let {width:W, height:H, parent, autofill} = data;
	global.imageURL = '';
	let imageSize = {width:0, height:0};
	let image = new Image();
	let forceWidth = 0;

	const crop = {y:100, height:80, scale:1.16};

	const random = (a,b) => {
		return Math.random()*(b-a)+a;
	}

	image.onload = (e) => global.drawImage(image);

	global.canvas = document.createElement('canvas');
	global.ctx = global.canvas.getContext('2d');

	document.getElementById(parent).appendChild(global.canvas);

	global.canvas.addEventListener('mousemove', (e) => {
		crop.y = e.offsetY-crop.height;
		window.requestAnimationFrame(() => global.drawImage(image))
	});
	global.canvas.addEventListener('mouseover', (e) => {
		crop.scale = random(0.9, 1.16);

	});
	global.init = () => {
		global.canvas.width = W;
		global.canvas.height = H;
		global.ctx.fillStyle = '#FF0000';
		global.draw();
	}

	global.resize = ({x, y, width, height}) => {
		global.canvas.style.transform = 'matrix(1,0,0,1,'+x+','+y+')';
		W = global.canvas.width = global.canvas.style.width = width;
		H = global.canvas.height = global.canvas.style.height = height;
		//global.draw();
	}

	global.draw = () => {
		global.ctx.clearRect(0, 0, W, H);
		global.ctx.fillStyle = '#FF0000';
		global.ctx.rect(0, 0, W, H);
		global.ctx.fill();
	}

	global.drawImage = (img) => {
		
		global.ctx.clearRect(0, 0, W, H);

		// global.draw();
		imageSize = {
			width: img.naturalWidth,
			height: img.naturalHeight,
		};
		
		const imageWidth = forceWidth ? forceWidth : autofill ? W : imageSize.width;
		const ratio = imageWidth / imageSize.width;
		const centered = H/2-(ratio * imageSize.height / 2);

		global.ctx.drawImage(img, W/2-imageWidth/2, centered, imageWidth, ratio * imageSize.height);
		//global.ctx.globalCompositeOperation = 'multiply';
		
		global.ctx.clearRect(0, crop.y+crop.height/2*(1/crop.scale), W, crop.height);
		global.ctx.drawImage(img, 
			W/2*(imageSize.width / W)-W/2*(imageSize.width / W)*(1/crop.scale), (-centered+crop.y+crop.height/2)*(imageSize.width / imageWidth), imageSize.width * (1/crop.scale), imageSize.width / imageWidth * crop.height*(1/crop.scale), // *(1/crop.scale)
			W/2-imageWidth/2*crop.scale, crop.y+crop.height/2*(1/crop.scale), imageWidth*crop.scale, crop.height
		); // img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
		

		//console.log('drawn');
		//global.ctx.rect(0, 0, W, H);
		//global.ctx.fill();
	}

	global.setImage = (url, width = 0) => {forceWidth = width; image.src = global.imageURL = url;}

	global.init();
	return global;
}