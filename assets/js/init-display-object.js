"use strict";


// ******************** SCENE START ********************

function initLogoText() {
    var obj = new createjs.Text("精肉屋さん肉太郎", "60px Arial", "#C92525");
    obj.x = w * 0.5;
    obj.y = h * 0.2;
    setCentering(obj);

    return obj;
}

function initDescriptionText() {
    var obj = new createjs.Text("お客さんが注文する部位をクリックしてください。\n部位が存在しなければ「は？」と言って大丈夫です。", "20px Arial", "#000000");
    obj.lineHeight = 40;
    obj.textAlign = "center";
    obj.x = w * 0.5;
    obj.y = h * 0.55;
    obj.regY = obj.getBounds().height / 2;

    return obj;
}

function initStartText() {
    var obj = new createjs.Text("画面クリックでスタート", "40px Arial", "#105099");
    obj.x = w * 0.5;
    obj.y = h * 0.8;
    setCentering(obj);

    return obj;
}

function initBackRect() {
    var obj = new createjs.Shape();
    obj.graphics.beginFill("#FFFFFF").drawRect(0, 0, w, h);

    return obj;
}

function initCountDownText() {
    var obj = new createjs.Text("3", "100px Arial", "#C92525");
    obj.x = w * 0.5;
    obj.y = h * 0.5;
    setCentering(obj);

    return obj;
}


// ******************** SCENE GAME ********************
 
function initNiku() {
    var obj = new createjs.Bitmap(loader.getResult("niku"));
    obj.x = w * 0.5;
    obj.y = h * 0.6;

    return obj;
}

function initBeef() {
    var obj = new createjs.Bitmap(loader.getResult("beef"));
    setCentering(obj);
    obj.x = w * 0.5;
    obj.y = h * 0.7;

    return obj;
}

function initPart(part_name) {
    var obj = new createjs.Bitmap(loader.getResult(part_name));
    setCentering(obj);
    obj.x = w * 0.5;
    obj.y = h * 0.7;

    return obj;
}

function initScoreText() {
    var obj = new createjs.Text("Score: hoge", "20px Arial", "#000000");
    obj.regX = obj.getBounds().width;
    obj.regY = obj.getBounds().height;
    obj.x = w - 15;
    obj.y = 30;

    return obj;
}

function initCustomer(num) {
    var obj = new createjs.Bitmap(loader.getResult("customer" + num));
    obj.scaleX = 0.2;
    obj.scaleY = 0.2;
    setCentering(obj);
    obj.y = h * 0.2 + 50;

    return obj;
}

function initCircleGage(num) {
    var obj = new createjs.Shape();
    obj.graphics.beginFill("#FF0000").drawCircle(90 + num * 25, 23, 10);
    obj.alpha = 0.2;

    return obj;
}

function initBalloon() {
    var obj = new createjs.Bitmap(loader.getResult("balloon"));
    obj.scaleX = 0.8;
    obj.scaleY = 0.8;
    setCentering(obj);
    obj.x = w * 0.4;
    obj.y = h * 0.15 + 50;

    return obj;
}

function initHa() {
    var obj = new createjs.Bitmap(loader.getResult("ha"));
    obj.hitArea = new createjs.Shape();
    obj.hitArea.graphics.beginFill("#FFFFFF").drawRect(0, 0, 128, 128);
    obj.scaleX = 0.8;
    obj.scaleY = 0.8;
    setCentering(obj);
    obj.x = w * 0.12;
    obj.y = h * 0.8;

    return obj;
}

function initQuestionText() {
    var obj = new createjs.Text("", "40px Arial", "#000000");
    obj.x = w * 0.37;
    obj.y = h * 0.15 + 50;

    return obj;
}


// ******************** SCENE RESULT ********************

function initTimerText() {
    var obj = new createjs.Text("", "24px sans-serif", "DarkRed");
    obj.text = Nikutaro.CONFIG.TIME_LIMIT_BY_SEC;
    obj.regY = obj.getBounds().height / 2;
    obj.x = 15;
    obj.y = 25;

    return obj;
}

function initResultText() {
    var obj = new createjs.Text(Status.score+"点", "100px Arial", "#105099");
    obj.x = w * 0.5;
    obj.y = h * 0.35;
    setCentering(obj);

    return obj;
}

function initTweetButton() {
    var obj = new createjs.Text("ツイートする", "25px Arial", "#FFFFFF");
    obj.x = w/2 + 110;
    obj.y = h * 0.7;
    setCentering(obj);

    return obj;
}

function initTweetRect() {
    var obj = new createjs.Shape();
    obj.graphics.beginFill("#1DA1F2").drawRect(w/2 + 10, h * 0.7 -25, 190, 50);

    return obj;
}

function initRepeat() {
    var obj = new createjs.Bitmap(loader.getResult("repeat"));
    obj.hitArea = new createjs.Shape();
    obj.hitArea.graphics.beginFill("#FFFFFF").drawRect(obj.x, obj.y, obj.getBounds().width, obj.getBounds().height);
    obj.regY = obj.getBounds().height / 2;
    obj.y = h * 0.7;
    obj.x = 150;
    obj.scaleX = 0.8;
    obj.scaleY = 0.8;

    return obj;
}

// ******************** COMMON ********************

function setCentering(object) {
    object.regX = object.getBounds().width / 2;
    object.regY = object.getBounds().height / 2;
}