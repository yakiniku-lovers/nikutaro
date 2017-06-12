"use strict";

var Nikutaro = (function() {
    var _score = 0;
    var _quizId = 0;
    var _quizCount = 0;
    var _customerSkinId = 0;
    var _remainSec = 0;
    var _extendTimeGage = 0;
    var _questions = new Array();
    var _alreadyCorrected = false;
    return {
        QUESTS: Object.freeze([ 
            "Neck","Shoulder","Tombi","Misuji","ShoulderLoin","RibLoin",
            "Sirloin","Fillet","Bara","Uchimomo","Shintama","Sotomomo","Lampu",
            "Ichibo","Sune","ShoulderBara"
        ]),
        SCENES: Object.freeze({
            start: 0,
            game: 1,
            result: 2
        }),
        JP_QUESTS : Object.freeze({
            Neck: "ネック",
            Shoulder: "肩",
            Tombi: "トンビ",
            Misuji: "ミスジ",
            ShoulderLoin: "肩ロース",
            RibLoin: "リブロース",
            Sirloin: "サーロイン",
            Fillet: "ヒレ",
            Bara: "バラ",
            Uchimomo: "うちもも",
            Shintama: "しんたま",
            Sotomomo: "そともも",
            Lampu: "ランプ",
            Ichibo: "イチボ",
            Sune: "すね",
            ShoulderBara: "肩バラ"
        }),
        TRAPS: Object.freeze([
            "扁",
            "トンピ",
            "ミミズ",
            "扁ロース",
            "リプロース",
            "パラ",
            "砂ずり",
            "肩パラ",
            "セセリ",
            "胸肉",
            "ササミ",
            "手羽元",
            "手羽先",
            "サエズリ",
            "ハツ",
            "ヤゲン",
            "砂肝"
        ]),
        CONFIG: Object.freeze({
            NUM_OF_QUIZ_PER_LEVEL_UP: 10,
            NUM_OF_CUSTOMER: 8,
            NUM_OF_EXTEND_TIME: 5,
            TIME_OF_EXTEND_BY_SEC: 5,
            TIME_LIMIT_BY_SEC: 30,
        }),

        // 解答した部位が正しいかどうかを返す

        // 正解したときのスコア処理

        // 不正解したときのスコア処理

        // 連続して正解したら時間が伸びるやつ

        // 問題の出題

        // 

    }
}());

var Status = {
    score: 0,
    quizId: 0,
    quizCount: 0,
    customerSkinId: 0,
    remainSec: 0,
    extendTimeGage: 0,
    questions: new Array(),
    alreadyCorrected: false,
};

var stage, w, h, loader;
var beef, balloon, questionText, niku, questions, scene, ha;
var customer = new Array();
var circleGage = new Array();

window.addEventListener("load", init); 

// 一番初めに呼ばれる関数
function init() { 
    createjs.Ticker.setFPS(60);
    
    stage = new createjs.Stage("nikutaro");
    w = stage.canvas.width;
    h = stage.canvas.height;
    
    var manifest = [
        {src: "beef.png", id: "beef"},
        {src: "niku.png", id: "niku"},
        {src: "balloon.png", id: "balloon"},
        {src: "repeat.png", id: "repeat"},
        {src: "ha.png", id: "ha"}
    ];
    
    for(var i = 0; i < Nikutaro.CONFIG.NUM_OF_CUSTOMER; i++) {
        manifest.push({src: "customer"+i+".png", id: "customer"+i});
    }

    for(var i = 0; i < Nikutaro.QUESTS.length; i++) {
        manifest.push({src: "beef_parts/"+Nikutaro.QUESTS[i]+".png", id: Nikutaro.QUESTS[i]});
    }
    
    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest, true, "./assets/images/");
    
    createjs.Sound.registerSound("./assets/sounds/mowmow.mp3", "mowmow");
    createjs.Sound.registerSound("./assets/sounds/mow.mp3", "mow");
    createjs.Sound.registerSound("./assets/sounds/bgm.mp3", "bgm");
    createjs.Sound.registerSound("./assets/sounds/result.mp3", "result");
    createjs.Sound.registerSound("./assets/sounds/sen_ge_panchi11.mp3", "ha-sound");
    createjs.Sound.registerSound("./assets/sounds/count-down.mp3", "countDown");
    createjs.Sound.registerSound("./assets/sounds/start.mp3", "start");
}



// *******************   EventListener   *******************

