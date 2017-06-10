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
}

const CONFIG = {
	NUM_OF_QUIZ_PER_LEVEL_UP: 10,
	NUM_OF_CUSTOMER: 8,
	TIME_LIMIT_BY_SEC: 30,
}

STATUS = {
	score: 0,
	quizId: 0,
	quizCount: 0,
	customerSkinId: 0,
	remainSec: 0,
	questions: new Array(),
}

var stage, w, h, loader;
var beef, balloon, questionText, niku, questions, scene;
var customer = new Array();

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
	createjs.Sound.registerSound("./assets/sounds/mow.mp3", "mow");
	createjs.Sound.registerSound("./assets/sounds/bgm.mp3", "bgm");
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
	STATUS.questions = generateProblem(CONFIG.NUM_OF_QUIZ_PER_LEVEL_UP);
	
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
	
	var ppc = new createjs.PlayPropsConfig().set({loop: -1, volume: 0.4})
	createjs.Sound.play("bgm", ppc);
	
	startShowTimer(CONFIG.TIME_LIMIT_BY_SEC);
	
	stage.addChild(scoreText);
	stage.addChild(beef);
}

function tick(event) {
	if(scene == SCENES.game) {
		scoreText.text = "Score: " + STATUS.score;
		scoreText.regX = scoreText.getBounds().width;
		scoreText.x = w;
		scoreText.y = 10;
	}
	
	stage.update(event);
}

function clickBeefParts(event, i) {
	if (i == STATUS.questions[STATUS.quizId]){
		createjs.Sound.play("mow");  
		STATUS.score += 10;
		
		nextProblem();
		createjs.Tween.get(niku)
			.to({x: customer[STATUS.customerSkinId].x - 200, y: customer[STATUS.customerSkinId].y}, 400)
			.to({x: customer[STATUS.customerSkinId].x - 200, y: customer[STATUS.customerSkinId].y}, 200)
			.to({x: w * 0.5 ,y: h*0.6}, 10);
	} else {
		createjs.Sound.play("mowmow");	
		STATUS.score -= 50;
	}
}

function nextProblem(event) {
	STATUS.quizId++;
	STATUS.quizCount++;
	STATUS.customerSkinId = (STATUS.customerSkinId + 1) % CONFIG.NUM_OF_CUSTOMER;

	if(STATUS.quizId >= CONFIG.NUM_OF_QUIZ_PER_LEVEL_UP) {
		STATUS.questions = generateProblem(CONFIG.NUM_OF_QUIZ_PER_LEVEL_UP);
		STATUS.quizId = 0;
	}

	for(var i = 0; i < CONFIG.NUM_OF_CUSTOMER; i++) {
		if(i == STATUS.customerSkinId) {
			customer[i].x = w * 0.8 + 200;
			customer[i].visible = true;
			createjs.Tween.get(customer[i]).to({x:w * 0.8}, 200, createjs.Ease.cubicOut)
		} else {
			customer[i].visible = false;
		}
	}
	
	questionText.text = jpQuests[quests[STATUS.questions[STATUS.quizId]]];
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
	timerText.text = (STATUS.remainSec / 10).toFixed(1);
	
	if(STATUS.remainSec <= 0.0){
		stopTimer();
	}
	
	STATUS.remainSec--;
}

function startShowTimer(timeLimitBySec) {
	STATUS.remainSec = timeLimitBySec * 10;
	
	timerText = new createjs.Text("", "24px sans-serif", "DarkRed");
	timerText.text = STATUS.remainSec / 10;
	
	passageId = setInterval('updateTimer()', 100);
	
	stage.addChild(timerText);
}

function stopTimer(){
	clearInterval(passageId);
	
	//write next scene
	createjs.Sound.stop("bgm");
	
	stage.removeAllChildren();
	scene = SCENES.result;
	
	resultText = new createjs.Text(STATUS.score+"点", "100px Arial", "#105099");
	resultText.x = w/2;
	resultText.y = h/2;
	resultText.regX = resultText.getBounds().width / 2;
	resultText.regY = resultText.getBounds().height / 2;
	
	stage.addChild(resultText);
}
