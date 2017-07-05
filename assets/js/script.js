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
        isCorrectPart: function(part_num) {
            return (part_num == Status.questions[Status.quizId]);
        },

        getScore: function() {
            return Status.score;
        },

        // success, success_doubtは普通に正解したときとトラップを回避し正解したときのアニメーション(音声も含む)の処理を行う関数を引数とする。
        // 関数success, 関数success_doubtは引数に関数を持つ
        // それぞれの関数の処理の最後で引数の関数を実行しなければならない。
        // failureは不正解だったときのアニメーションの処理を行う関数を引数とする。
        anserJudge: function(part_num, success, success_doubt, failure) {
            if (this.isCorrectPart(part_num)) {
                if (Status.alreadyCorrected == false){
                    this.correctAnswer();
                    Status.alreadyCorrected = true;
            
                    if (Status.questions[Status.quizId] >= 0){
                        success(nextProblem.bind(this, false));
                    } else {
                        success_doubt(nextProblem.bind(this, true));
                    }
                }
            } else {
                failure();
                this.wrongAnswer();
            }
        },

        correctAnswer: function() {
            Status.score += 10;
            Status.extendTimeGage += 1;
        },

        wrongAnswer: function() {
            Status.score -= 50;
            Status.extendTimeGage = 0;   
        }
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

var stage = new createjs.Stage("nikutaro");;
var w = stage.canvas.width;
var h = stage.canvas.height;
var loader;
var questionText, niku, questions, scene;
var customer = new Array();
var circleGage = new Array();

window.addEventListener("load", init); 

// 一番初めに呼ばれる関数
function init() { 
    createjs.Ticker.setFPS(60);
    
    setImages();
    setSound();
}

function setImages() {
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
}

function setSound() {
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
    
    var logoText = initLogoText();
    var descriptionText = initDescriptionText();
    var startText = initStartText();
    createjs.Tween.get(startText, {loop:true})
            .to({alpha: 0}, 1000)
            .to({alpha: 1}, 1000);

    var backRect = initBackRect();
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
    var countDownText = initCountDownText();
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
    }
    
    stage.update(event);
}

// 牛の部位をクリックしたときに呼ばれる
function clickBeefParts(event, part_num) {
    Nikutaro.anserJudge(part_num,
        function success(callback) {
            createjs.Sound.play("mow");
            createjs.Tween.get(niku)
                .to({x: customer[Status.customerSkinId].x-100, y: customer[Status.customerSkinId].y-50}, 120)
                .call(function (){
                    createjs.Tween.get(customer[Status.customerSkinId]).to({x: 0}, 200);
                })
                .to({x: w * 0.5 ,y: h*0.6})
                .wait(120)
                .call(callback);
        }, 
        function success_doubt(callback) {
            createjs.Sound.play("ha-sound");
            callback();
        },
        function failure() {
            createjs.Sound.play("mowmow");
        }
    );

    checkExtendTimeGage();
}

// ***************************************************

var scoreText;

// カウントダウンが終わったら呼ばれる
function gameStart() {
    scene = Nikutaro.SCENES.game;
    stage.removeAllChildren();
    
    for(var i = 0; i < Nikutaro.CONFIG.NUM_OF_CUSTOMER; i++) {
        customer[i] = initCustomer(i);
        stage.addChild(customer[i]);
    }
    
    problemInit();

    niku = initNiku();
    stage.addChild(niku);
    
    var beef = initBeef();
    
    for (var i = 0; i < Nikutaro.QUESTS.length; i++) {
        (function(i, stage){
            var part = initPart(Nikutaro.QUESTS[i]);
            stage.addChild(part);
            part.addEventListener("click", function(event){
                clickBeefParts(event, i);
            });
        })(i, stage);
    }
    
    scoreText = initScoreText();

    for (var i = 0; i < Nikutaro.CONFIG.NUM_OF_EXTEND_TIME; i++) {
        circleGage[i] = initCircleGage(i);
        stage.addChild(circleGage[i]);
    }
    
    var ppc = new createjs.PlayPropsConfig().set({loop: -1, volume: 0.4})
    createjs.Sound.play("bgm", ppc);
    createjs.Sound.play("start");
    
    startShowTimer();
    
    stage.addChild(scoreText);
    stage.addChild(beef);
}

// ゲームが始まったときに呼ばれる
function problemInit() {
    Status.questions = generateProblem(Nikutaro.CONFIG.NUM_OF_QUIZ_PER_LEVEL_UP);
    
    var balloon = initBalloon();
    
    var ha = initHa();
    ha.addEventListener('click', function(event){
        createjs.Tween.get(event.target)
            .to({scaleX: 1.2, scaleY: 1.2, rotation: 20}, 100)
            .to({scaleX: 0.8, scaleY: 0.8, rotation: 0}, 100);
        clickBeefParts(event, -1);
    });
    
    questionText = initQuestionText();
    
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
    no_change_customer = no_change_customer || false;

    Status.quizId++;
    Status.quizCount++;
    Status.alreadyCorrected = false;
    
    if (no_change_customer == false){
        Status.customerSkinId = (Status.customerSkinId + 1) % Nikutaro.CONFIG.NUM_OF_CUSTOMER;
    }
    
    if(Status.quizId >= Nikutaro.CONFIG.NUM_OF_QUIZ_PER_LEVEL_UP) {
        Status.questions = generateProblem(Nikutaro.CONFIG.NUM_OF_QUIZ_PER_LEVEL_UP);
        Status.quizId = 0;
    }
    
    if (no_change_customer == false){
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

function startShowTimer() {
    Status.remainSec = Nikutaro.CONFIG.TIME_LIMIT_BY_SEC * 10;
    
    timerText = initTimerText();
    stage.addChild(timerText);

    passageId = setInterval(updateTimer, 100);
    
}

function stopTimer(){
    clearInterval(passageId);
    
    //write next scene
    createjs.Sound.stop("bgm");
    
    stage.removeAllChildren();
    scene = Nikutaro.SCENES.result;
    
    var resultText = initResultText();

    createjs.Sound.play("result");

    var tweetButton = initTweetButton();
    var tweetRect = initTweetRect();
    tweetRect.addEventListener("click", jumpTwitter);

    stage.addChild(tweetRect);
    stage.addChild(tweetButton);
    stage.addChild(resultText);

    var repeat = initRepeat();
    repeat.addEventListener("click",jumpStart);
    stage.addChild(repeat);
}

function jumpTwitter(event) {
    window.open("https://twitter.com/intent/tweet?hashtags=%E7%B2%BE%E8%82%89%E5%B1%8B%E3%81%95%E3%82%93%E8%82%89%E5%A4%AA%E9%83%8E&ref_src=twsrc%5Etfw&text="+Status.score+"%E7%82%B9%E3%82%92%E5%8F%96%E3%81%A3%E3%81%A6%E3%82%84%E3%81%A3%E3%81%9F%E3%81%9C%EF%BC%81&tw_p=tweetbutton");
}

function jumpStart(event) {
    window.location.href = 'index.html';
}
