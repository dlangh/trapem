/**
 * Hero.js
 * 
 * TODO:
 * 	1. Convert this from a singleton object
 */

var hero = {
	x: 17,
	y: 11,
	alive: true,
	elem: {},
	moves: 0,
	cargos: [],
	moving: false,
	parentElem: {},
	board: {},
	createElement: function(parentElem) {
		// Create a DOM element that will represent our hero visually
		hero.elem = document.createElement('img');
		hero.elem.setAttribute('src','images/hero7a.gif');
		hero.elem.style.position="absolute";
		hero.x = Math.floor(hero.board.width / 2);
		hero.y = Math.floor(hero.board.height / 2);
		hero.elem.style.left=(hero.x * 2) + 'em';
		hero.elem.style.top=(hero.y * 2) +  'em';
		hero.elem.style.height='2em';
		hero.elem.style.width='2em';
		hero.parentElem = parentElem;
		parentElem.appendChild(hero.elem);
		hero.movesElem = document.getElementById('nummoves');
	},
	reset: function() {
		hero.x = 17;
		hero.y = 11;
		hero.moves = 0;
		hero.movesElem.innerHTML = "0000";
		hero.alive = true;
	},
	getXY: function() {
		return { x: hero.x, y: hero.y };
	},
	moveUp: function() {
		var result = false;
		if (hero.y > 0 && hero.canMove(hero.x,(hero.y - 1),"up")) { 
			hero.y -= 1;
			hero.elem.style.top = (hero.y * 2) + 'em';
			hero.moves +=1;
			result = true;
		};
		return result;
	},
	moveDown: function() {
		var result = false;
		if (hero.y < this.board.height && hero.canMove(hero.x,(hero.y + 1),"down")) { 
			hero.y += 1;
			hero.elem.style.top = (hero.y * 2) + 'em';
			hero.moves +=1;
			result = true;
			}
		return result;
	},
	moveLeft: function() {
		var result = false;
		if (hero.x > 0 && hero.canMove((hero.x-1),hero.y,"left")) { 
			hero.x -= 1;
			hero.elem.style.left = (hero.x * 2) + 'em';
			hero.moves +=1;
			result = true;
			}
		return result;
	},
	moveRight: function() {
		var result = false;
		if (hero.x < this.board.width & hero.canMove((hero.x+1),hero.y,"right")) { 
			hero.x += 1;
			hero.elem.style.left = (hero.x * 2) + 'em';
			hero.moves +=1;
			result = true;
			}
		return result;
	},
	canMove: function(x,y,direction) {
		var result = true;
		if (hero.alive == false) {
			return false;
		}
		if (hero.board.paused == true) {
			return false;
		}
		// determines if hero can move to new position
		// do we have access to the cargo elements?
		// Need to check to see if we would be moving into monster, if so the game is over...
		for (var m=0;m<this.board.monsters.length;m++) {
			if (hero.board.monsters[m].x == hero.x && hero.board.monsters[m].y == hero.y) {
				// Monster is in the way, return false...
				// hero.alive = false;
				// result = false;
				return result;
			}
		}
		
		// is a fixed cargo in the way? if so we can't move
		for (var i=0; i < this.board.fixedcargos.length; i++) {
			if (hero.board.fixedcargos[i].x == x && hero.board.fixedcargos[i].y == y) {
				// there is a fixed cargo, can't move
				return false;
				}
			}
		
		for (i=0;i<hero.board.cargos.length;i++) {
			if (hero.board.cargos[i].x == x && hero.board.cargos[i].y == y) {
				// cargo is in the way, move it if possible...
				switch(direction) {
				case 'up': 
					result = hero.board.cargos[i].moveUp();
					break;
				case 'down':
					result = hero.board.cargos[i].moveDown();
					break;
				case 'left':
					result = hero.board.cargos[i].moveLeft();
					break;
				case 'right':
					result = hero.board.cargos[i].moveRight();
					break;
				}
			}
		}
		return result;
	},
	move: function(event) {
		// pause monsters while moving.
		var stepsound = document.getElementById("stepper"); 
		hero.moving = true;
		stepsound.playbackRate = 3.0;
		stepsound.play();
		if (event.keyCode == 38 || event.keyCode == 65 ) { hero.moveUp(); }  // up
		if (event.keyCode == 40 || event.keyCode == 90 ) { hero.moveDown(); }  // down
		if (event.keyCode == 39 || event.keyCode == 76 ) { hero.moveRight();  }  // right
		if (event.keyCode == 37 || event.keyCode == 75 ) { hero.moveLeft(); }  // left
		// Update the number of moves display in the header
		movesHtml = hero.moves;
		if (movesHtml < 10) { movesHtml = "000" + hero.moves; }
		else if (movesHtml < 100) { movesHtml = "00" + hero.moves; }
		else if (movesHtml < 1000) { movesHtml = "0" + hero.moves; }
		hero.movesElem.innerHTML = movesHtml;
		hero.moving = false;
	}
}
