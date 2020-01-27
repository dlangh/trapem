
// var board = { width: 50, height: 40 }

//var cargo = [
 //            {x: 5, y: 5}
//             ];

function drawBoard() {
	var pboard = document.getElementById('board');
	hero.createElement(pboard);
}



function move(event) {
	if (event.keyCode == 38) { hero.moveUp(); }  // up
	if (event.keyCode == 40) { hero.moveDown(); }  // down
	if (event.keyCode == 39) { hero.moveRight();  }  // right
	if (event.keyCode == 37) { hero.moveLeft(); }  // left
	console.log(hero);
}

function play() {
}
