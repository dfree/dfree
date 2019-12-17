const animatedImage = (data) => {
	let {width:W, height:H, parent, autofill} = data;
	let imageURL = '';
	let imageSize = {width:0, height:0};
	let image = new Image();
	let forceWidth = 0;

	const crop = {y:100, height:80, scale:1.1};

	image.onload = (e) => {console.log(e);drawImage(image)};

	this.canvas = document.createElement('canvas');
	this.ctx = canvas.getContext('2d');
	document.getElementById(parent).appendChild(canvas);

	canvas.addEventListener('mousemove', (e) => {
		crop.y = e.offsetY-crop.height;
		
		window.requestAnimationFrame(() => drawImage(image))
	});

	this.init = () => {
		canvas.width = W;
		canvas.height = H;
		ctx.fillStyle = '#FF0000';
		draw();
	}

	this.resize = ({x, y, width, height}) => {
		canvas.style.transform = 'matrix(1,0,0,1,'+x+','+y+')';
		W = canvas.width = canvas.style.width = width;
		H = canvas.height = canvas.style.height = height;
		draw();
	}

	this.draw = () => {
		ctx.clearRect(0, 0, W, H);
		ctx.fillStyle = '#FF0000';
		ctx.rect(0, 0, W, H);
		ctx.fill();
	}

	this.drawImage = (img) => {
		
		ctx.clearRect(0, 0, W, H);

		draw();

		imageSize = {
			width: img.naturalWidth,
			height: img.naturalHeight,
		};
		
		const imageWidth = forceWidth ? forceWidth : autofill ? W : imageSize.width;
		const ratio = imageWidth / imageSize.width;
		const centered = H/2-(ratio * imageSize.height / 2);

		ctx.drawImage(img, W/2-imageWidth/2, centered, imageWidth, ratio * imageSize.height);
		//ctx.globalCompositeOperation = 'multiply';

		ctx.drawImage(img, 
			W/2*(imageSize.width / W)-W/2*(imageSize.width / W)*(1/crop.scale), (-centered+crop.y+crop.height/2)*(imageSize.width / imageWidth), imageSize.width * (1/crop.scale), imageSize.width / imageWidth * crop.height*(1/crop.scale), // *(1/crop.scale)
			W/2-imageWidth/2*crop.scale, crop.y+crop.height/2*(1/crop.scale), imageWidth*crop.scale, crop.height
		); // img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
		console.log(img.naturalHeight);

		

		//console.log('drawn');
		//ctx.rect(0, 0, W, H);
		//ctx.fill();
	}

	this.setImage = (url, width = 0) => {forceWidth = width; image.src = imageURL = url;}

	init();
	return this;
}