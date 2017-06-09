window.addEventListener("load", init);
function init() {
    var stage = new createjs.Stage("nikutaro");
    var beef = new createjs.Bitmap("./assets/images/beef.jpg");
    stage.addChild(beef);
    beef.x = (640 - 346) / 2; //後でちゃんと指定します。
    beef.y = (480 - 230) / 2;
    stage.update();
}
