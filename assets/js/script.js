var stage, w, h, loader;
var beef;
var problem;
window.addEventListener("load", init); 

function init() { 
    stage = new createjs.Stage("nikutaro");
    w = stage.canvas.width;
    h = stage.canvas.height;

    var manifest = [
        {src: "beef.jpg", id: "beef"},
        {src: "customer1.png", id: "customer1"}
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
    problem = new Problem();

    stage.addChild(customer1);
    stage.addChild(beef);
    beef.addEventListener("click", sayMoo);
    createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
    problem.update();
	stage.update(event);
}

function sayMoo(event){
    // "mowmow"は後でconstに追加
    createjs.Sound.play("mowmow");
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

class Problem {
    constructor() {
        customer1.scaleX = 0.2;
        customer1.scaleY = 0.2;
        customer1.regX = customer1.getBounds().width / 2;
        customer1.regY = customer1.getBounds().height / 2;
        customer1.x = w * 0.8;
        customer1.y = h * 0.2;
    }
    update(id) {
    }
}
