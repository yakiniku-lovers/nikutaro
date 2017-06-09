var stage, w, h, loader;
var beef;
window.addEventListener("load", init); 

function init() { 
    stage = new createjs.Stage("nikutaro");
    w = stage.canvas.width;
    h = stage.canvas.height;

    var manifest = [
        {src: "beef.jpg", id: "beef"}
    ];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest, true, "./assets/images/");
    createjs.Sound.registerSound("./assets/sounds/mowmow.mp3", "mowmow");
}

function handleComplete() {
    beef = new createjs.Bitmap(loader.getResult("beef"));
    beef.regX = beef.getBounds().width / 2;
    beef.regY = beef.getBounds().height / 2;
    beef.x = w * 0.5;
    beef.y = h * 0.7;

    stage.addChild(beef);
    beef.addEventListener("click", sayMoo);
    createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
	stage.update(event);
}

function sayMoo(event){
    // "mowmow"は後でconstに追加
	createjs.Sound.play("mowmow");
}
