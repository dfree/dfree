var init = function () {
    reset();
}

function reset() {
    document.getElementById('largeImage').addEventListener('click', clicked);
}

function clicked(e){
    var div = document.createElement("div");
    div.classList.add("poly");
    div.style.transform = 'matrix(1, 0, 0, 1, '+(e.offsetX-50)+', '+(e.offsetY-50)+')';
    var poly = document.getElementById('polygons').appendChild(div);
}
