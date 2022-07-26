const imageUploaded = document.getElementById("image")
const imgElement = document.getElementById('canvas-image');

// Initialising Canvas
const canvas = new fabric.Canvas('canvas', {
    width: 600,
    height: 600,
});

// Centering image after upload
canvas.viewportTransform = [1, 0, 0, 1, canvas.getHeight() / 2, canvas.getWidth() / 2];

// reference for image object
let img;

// initialises canvas with image uploaded
function setPreview(event) {
    if (event.target.files.length > 0) {
        var src = URL.createObjectURL(event.target.files[0]);
        imgElement.src = src;
        imgElement.style.display = "block";
    }
    fabric.Image.fromURL(imgElement.src, function (oImg) {
        oImg.set('originX', 'center');
        oImg.set('originY', 'center');
        canvas.add(oImg);
        // store the reference of image object
        img = oImg
    });
}

canvas.on('mouse:wheel', function (opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) { // Max zoom in to 20x
        zoom = 20
    };
    if (zoom < 1) { // Max zoom out to original size (1x)
        zoom = 1;
    }

    // accesing coordinates of viewport to calculate center
    const vptCoords = canvas.vptCoords;
    if (delta > 0) { // In case of zooming out shift to center
        const centerX = (vptCoords.bl.x + vptCoords.br.x) / 2;
        const centerY = (vptCoords.bl.y + vptCoords.br.y) / 2;
        if (zoom < 1.5) {
            // centers image when image zooms out close to original size
            img.viewportCenter();
        }
        canvas.zoomToPoint({ x: centerX, y: centerY }, zoom);
    }
    else { // zoom to point where mouse points
        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    }
    opt.e.preventDefault();
    opt.e.stopPropagation();
    canvas.renderAll();
});
