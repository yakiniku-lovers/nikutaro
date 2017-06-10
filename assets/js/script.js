const quests = [
  "Neck","Shoulder","Tombi","Misuji","ShoulderLoin","RibLoin",
  "Sirloin","Fillet","Bara","Uchimomo","Shintama","Sotomomo","Lampu",
  "Ichibo","Sune","ShoulderBara"
];

var stage, w, h, loader;
var beef, balloon, questionText, niku, questions, currentScore = 0;
var customer = new Array();
const MAX = 10; //問題数
const CUSTOMER_NUM = 8;
var now = MAX, count = 0;
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
        {src: "balloon.png", id: "balloon"}
    ];

    for(var i = 0; i < quests.length; i++) {
        manifest.push({src: "beef_parts/"+quests[i]+".png", id: quests[i]});
    }

    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest, true, "./assets/images/");
    createjs.Sound.registerSound("./assets/sounds/mowmow.mp3", "mowmow");
	
	scoreText = new createjs.Text("", "20px Arial", "#000000");
	stage.addChild(scoreText);
    startShowTimer(30);
}

function handleComplete() {
    niku = new createjs.Bitmap(loader.getResult("niku"));
    niku.x = w * 0.5;
    niku.y = h * 0.6;
    stage.addChild(niku);

    beef = new createjs.Bitmap(loader.getResult("beef"));
    beef.regX = beef.getBounds().width / 2;
    beef.regY = beef.getBounds().height / 2;
    beef.x = w * 0.5;
    beef.y = h * 0.7;

    var beefParts = new Array();
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
    stage.addChild(beef);

    for(var i = 0; i < CUSTOMER_NUM; i++) {
        customer[i] = new createjs.Bitmap(loader.getResult("customer" + i));
    }
    balloon = new createjs.Bitmap(loader.getResult("balloon"));
    problemInit();

    createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
	scoreText.text = "Score: " + currentScore;
	scoreText.regX = scoreText.getBounds().width;
	scoreText.x = w;
	scoreText.y = 10;
	
	stage.update(event);
}

function sayMoo(event){
    // "mowmow"は後でconstに追加
    createjs.Sound.play("mowmow");
}

function clickBeefParts(event, i) {
	if (i == questions[now]){
		nextProblem();
		currentScore += 10;
        createjs.Tween.get(niku)
            .to({x: customer[count % CUSTOMER_NUM].x - 200, y: customer[count % CUSTOMER_NUM].y}, 400)
            .to({x: customer[count % CUSTOMER_NUM].x - 200, y: customer[count % CUSTOMER_NUM].y}, 200)
            .to({x: w * 0.5 ,y: h*0.6}, 10);
	} else {
    	createjs.Sound.play("mowmow");  
		currentScore -= 50;
	}
	
    console.dir(i);
}

function nextProblem(event) {
    now++;
    count++;

    if(now >= MAX) {
        questions = generateProblem(MAX);
        now = 0;
    }

    for(var i = 0; i < CUSTOMER_NUM; i++) {
        if(i == count % CUSTOMER_NUM) {
            customer[i].x = w * 0.8 + 200;
            customer[i].visible = true;
            createjs.Tween.get(customer[i]).to({x:w * 0.8}, 200, createjs.Ease.cubicOut)
        } else {
            customer[i].visible = false;
        }
    }
    questionText.text = jpQuests[quests[questions[now]]];
    questionText.regX = questionText.getBounds().width / 2;
    questionText.regY = questionText.getBounds().height / 2;
    questionText.y = h * 0.15 + 60;
    questionText.alpha = 0;
    createjs.Tween.get(questionText).to({alpha: 1, y: h * 0.15 + 50}, 300, createjs.Ease.cubicOut);
}

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
}

function generateProblem(num) {
	var problems = new Array();
	for (var i = 0 ; i < num; i++){
		var rand = Math.floor(Math.random() * quests.length);
		problems.push(rand);
	}
	return problems;
}

function problemInit() {
    for(var i = 0; i < CUSTOMER_NUM; i++) {
        customer[i].scaleX = 0.2;
        customer[i].scaleY = 0.2;
        customer[i].regX = customer[i].getBounds().width / 2;
        customer[i].regY = customer[i].getBounds().height / 2;
        customer[i].y = h * 0.2 + 50;
        stage.addChild(customer[i]);
    }
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

var remainSec;
var passageId;
var timerText;

function updateTimer() {
  timerText.text = remainSec / 10;
  if(remainSec <= 0.0){
    stopTimer();
  }
  remainSec--;
}

function startShowTimer(initialSecond) {
  remainSec = initialSecond * 10;
  timerText = new createjs.Text("", "24px sans-serif", "DarkRed");
  timerText.text = remainSec / 10;
  stage.addChild(timerText);
  passageId = setInterval('updateTimer()', 100);
}

function stopTimer(){
  clearInterval(passageId);
  //write next scene
  stage.removeAllChildren();
  resultText = new createjs.Text(currentScore+"点", "100px Arial", "#105099");
  resultText.x = w/2;
  resultText.y = h/2;
  resultText.regX = resultText.getBounds().width / 2;
  resultText.regY = resultText.getBounds().height / 2;
  stage.addChild(resultText);

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
}

function jumpTwitter(event) {
    window.open("https://twitter.com/intent/tweet?hashtags=%E7%B2%BE%E8%82%89%E5%B1%8B%E3%81%95%E3%82%93%E8%82%89%E5%A4%AA%E9%83%8E&ref_src=twsrc%5Etfw&text="+currentScore+"%E7%82%B9%E3%82%92%E5%8F%96%E3%81%A3%E3%81%A6%E3%82%84%E3%81%A3%E3%81%9F%E3%81%9C%EF%BC%81&tw_p=tweetbutton");
}
