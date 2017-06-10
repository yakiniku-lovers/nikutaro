const quests = [
    "Neck","Shoulder","Tombi","Misuji","ShoulderLoin","RibLoin",
    "Sirloin","Fillet","Bara","Uchimomo","Shintama","Sotomomo","Lampu",
    "Ichibo","Sune","ShoulderBara"
];

const SCENES = {
    start: 0,
    game: 1,
    result: 2,
};

const jpQuests = {
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
};

const CONFIG = {
    NUM_OF_QUIZ_PER_LEVEL_UP: 10,
    NUM_OF_CUSTOMER: 8,
    NUM_OF_EXTEND_TIME: 5,
    TIME_OF_EXTEND_BY_SEC: 5,
    TIME_LIMIT_BY_SEC: 30,
};

Status = {
    score: 0,
    quizId: 0,
    quizCount: 0,
    customerSkinId: 0,
    remainSec: 0,
    extendTimeGage: 0,
    questions: new Array(),
};

var stage, w, h, loader;
var beef, balloon, questionText, niku, questions, scene;
var customer = new Array();
var circleGage = new Array();

window.addEventListener("load", init); 

function init() { 
    stage = new createjs.Stage("nikutaro");
    w = stage.canvas.width;
    h = stage.canvas.height;
    
    var manifest = [
        {src: "beef.png", id: "beef"},
        {src: "niku.png", id: "niku"},
        {src: "customer0.png", id: "customer0"},
        {src: "customer1.png", id: "customer1"},
        {src: "customer2.png", id: "customer2"},
        {src: "customer3.png", id: "customer3"},
        {src: "customer4.png", id: "customer4"},
        {src: "customer5.png", id: "customer5"},
        {src: "customer6.png", id: "customer6"},
        {src: "customer7.png", id: "customer7"},
        {src: "balloon.png", id: "balloon"},
        {src: "repeat.png", id: "repeat"}
    ];
    
    for(var i = 0; i < quests.length; i++) {
        manifest.push({src: "beef_parts/"+quests[i]+".png", id: quests[i]});
    }
    
    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest, true, "./assets/images/");
    
    createjs.Sound.registerSound("./assets/sounds/mowmow.mp3", "mowmow");
    createjs.Sound.registerSound("./assets/sounds/mow.mp3", "mow");
    createjs.Sound.registerSound("./assets/sounds/bgm.mp3", "bgm");
    createjs.Sound.registerSound("./assets/sounds/result.mp3", "result");
}

function handleComplete() {
    scene = SCENES.start;
    
    var startText = new createjs.Text("START", "100px Arial", "#105099");
    startText.x = w/2;
    startText.y = h/2;
    startText.regX = startText.getBounds().width / 2;
    startText.regY = startText.getBounds().height / 2;
    
    var backRect = new createjs.Shape();
    backRect.graphics.beginFill("#ffffff").drawRect(0, 0, w, h);
    backRect.addEventListener("click", gameStart);
    
    stage.addChild(backRect);
    stage.addChild(startText);
    
    createjs.Ticker.addEventListener("tick", tick);
}

function problemInit() {
    Status.questions = generateProblem(CONFIG.NUM_OF_QUIZ_PER_LEVEL_UP);
    
    for(var i = 0; i < CONFIG.NUM_OF_CUSTOMER; i++) {
        customer[i].scaleX = 0.2;
        customer[i].scaleY = 0.2;
        customer[i].regX = customer[i].getBounds().width / 2;
        customer[i].regY = customer[i].getBounds().height / 2;
        customer[i].y = h * 0.2 + 50;
        stage.addChild(customer[i]);
    }
    
    balloon = new createjs.Bitmap(loader.getResult("balloon"));
    balloon.scaleX = 0.8;
    balloon.scaleY = 0.8;
    balloon.regX = balloon.getBounds().width / 2;
    balloon.regY = balloon.getBounds().height / 2;
    balloon.x = w * 0.4;
    balloon.y = h * 0.15 + 50;
    
    questionText = new createjs.Text("", "20px Arial", "#000000");
    questionText.x = w * 0.37;
    questionText.y = h * 0.15 + 50;
    
    stage.addChild(balloon);
    stage.addChild(questionText);
    
    nextProblem();
}

