window.addEventListener("load", init);
function init() {
    var stage = new createjs.Stage("nikutaro");
    var beef = new createjs.Bitmap("./assets/images/beef.jpg");
    stage.addChild(beef);
    beef.x = (640 - 346) / 2; //後でちゃんと指定します。
    beef.y = (480 - 230) / 2;
    stage.update();
}

const Neck = 0;
const Shoulder = 1;
const Tombi = 2;
const Misuji = 3;
const ShoulderLoin = 4;
const RibLoin = 5;
const Sirloin = 6;
const Fillet = 7;
const Bara = 8;
const Uchimomo = 9;
const Shintama =10;
const Sotomomo = 11;
const Lampu = 12;
const Ichibo = 13;
const Sune = 14;

function generateProblem(num) {
	var problems = new Array();
	for (var i = 0 ; i < num; i++){
		var rand = Math.floor( Math.random()*14);
		problems.push(rand)
	}
	return problems;
}