// ロード完了時に呼ばれる関数
function handleComplete() {
    scene = Nikutaro.SCENES.start;
    
    var logoText = new createjs.Text("精肉屋さん肉太郎", "60px Arial", "#C92525");
    logoText.x = w * 0.5;
    logoText.y = h * 0.2;
    setCentering(logoText);

    var descriptionText = new createjs.Text("お客さんが注文する部位をクリックしてください。\n部位が存在しなければ「は？」と言って大丈夫です。", "20px Arial", "#000000");
    descriptionText.lineHeight = 40;
    descriptionText.textAlign = "center";
    descriptionText.x = w * 0.5;
    descriptionText.y = h * 0.55;
    descriptionText.regY = descriptionText.getBounds().height / 2;

    var startText = new createjs.Text("画面クリックでスタート", "40px Arial", "#105099");
    startText.x = w * 0.5;
    startText.y = h * 0.8;
    setCentering(startText);
    createjs.Tween.get(startText, {loop:true})
            .to({alpha: 0}, 1000)
            .to({alpha: 1}, 1000);
    
    var backRect = new createjs.Shape();
    backRect.graphics.beginFill("#FFFFFF").drawRect(0, 0, w, h);
    backRect.addEventListener("click", countDown);
    
    stage.addChild(backRect);
    stage.addChild(logoText);
    stage.addChild(descriptionText);
    stage.addChild(startText);
    
    createjs.Ticker.addEventListener("tick", tick);
}

// スタートボタンを押したときに呼ばれる関数
function countDown() {
    stage.removeAllChildren();
    var countDownText = new createjs.Text("3", "100px Arial", "#C92525");
    countDownText.x = w * 0.5;
    countDownText.y = h * 0.5;
    setCentering(countDownText);
    stage.addChild(countDownText);
    createjs.Tween.get(countDownText)
        .call(countDownSound)
        .wait(1000)
        .to({text: "2"})
        .call(countDownSound)
        .wait(1000)
        .to({text: "1"})
        .call(countDownSound)
        .wait(1000)
        .call(gameStart);
}

// 時間経過による再描画時に呼ばれる
function tick(event) {
    if(scene == Nikutaro.SCENES.game) {
        scoreText.text = "Score: " + Status.score;
        scoreText.regX = scoreText.getBounds().width;
        scoreText.regY = scoreText.getBounds().height;
        scoreText.x = w - 15;
        scoreText.y = 30;
    }
    
    stage.update(event);
}

// 牛の部位をクリックしたときに呼ばれる
function clickBeefParts(event, i) {
    if (i == Status.questions[Status.quizId]){
        if (Status.alreadyCorrected == false){
            Status.score += 10;
            Status.extendTimeGage += 1;
            Status.alreadyCorrected = true;
            
            if (Status.questions[Status.quizId] >= 0){
                createjs.Sound.play("mow");
                createjs.Tween.get(niku)
                    .to({x: customer[Status.customerSkinId].x-100, y: customer[Status.customerSkinId].y-50}, 120)
                    .call(function (){
                        createjs.Tween.get(customer[Status.customerSkinId]).to({x: 0}, 200);
                    })
                    .to({x: w * 0.5 ,y: h*0.6})
                    .wait(120)
                    .call(nextProblem);
            } else {
                createjs.Sound.play("ha-sound");
                nextProblem(true);
            }
        }
    } else {
        Status.extendTimeGage = 0;
        createjs.Sound.play("mowmow");  
        Status.score -= 50;
    }
    checkExtendTimeGage();
}


// ***************************************************

var scoreText;

// カウントダウンが終わったら呼ばれる
function gameStart() {
    scene = Nikutaro.SCENES.game;
    stage.removeAllChildren();
    
    for(var i = 0; i < Nikutaro.CONFIG.NUM_OF_CUSTOMER; i++) {
        customer[i] = new createjs.Bitmap(loader.getResult("customer" + i));
    }
    
    problemInit();

    niku = new createjs.Bitmap(loader.getResult("niku"));
    niku.x = w * 0.5;
    niku.y = h * 0.6;
    stage.addChild(niku);
    
    beef = new createjs.Bitmap(loader.getResult("beef"));
    setCentering(beef);
    beef.x = w * 0.5;
    beef.y = h * 0.7;
    
    for (var i = 0; i < Nikutaro.QUESTS.length; i++) {
        (function(i, stage){
            var part = new createjs.Bitmap(loader.getResult(Nikutaro.QUESTS[i]));
            part.regX = beef.getBounds().width / 2;
            part.regY = beef.getBounds().height / 2;
            part.x = w * 0.5;
            part.y = h * 0.7;
            stage.addChild(part);
            part.addEventListener("click", function(event){
                clickBeefParts(event, i);
            });
        })(i, stage);
    }
    
    scoreText = new createjs.Text("", "20px Arial", "#000000");

    for (var i = 0; i < Nikutaro.CONFIG.NUM_OF_EXTEND_TIME; i++) {
        circleGage[i] = new createjs.Shape();
        circleGage[i].graphics.beginFill("#FF0000").drawCircle(90 + i * 25, 12, 10);
        circleGage[i].alpha = 0.2;
        stage.addChild(circleGage[i]);
    }
    
    var ppc = new createjs.PlayPropsConfig().set({loop: -1, volume: 0.4})
    createjs.Sound.play("bgm", ppc);
    createjs.Sound.play("start");
    
    startShowTimer(Nikutaro.CONFIG.TIME_LIMIT_BY_SEC);
    
    stage.addChild(scoreText);
    stage.addChild(beef);
}