function gameStart() {
    scene = SCENES.game;
    stage.removeAllChildren();
    
    niku = new createjs.Bitmap(loader.getResult("niku"));
    niku.x = w * 0.5;
    niku.y = h * 0.6;
    stage.addChild(niku);
    
    beef = new createjs.Bitmap(loader.getResult("beef"));
    beef.regX = beef.getBounds().width / 2;
    beef.regY = beef.getBounds().height / 2;
    beef.x = w * 0.5;
    beef.y = h * 0.7;
    
    for (var i = 0; i < quests.length; i++) {
        (function(i, stage){
            var part = new createjs.Bitmap(loader.getResult(quests[i]));
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
    
    for(var i = 0; i < CONFIG.NUM_OF_CUSTOMER; i++) {
        customer[i] = new createjs.Bitmap(loader.getResult("customer" + i));
    }
    
    problemInit();
    
    scoreText = new createjs.Text("", "20px Arial", "#000000");

    for (var i = 0; i < CONFIG.NUM_OF_EXTEND_TIME; i++) {
        circleGage[i] = new createjs.Shape();
        circleGage[i].graphics.beginFill("#ff0000").drawCircle(80 + i * 25, 12, 10);
        circleGage[i].alpha = 0.2;
        stage.addChild(circleGage[i]);
    }
    
    var ppc = new createjs.PlayPropsConfig().set({loop: -1, volume: 0.4})
    createjs.Sound.play("bgm", ppc);
    
    startShowTimer(CONFIG.TIME_LIMIT_BY_SEC);
    
    stage.addChild(scoreText);
    stage.addChild(beef);
}

function tick(event) {
    if(scene == SCENES.game) {
        scoreText.text = "Score: " + Status.score;
        scoreText.regX = scoreText.getBounds().width;
        scoreText.x = w;
        scoreText.y = 10;
    }
    
    stage.update(event);
}

function clickBeefParts(event, i) {
    if (i == Status.questions[Status.quizId]){
        createjs.Sound.play("mow");  
        Status.score += 10;
        Status.extendTimeGage += 1;
        nextProblem();
        createjs.Tween.get(niku)
            .to({x: customer[Status.customerSkinId].x - 200, y: customer[Status.customerSkinId].y}, 400)
            .to({x: customer[Status.customerSkinId].x - 200, y: customer[Status.customerSkinId].y}, 200)
            .to({x: w * 0.5 ,y: h*0.6}, 10);
    } else {
        Status.extendTimeGage = 0;
        createjs.Sound.play("mowmow");  
        Status.score -= 50;
    }
    checkExtendTimeGage();
}

function checkExtendTimeGage() {
    for(var i = 0; i < CONFIG.NUM_OF_EXTEND_TIME; i++) {
        if(i < Status.extendTimeGage) {
            circleGage[i].alpha = 1;
        } else {
            circleGage[i].alpha = 0.2;            
        }
    }

    if(Status.extendTimeGage == 5) {
        var interval = 200;
        Status.extendTimeGage = 0;
        Status.remainSec += CONFIG.TIME_OF_EXTEND_BY_SEC * 10;
        for(var i = 0; i < CONFIG.NUM_OF_EXTEND_TIME; i++) {
             createjs.Tween.get(circleGage[i])
                .to({alpha: 0.2}, interval)
                .to({alpha: 1.0}, interval)
                .to({alpha: 0.2}, interval)
                .to({alpha: 1.0}, interval)
                .to({alpha: 0.2}, interval);
        }
    }
}

function nextProblem(event) {
    Status.quizId++;
    Status.quizCount++;
    Status.customerSkinId = (Status.customerSkinId + 1) % CONFIG.NUM_OF_CUSTOMER;
    
    if(Status.quizId >= CONFIG.NUM_OF_QUIZ_PER_LEVEL_UP) {
        Status.questions = generateProblem(CONFIG.NUM_OF_QUIZ_PER_LEVEL_UP);
        Status.quizId = 0;
    }
    
    for(var i = 0; i < CONFIG.NUM_OF_CUSTOMER; i++) {
        if(i == Status.customerSkinId) {
            customer[i].x = w * 0.8 + 200;
            customer[i].visible = true;
            createjs.Tween.get(customer[i]).to({x:w * 0.8}, 200, createjs.Ease.cubicOut)
        } else {
            customer[i].visible = false;
        }
    }
    
    questionText.text = jpQuests[quests[Status.questions[Status.quizId]]];
    questionText.regX = questionText.getBounds().width / 2;
    questionText.regY = questionText.getBounds().height / 2;
    questionText.y = h * 0.15 + 60;
    questionText.alpha = 0;
    
    createjs.Tween.get(questionText).to({alpha: 1, y: h * 0.15 + 50}, 300, createjs.Ease.cubicOut);
}

function generateProblem(num) {
    var problems = new Array();
    for (var i = 0 ; i < num; i++){
        var rand = Math.floor(Math.random() * quests.length);
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
    
    passageId = setInterval('updateTimer()', 100);
    
    stage.addChild(timerText);
}

function stopTimer(){
    clearInterval(passageId);
    
    //write next scene
    createjs.Sound.stop("bgm");
    
    stage.removeAllChildren();
    scene = SCENES.result;
    
    resultText = new createjs.Text(Status.score+"点", "100px Arial", "#105099");
    resultText.x = w/2;
    resultText.y = h/2;
    resultText.regX = resultText.getBounds().width / 2;
    resultText.regY = resultText.getBounds().height / 2;

    createjs.Sound.play("result");

    var tweetButton = new createjs.Text("ツイートする", "25px Arial", "#FFFFFF");
    tweetButton.x = w/2;
    tweetButton.y = h/2 + 150;
    tweetButton.regX = tweetButton.getBounds().width / 2;
    tweetButton.regY = tweetButton.getBounds().height / 2;

    var tweetRect = new createjs.Shape();
    tweetRect.graphics.beginFill("#1da1f2").drawRect(tweetButton.x-90, tweetButton.y-20, 190, 50);
    tweetRect.addEventListener("click", jumpTwitter);
    stage.addChild(tweetRect);
    stage.addChild(tweetButton);
    
    stage.addChild(resultText);

    repeat = new createjs.Bitmap(loader.getResult("repeat"));
    repeat.scaleX = 0.3;
    repeat.scaleY = 0.3;
    repeat.y = h-repeat.getBounds().height/2;
    repeat.addEventListener("click",jumpStart);
    stage.addChild(repeat);
}
function jumpTwitter(event) {
    window.open("https://twitter.com/intent/tweet?hashtags=%E7%B2%BE%E8%82%89%E5%B1%8B%E3%81%95%E3%82%93%E8%82%89%E5%A4%AA%E9%83%8E&ref_src=twsrc%5Etfw&text="+Status.score+"%E7%82%B9%E3%82%92%E5%8F%96%E3%81%A3%E3%81%A6%E3%82%84%E3%81%A3%E3%81%9F%E3%81%9C%EF%BC%81&tw_p=tweetbutton");
}

function jumpStart(event) {
    window.location.href = 'index.html';
}
