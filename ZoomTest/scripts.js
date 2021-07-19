let init =  () => {
    document.getElementById('content').style.transform = 'matrix(0.2, 0, 0, 0.2, 0, 0)';
    document.getElementById('largeImage').addEventListener('click', (e) => {
        let div = document.getElementById('polygons').appendChild(document.createElement('div'));
        div.style.transform = 'matrix(1, 0, 0, 1, '+(e.offsetX-25)+', '+(e.offsetY-25)+')';
        div.classList.add('poly');
        TweenMax.to('#content',1.2, {delay:0.4, scale:Math.random()*0.8+0.2, ease:Power3.easeInOut, transformOrigin:"0 0"});

    });
}