// ゲームが始まったときに呼ばれる
function problemInit() {
    Status.questions = generateProblem(Nikutaro.CONFIG.NUM_OF_QUIZ_PER_LEVEL_UP);
    
    for(var i = 0; i < Nikutaro.CONFIG.NUM_OF_CUSTOMER; i++) {
        customer[i].scaleX = 0.2;
        customer[i].scaleY = 0.2;
        setCentering(customer[i]);
        customer[i].y = h * 0.2 + 50;
        stage.addChild(customer[i]);
    }
    
    balloon = new createjs.Bitmap(loader.getResult("balloon"));
    balloon.scaleX = 0.8;
    balloon.scaleY = 0.8;
    setCentering(balloon);
    balloon.x = w * 0.4;
    balloon.y = h * 0.15 + 50;
    
    ha = new createjs.Bitmap(loader.getResult("ha"));
    ha.hitArea = new createjs.Shape();
    ha.hitArea.graphics.beginFill("#FFFFFF").drawRect(0, 0, 128, 128);
    ha.scaleX = 0.8;
    ha.scaleY = 0.8;
    setCentering(ha);
    ha.x = w * 0.12;
    ha.y = h * 0.8;
    ha.addEventListener('click', function(event){
        createjs.Tween.get(event.target)
            .to({scaleX: 1.2, scaleY: 1.2, rotation: 20}, 100)
            .to({scaleX: 0.8, scaleY: 0.8, rotation: 0}, 100);
        clickBeefParts(event, -1);
    });
    
    questionText = new createjs.Text("", "40px Arial", "#000000");
    questionText.x = w * 0.37;
    questionText.y = h * 0.15 + 50;
    
    stage.addChild(balloon);
    stage.addChild(questionText);
    stage.addChild(ha);
    
    nextProblem();
}


// カウントダウンの音を鳴らす
function countDownSound() {
    createjs.Sound.play("countDown");
}

// 連続して正解したら時間が伸びるやつの処理
function checkExtendTimeGage() {
    for(var i = 0; i < Nikutaro.CONFIG.NUM_OF_EXTEND_TIME; i++) {
        if(i < Status.extendTimeGage) {
            circleGage[i].alpha = 1;
        } else {
            circleGage[i].alpha = 0.2;            
        }
    }

    if(Status.extendTimeGage == 5) {
        var interval = 200;
        Status.extendTimeGage = 0;
        Status.remainSec += Nikutaro.CONFIG.TIME_OF_EXTEND_BY_SEC * 10;
        for(var i = 0; i < Nikutaro.CONFIG.NUM_OF_EXTEND_TIME; i++) {
             createjs.Tween.get(circleGage[i])
                .to({alpha: 0.2}, interval)
                .to({alpha: 1.0}, interval)
                .to({alpha: 0.2}, interval)
                .to({alpha: 1.0}, interval)
                .to({alpha: 0.2}, interval);
        }
    }
}

