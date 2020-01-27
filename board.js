// This will be our main class...
// It will contain all the elements, hero, cargo monster within it...

// TODO:
// Separate functionality in init between what needs to be done the first time game is laoded and 
// what needs to be done for each level...

var board = {
		width: 15, // -5
		height: 10, // -5
		numCargo: 200,
		numFixedCargo: 5,
		speed: 2500,
		initialSpeed: 3500,
		initialCargo: 200,
		cargos: [],
		monsters: [],
		fixedcargos: [],
		numMonsters: 3,
		numTrapped: 0,
		startTime: 0,
		minutes: 0,
		seconds: 0,
		rawSeconds: 0,
		won: false,
		level: 1,
		paused: false,
		elem: {},
	init: function() {
		this.elem = document.getElementById('board');
		hero.board = this;
		board.hero = hero;
		
		this.minuteElem = document.getElementById('minutes');
		this.secondElem = document.getElementById('seconds');
		this.hiscoreElem = document.getElementById('hiscore');
		if (localStorage.hiscore) {
			this.hiscoreElem.innerHTML = localStorage.hiscore;
			}
		else {
			localStorage.hiscore = 0;
			}
		this.levelElem = document.getElementById('level');
		this.speedElem = document.getElementById('speed');
		this.numCargoElem = document.getElementById('numcargo');
		this.speedElem.innerHTML = this.speed;
		this.numCargoElem.innerHTML = this.numCargo;
		this.resizeBoard();
	},
	resizeBoard: function() {
		// resize the board to fit browser...
		var h = window.innerHeight;
		var w = window.innerWidth;
		var borderElem = document.getElementById('border');
		var overlayElem = document.getElementById('overlay');
		var headerElem = document.getElementById('header');
		var boardElem = this.elem;
		board.width = Math.floor(w / 32) - 4;
		board.height = Math.floor(h / 32) - 5;
		borderElem.style.width = ((board.width * 2) + 5 ) + 'em';
		boardElem.style.width = ((board.width * 2) + 2) +  'em';
		overlayElem.style.width = boardElem.style.width;
		borderElem.style.height =  ((board.height * 2) + 5) + 'em';
		boardElem.style.height = ((board.height * 2) + 2) + 'em';
		overlayElem.style.height = boardElem.style.height;
		//headerElem.style.width = ((board.width * 2) -3) + 'em';
		this.numCargo = Math.floor((board.width * board.height) / 3);
		this.initialCargo = this.numCargo;
		//this.numMonsters = Math.floor((board.width * board.height) / 600);
		//if (this.numMonsters < 3) { this.numMonsters = 3; }
		hero.createElement(this.elem);
		this.setup();
	},
	reset: function() {
		this.startTime = 0;
		this.numTrapped = 0;
		this.minutes = 0;
		this.seconds = 0;
		this.rawSeconds = 0;
		this.won = false;
		while (this.elem.childNodes.length > 0) {
			this.elem.childNodes[0].remove();
			}
		this.cargos = [];
		this.monsters = [];
		hero.reset();
		hero.createElement(this.elem);
		hero.board = this;
		board.hero = hero;
		//this.setup();
	},
	setup: function() {
		// Add our monsters
		for (var i=0; i < this.numMonsters; i++) {
			var x = Math.floor(Math.random()*this.width) +1;
			var y = Math.floor(Math.random()*this.height) +1;
			while (this.positionAvailable(x,y) == false || this.distanceFromHero(x,y) < 8) {
				x = Math.floor(Math.random()*this.width) +1;
				y = Math.floor(Math.random()*this.height) +1;
			}
			this.monsters[i] = new monster({x: x, y: y, parentElem: this.elem});
			this.monsters[i].board = this;
			this.monsters[i].number = i;
		}
		// Add moveable cargos
		for (i = 0; i <= this.numCargo; i++) {
			x = Math.floor(Math.random()*(this.width+1));
			y = Math.floor(Math.random()*(this.height+1));
			while (this.positionAvailable(x,y) == false) {
				x = Math.floor(Math.random()*(this.width+1));
				y = Math.floor(Math.random()*(this.height+1));
			}
			this.cargos[i] = new cargo({x: x, y:y, parentElem: this.elem });
			this.cargos[i].board = this;
		}
		// finally add our fixed cargos
		for (i = 0; i <= this.numFixedCargo; i++ ) {
			x = Math.floor(Math.random()*(this.width+1));
			y = Math.floor(Math.random()*(this.height+1));
			while (this.positionAvailable(x,y) == false) {
				x = Math.floor(Math.random()*(this.width+1));
				y = Math.floor(Math.random()*(this.height+1));
				}
			this.fixedcargos[i] = new fixedcargo({x: x, y:y, parentElem: this.elem });
			this.fixedcargos[i].board = this;
		}
	},
	start: function() {
		this._intervalId = setInterval(this.run, this.speed);
	},
	distanceFromHero: function(x,y) {
		var result = 0;
		var xDiff = Math.abs(x - this.hero.x);
		var yDiff = Math.abs(y - hero.y);
		return xDiff + yDiff;
		
	},
	/**
	 * positionAvailable() - used during board setup to determine if a cell
	 * is empty or not.  
	 * 
	 * returns true/false
	 */
	positionAvailable: function(x,y) {
		var result = true;
		for (var i=0; i < this.cargos.length; i++ ) {
			if (this.cargos[i].getX() == x && this.cargos[i].getY() == y) {
				result = false;
			}
		}
		for (var i=0; i < this.monsters.length; i++) {
			if (this.monsters[i].getX() == x && this.monsters[i].getY() == y) {
				result = false;
			}
		}
		for (i=0; i < this.fixedcargos.length; i++) {
			if (this.fixedcargos[i].getX() == x && this.fixedcargos[i].getY() == y) {
				result = false;
				}
			}
		// check to make sure not on top of hero
		if (x == hero.x && y == hero.y) {
			return false;
		}
		return result;
	},
	levelUp: function() {
		this.reset();
		// remove cargo and increase monster speed...
		if (this.numCargo > 100) { this.numCargo -= 10; }
		if (this.numFixedCargo < 20) { this.numFixedCargo += 1; }
		if (this.speed > 500) { this.speed -= 100; }
		this.level += 1;
		this.levelElem.innerHTML = this.level;
		this.speedElem.innerHTML = this.speed;
		this.numCargoElem.innerHTML = this.numCargo;
		console.log(this.numCargo);
		this.setup();
		this.start(); // restart the game loop
	},
	levelOne: function() {
		this.reset();
		this.speed = this.initialSpeed;
		this.numCargo = this.initialCargo;
		this.level = 1;
		this.levelElem.innerHTML = this.level;
		this.setup();
		this.pause();
	},
	play: function() {
		var numTrapped = 0;
		var gamesound = document.getElementById("game"); 
		gamesound.loop = true;
		gamesound.volume = 0.2;
		gamesound.play();
		var d = new Date();
		if (board.startTime == 0) {
			board.startTime = d.valueOf();
			}
		board.rawSeconds = Math.floor((d.valueOf() - board.startTime) / 1000);
		board.seconds = board.rawSeconds % 60;
		board.minutes = Math.floor(board.rawSeconds / 60);
		this.minuteElem.innerHTML = (board.minutes < 10 ? "0" : "") +  board.minutes;
		this.secondElem.innerHTML = (board.seconds < 10 ? "0" : "") + board.seconds;
		if (this.hero.alive == false) {
			alert("Game Over!");
			clearInterval(this._intervalId);
			this.levelOne();
		}
		for (var i=0;i < this.monsters.length; i++) {
			this.monsters[i].move();
			if (this.monsters[i].trapped() == true) {
				numTrapped += 1;
			}
		}
		if (numTrapped == this.numMonsters) {
			alert("You Won!, new level begins when you click ok.");
			
			clearInterval(this._intervalId);
			// set new hiscore if applicable
			if (localStorage.hiscore > hero.moves) {
				localStorage.hiscore = hero.moves;
				this.hiscoreElem.innerHTML = localStorage.hiscore;
			}
			this.levelUp();
		}
	},
	pause: function(mode) {
		console.log(this.pause);
		var gamesound = document.getElementById("game"); 
		gamesound.pause();
		var btnStatus = document.getElementById('btnStatus');
		var overlayElem = document.getElementById('overlay');
		if (btnStatus.value == 'Pause' || mode == 1) {
			overlayElem.style.visibility = 'visible';
			clearInterval(this._intervalId);
			btnStatus.value = "Resume";
			this.paused = true;
			
		}
		else {
			btnStatus.value = "Pause";
			overlayElem.style.visibility="hidden";
			this.paused = false;
			board.start();
		}
	},
	
	resume: function() {
		
	}, 
	run: function() {
		board.play(); // when this is called from main file, "this" is the document window, so I need to use it as a wrapper and thus call board.play...
	}
	
}