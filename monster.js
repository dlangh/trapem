/**
 * 
 * TODO:
 * 	1. IF monster is flagged as trapped, but gets free, need to mark them as untrapped...
 * 	
 * 
 * 
 */

monster = function(config) {
	this.x = 0;
	this.y = 0;
	this.alive = true;
	this.elem = {};
	this.number = 0,
	this.moving = false,
	this.parentElem = {};
	this.init(config);
}

monster.prototype = {
	constructor: monster,
	init: function(config) {
		 if (config) {
			 for (prop in config) {
				 this[prop] = config[prop];
	         }
	     }
		 // Create dom element...
		 this.elem = document.createElement('img');
		 this.elem.setAttribute('src','images/monster10.gif');
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

	/*
	 * moveTo: moves monster to new cell
	 */
	moveTo: function(x,y) {
		var result = false;
		if (this.x <= this.board.width && this.x >= 0 && this.y >= 0 && this.y <= this.board.height) {
			this.x = x;
			this.y = y;
			this.elem.style.left = (this.x * 2) + 'em';
			this.elem.style.top = (this.y * 2) + 'em';
			result = true;
		}
		return result;
	},
	/*
	 * canMove() - determins if monster can move to a certain cell.
	 */
	canMove: function(x,y,direction) {
		var result = true;
		// determines if monster can move to new position
		// do we have access to the monster elements?
		
		// is this out of bounds?
		if (x > this.board.width || y > this.board.height) {
			return false;
			}
		if (x < 0 || y < 0) {
			return false;
		}
		
		for (var i=0;i<this.board.monsters.length;i++) {
			if (this.x == x && this.y == y) {
				return true;
			}
			if (this.board.monsters[i].x == x && this.board.monsters[i].y == y) {
				// another monster is in the way, so we can't move there
				result = false;
			}
		}
		for (i=0;i<this.board.fixedcargos.length;i++) {
			if (this.board.fixedcargos[i].x == x && this.board.fixedcargos[i].y == y) {
				return false;
				}
			}
		for (i=0;i<this.board.cargos.length;i++) {
			if (this.board.cargos[i].x == x && this.board.cargos[i].y == y) {
				return false;
				}
			}
		if (this.board.hero.x == this.x && this.board.hero.y == this.y) {
			this.board.hero.alive = false;
			}
		return result;
	},
	trapped: function() {
		var result = true;
		// determine if monster is trapped or not...
		if (this.canMove(this.x,this.y-1)) { result = false; }
		if (this.canMove(this.x,this.y+1)) { result = false; }
		if (this.canMove(this.x+1,this.y-1)) { result = false; }
		if (this.canMove(this.x+1,this.y+1)) { result = false; }
		if (this.canMove(this.x+1,this.y)) { result = false; }
		if (this.canMove(this.x-1,this.y)) { result = false; }
		if (this.canMove(this.x-1,this.y+1)) { result = false; }
		if (this.canMove(this.x-1,this.y-1)) { result = false; }
		if (result == true) {
		}
		return result;	
	},
	move: function() {
		// since JS is asynchronous we need to prevent another move beginning while
		// our current move is in process
		if (this.moving == true) {
			return false;
			}
		this.moving = true; // prevent another movement until this one completes.
		// same as above, if hero is moving, skip movement
		if (this.board.hero.moving == true) {
			return false;
		}
		var pathCtr = 1; // Counter for the number of steps a cell is from the origin
		var pathFound = 0;  // when we find our hero, we have a path
		var mainList = [[this.x,this.y,0]]; // this is the main array of paths that eventually lead to our hero.
		var cellList = [];  // list of adjacents cells around our current cell we are checking.
		var coordList = []; // 
		var addMe = false; // internal variable to determine if we add a cell to our path.
		var matchVal = -1;
		var matchCoord = -1;
		
		while (pathFound == 0 && pathCtr <= Math.max(this.board.width,this.board.height) ) {
			coordList = []; // reset working list to add to main at end...
			// loop over our main list, this changes as we itterate through cells until we find our hero.
			for (var i=0;i<mainList.length;i++) {
				cellList = [
					[mainList[i][0],mainList[i][1]-1,pathCtr],
					[mainList[i][0],mainList[i][1]+1,pathCtr],
					[mainList[i][0]+1,mainList[i][1]-1,pathCtr],
					[mainList[i][0]+1,mainList[i][1]+1,pathCtr],
					[mainList[i][0]+1,mainList[i][1],pathCtr],
					[mainList[i][0]-1,mainList[i][1],pathCtr],
					[mainList[i][0]-1,mainList[i][1]+1,pathCtr],
					[mainList[i][0]-1,mainList[i][1]-1,pathCtr]
					];
				for (var j=0;j<cellList.length;j++) {
					addMe = false; 
					matchVal = -1;
					matchCoord = -1;
					mainList.forEach(function(item) {
						if (cellList[j][0] == item[0] && cellList[j][1] == item[1]) {
							matchVal = item[2];
							}
						});
					coordList.forEach(function(item) {
						if (cellList[j][0] == item[0] && cellList[j][1] == item[1] && pathFound == 0) {
							matchCoord = item[2];
							}
						});
					if (this.canMove(cellList[j][0],cellList[j][1]) == true && pathFound == 0) {
						addMe = true;
						}
					if (matchVal <= cellList[j][2] && matchVal != -1 ) {
						addMe = false;
						}
					if (matchCoord <= cellList[j][2] && matchCoord != -1 ) {
						addMe = false;
						}
					if (this.board.hero.x == cellList[j][0] && this.board.hero.y == cellList[j][1]) {
						// we found our hero, end this loop
						pathFound = 1;
						}
					if (addMe == true) {
						coordList.push(cellList[j]);
						}
					}
				}
			mainList = mainList.concat(coordList);
			pathCtr +=1;
			}
		/**
		* we should have a path to target, now determine the next move..
		* the idea is we step backwards through our mainList, for each "level" (IE the pathCtr) 
		* we will check to see if a cell is adjacent to the previously chosen cell
		* if it is, it becomes the new current cell and we re-check the next lower level.
		* this continues until we get to level 1, when we find that matching cell,
		* it is one cell away from our monster current position and that is where 
		* we move to
		**/
		var currentCell = mainList[mainList.length -1];
		var pathNum = currentCell[2];
		var xDiff = 0;
		var yDiff = 0;
		for (i=(mainList.length - 1);i > 0; i--) {
			if (mainList[i][2] == currentCell[2] - 1) {
				xDiff = Math.abs(mainList[i][0] - currentCell[0]);
				yDiff = Math.abs(mainList[i][1] - currentCell[1]);
				if ( (xDiff - 1) < 1 && (yDiff -1) < 1) {
					currentCell = mainList[i];
					pathNum = currentCell[2];
					}
				}
			}
		result = this.moveTo(currentCell[0],currentCell[1]);
		
		// Did we land on our hero? if so, flag him as dead.
		if (this.board.hero.x == this.x && this.board.hero.y == this.y) {
			this.board.hero.alive = false;
		}
		
		this.moving = false;
	}
}