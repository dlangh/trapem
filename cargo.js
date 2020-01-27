cargo = function(config) {
	this.x = 0;
	this.y = 0;
	this.elem = {};
	this.parentElem = {};
	this.init(config);
}

cargo.prototype = {
	constructor: cargo,
	init: function(config) {
		 if (config) {
			 for (prop in config) {
				 this[prop] = config[prop];
	         }
	     }
		 // Create dom element...
		 this.elem = document.createElement('img');
		 this.elem.setAttribute('src','images/crate3.png');
		 this.elem.style.position="absolute";
		 this.elem.style.left=(config.x * 2) + 'em';
		 this.elem.style.top=(config.y * 2) +  'em';
		 this.elem.style.height='2em';
		 this.elem.style.width='2em';
		 this.parentElem.appendChild(this.elem);
	},
	getX: function() {
		return this.x;
	},
	getY: function() {
		return this.y;
	},
	getXY: function() {
		return {x: this.x, y: this.y };
	},
	moveUp: function() {
		var result = false;
		if (this.y > 0 && this.canMove(this.x,(this.y - 1),"up")) { 
			this.y -= 1;
			this.elem.style.top = (this.y * 2) + 'em';
			result = true;
		};
		return result;
	},
	moveDown: function() {
		var result = false;
		if (this.y < this.board.height && this.canMove(this.x,(this.y + 1),"down")) { 
			this.y += 1;
			this.elem.style.top = (this.y * 2) + 'em';
			result = true;
			}
		return result;

	},
	moveLeft: function() {
		var result = false;
		if (this.x > 0 & this.canMove((this.x-1),this.y,'left')) { 
			this.x -= 1;
			this.elem.style.left = (this.x * 2) + 'em';
			result = true;
			}
		return result;
	},
	moveRight: function() {
		var result = false;
		if (this.x < this.board.width & this.canMove((this.x+1),this.y,'right')) { 
			this.x += 1;
			this.elem.style.left = (this.x * 2) + 'em';
			result = true;
			}
		return result;
	},
	canMove: function(newx,newy,direction) {
		var result = true;
		// determines if hero can move to new position
		// First check to see if a monster is in the way...  If so we can't move
		for (var m=0;m<this.board.monsters.length;m++) {
			if (this.board.monsters[m].x == newx && this.board.monsters[m].y == newy) {
				// Monster is in the way, return false...
				return false;
			}
		}
		
		// is a fixed cargo in the way? if so we can't move
		for (var i=0; i < this.board.fixedcargos.length; i++) {
			if (this.board.fixedcargos[i].x == newx && this.board.fixedcargos[i].y == newy) {
				// there is a fixed cargo, can't move
				return false;
				}
			}
		
		for (i=0;i<this.board.cargos.length;i++) {
			if (this.board.cargos[i].x == newx && this.board.cargos[i].y == newy) {
				// cargo is in the way, move it if possible...
				switch(direction) {
				case 'up': 
					result = this.board.cargos[i].moveUp();
					break;
				case 'down':
					result = this.board.cargos[i].moveDown();
					break;
				case 'left':
					result = this.board.cargos[i].moveLeft();
					break;
				case 'right':
					result = this.board.cargos[i].moveRight();
					break;
				}
			}
		}
		return result;
	}
}

