var stage, w, h, loader;
var beef, balloon, questionText, questions;
var now = 0;
const MAX = 100; //問題数
window.addEventListener("load", init); 

function init() { 
    stage = new createjs.Stage("nikutaro");
    w = stage.canvas.width;
    h = stage.canvas.height;

    questions = generateProblem(MAX);

    var manifest = [
        {src: "beef.jpg", id: "beef"},
        {src: "customer1.png", id: "customer1"},
        {src: "balloon.png", id: "balloon"}
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

    customer1 = new createjs.Bitmap(loader.getResult("customer1"));
    balloon = new createjs.Bitmap(loader.getResult("balloon"));
    problemInit();

    stage.addChild(beef);
    beef.addEventListener("click", sayMoo);
    beef.addEventListener("click", nextProblem);
    createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
    problemUpdate(questions[now]);
	stage.update(event);
}

function sayMoo(event){
    // "mowmow"は後でconstに追加
    createjs.Sound.play("mowmow");
}

function nextProblem(event) {
    now++;
}

const quests = [
  "Neck","Shoulder","Tombi","Misuji","ShoulderLoin","RibLoin",
  "Sirloin","Fillet","Bara","Uchimomo","Shintama","Sotomomo","Lampu",
  "Ichibo","Sune"
];

function generateProblem(num) {
	var problems = new Array();
	for (var i = 0 ; i < num; i++){
		var rand = Math.floor(Math.random() * quests.length);
		problems.push(rand)
	}
	return problems;
}

function problemInit() {
    customer1.scaleX = 0.2;
    customer1.scaleY = 0.2;
    customer1.regX = customer1.getBounds().width / 2;
    customer1.regY = customer1.getBounds().height / 2;
    customer1.x = w * 0.8;
    customer1.y = h * 0.2;
    balloon.scaleX = 0.8;
    balloon.scaleY = 0.8;
    balloon.regX = balloon.getBounds().width / 2;
    balloon.regY = balloon.getBounds().height / 2;
    balloon.x = w * 0.4;
    balloon.y = h * 0.15;
    questionText = new createjs.Text("", "20px Arial", "#000000");
    questionText.x = w * 0.37;
    questionText.y = h * 0.15;
    stage.addChild(customer1);
    stage.addChild(balloon);
    stage.addChild(questionText);
}

function problemUpdate(id) {
    questionText.text = quests[id];
    questionText.regX = questionText.getBounds().width / 2;
    questionText.regY = questionText.getBounds().height / 2;
}
