window.addEventListener("load", init);
function init() {
    var stage = new createjs.Stage("nikutaro");
    var beef = new createjs.Bitmap("./assets/images/beef.jpg");
    stage.addChild(beef);
    beef.x = (640 - 346) / 2; //後でちゃんと指定します。
    beef.y = (480 - 230) / 2;
    stage.update();
}

const quest = [
  "Neck","Shoulder","Tombi","Misuji","ShoulderLoin","RibLoin",
  "Sirloin","Fillet","Bara","Uchimomo","Shintama","Sotomomo","Lampu",
  "Ichibo","Sune"
];

function generateProblem(num) {
	var problems = new Array();
	for (var i = 0 ; i < num; i++){
		var rand = Math.floor(Math.random() * 14);
		problems.push(rand)
	}
	return problems;
}