const quests = [
  "Neck","Shoulder","Tombi","Misuji","ShoulderLoin","RibLoin",
  "Sirloin","Fillet","Bara","Uchimomo","Shintama","Sotomomo","Lampu",
  "Ichibo","Sune","ShoulderBara"
];

var stage, w, h, loader;
var beef, balloon, questionText, questions;
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
        {src: "beef.jpg", id: "beef"},
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
}

function handleComplete() {
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

    stage.addChild(beef);
    beef.addEventListener("click", sayMoo);
    beef.addEventListener("click", nextProblem);
    createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
    if(now >= MAX) {
        questions = generateProblem(MAX);
        now = 0;
    }
    problemUpdate(questions[now]);
	stage.update(event);
}

function sayMoo(event){
    // "mowmow"は後でconstに追加
    createjs.Sound.play("mowmow");
}

function clickBeefParts(event, i) {
    createjs.Sound.play("mowmow");  
    console.dir(i);
}

function nextProblem(event) {
    now++;
    count++;
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
        customer[i].x = w * 0.8;
        customer[i].y = h * 0.2;
        stage.addChild(customer[i]);
    }
    balloon.scaleX = 0.8;
    balloon.scaleY = 0.8;
    balloon.regX = balloon.getBounds().width / 2;
    balloon.regY = balloon.getBounds().height / 2;
    balloon.x = w * 0.4;
    balloon.y = h * 0.15;
    questionText = new createjs.Text("", "20px Arial", "#000000");
    questionText.x = w * 0.37;
    questionText.y = h * 0.15;
    stage.addChild(balloon);
    stage.addChild(questionText);
}

function problemUpdate(id) {
    for(var i = 0; i < CUSTOMER_NUM; i++) {
        customer[i].visible = false;
    }
    customer[count % CUSTOMER_NUM].visible = true;
    questionText.text = jpQuests[quests[id]];
    questionText.regX = questionText.getBounds().width / 2;
    questionText.regY = questionText.getBounds().height / 2;
}