function nextProblem(no_change_customer) {
    Status.quizId++;
    Status.quizCount++;
    Status.alreadyCorrected = false;
    
    if (no_change_customer != true){
        Status.customerSkinId = (Status.customerSkinId + 1) % Nikutaro.CONFIG.NUM_OF_CUSTOMER;
    }
    
    if(Status.quizId >= Nikutaro.CONFIG.NUM_OF_QUIZ_PER_LEVEL_UP) {
        Status.questions = generateProblem(Nikutaro.CONFIG.NUM_OF_QUIZ_PER_LEVEL_UP);
        Status.quizId = 0;
    }
    
    if (no_change_customer != true){
        for(var i = 0; i < Nikutaro.CONFIG.NUM_OF_CUSTOMER; i++) {
            if(i == Status.customerSkinId) {
                customer[i].x = w * 0.8 + 200;
                customer[i].visible = true;
                createjs.Tween.get(customer[i]).to({x:w * 0.8}, 200, createjs.Ease.cubicOut)
            } else {
                customer[i].visible = false;
            }
        }
    }
    
    if (Math.random() < Math.atan(Status.quizCount / 10) / (Math.PI / 2) * 0.2 && Status.quizCount >= 5){
        questionText.text = Nikutaro.TRAPS[Math.floor(Math.random() * Nikutaro.TRAPS.length)];
        Status.questions[Status.quizId] = -1;
    } else {
        questionText.text = Nikutaro.JP_QUESTS[Nikutaro.QUESTS[Status.questions[Status.quizId]]];
    }
    setCentering(questionText);
    questionText.y = h * 0.15 + 60;
    questionText.alpha = 0;
    
    createjs.Tween.get(questionText).to({alpha: 1, y: h * 0.15 + 50}, 300, createjs.Ease.cubicOut);
}

function generateProblem(num) {
    var problems = new Array();
    for (var i = 0 ; i < num; i++){
        var rand = Math.floor(Math.random() * Nikutaro.QUESTS.length);
        problems.push(rand);
    }
    return problems;
}

var passageId;
var timerText;

function updateTimer() {
    timerText.text = (Status.remainSec / 10).toFixed(1);
    
    if(Status.remainSec <= 0.0){
        stopTimer();
    }
    
    Status.remainSec--;
}

function startShowTimer(timeLimitBySec) {
    Status.remainSec = timeLimitBySec * 10;
    
    timerText = new createjs.Text("", "24px sans-serif", "DarkRed");
    timerText.text = Status.remainSec / 10;
    timerText.regY = timerText.getBounds().height / 2;
    timerText.x = 15;
    timerText.y = 25;
    
    passageId = setInterval('updateTimer()', 100);
    
    stage.addChild(timerText);
}

function stopTimer(){
    clearInterval(passageId);
    
    //write next scene
    createjs.Sound.stop("bgm");
    
    stage.removeAllChildren();
    scene = Nikutaro.SCENES.result;
    
    var resultText = new createjs.Text(Status.score+"点", "100px Arial", "#105099");
    resultText.x = w * 0.5;
    resultText.y = h * 0.35;
    setCentering(resultText);

    createjs.Sound.play("result");

    var tweetButton = new createjs.Text("ツイートする", "25px Arial", "#FFFFFF");
    tweetButton.x = w/2 + 110;
    tweetButton.y = h * 0.7;
    setCentering(tweetButton);

    var tweetRect = new createjs.Shape();
    tweetRect.graphics.beginFill("#1DA1F2").drawRect(tweetButton.x-100, tweetButton.y-25, 190, 50);
    tweetRect.addEventListener("click", jumpTwitter);
    stage.addChild(tweetRect);
    stage.addChild(tweetButton);
    
    stage.addChild(resultText);

    var repeat = new createjs.Bitmap(loader.getResult("repeat"));
    repeat.hitArea = new createjs.Shape();
    repeat.hitArea.graphics.beginFill("#FFFFFF").drawRect(repeat.x, repeat.y, repeat.getBounds().width, repeat.getBounds().height);
    repeat.regY = repeat.getBounds().height / 2;
    repeat.y = h * 0.7;
    repeat.x = 150;
    repeat.scaleX = 0.8;
    repeat.scaleY = 0.8;
    repeat.addEventListener("click",jumpStart);
    stage.addChild(repeat);
}

function jumpTwitter(event) {
    window.open("https://twitter.com/intent/tweet?hashtags=%E7%B2%BE%E8%82%89%E5%B1%8B%E3%81%95%E3%82%93%E8%82%89%E5%A4%AA%E9%83%8E&ref_src=twsrc%5Etfw&text="+Status.score+"%E7%82%B9%E3%82%92%E5%8F%96%E3%81%A3%E3%81%A6%E3%82%84%E3%81%A3%E3%81%9F%E3%81%9C%EF%BC%81&tw_p=tweetbutton");
}

function jumpStart(event) {
    window.location.href = 'index.html';
}

function setCentering(object) {
    object.regX = object.getBounds().width / 2;
    object.regY = object.getBounds().height / 2;
}
