/**
 * fixedCargo - an immovable cargo, this cannot be moved, only worked around.
 */

fixedcargo = function(config) {
	this.x = 0;
	this.y = 0;
	this.elem = {};
	this.parentElem = {};
	this.init(config);
}

fixedcargo.prototype = {
	constructor: fixedcargo,
	init: function(config) {
		 if (config) {
			 for (prop in config) {
				 this[prop] = config[prop];
	         }
	     }
		 // Create dom element...
		 this.elem = document.createElement('img');
		 this.elem.setAttribute('src','images/crate.png');
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
		return false;
		
	},
	moveDown: function() {
		return false;

	},
	moveLeft: function() {
		return false;
		
	},
	moveRight: function() {
		return false;
		
	},
	canMove: function(x,y,direction) {
		return false;
		
	}
}

