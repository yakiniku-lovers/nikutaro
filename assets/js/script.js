var stage, w, h;
window.addEventListener("load", init); 

function init() { 
    stage = new createjs.Stage("nikutaro");
    w = stage.canvas.width;
    h = stage.canvas.height;

    var beef = new createjs.Bitmap("./assets/images/beef.jpg");
    stage.addChild(beef);
    beef.regX = beef.getBounds().width / 2;
    beef.regY = beef.getBounds().height / 2;
    beef.x = w * 0.5;
    beef.y = h * 0.7;

    createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
	stage.update(event);
}
