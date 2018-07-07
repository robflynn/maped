class Crapper {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.color = "#ff0000";

		this.stroke = {
			color: "#000000",
			size: 1
		};

		this.states = [];
	}

	pushState() {
		let c = this.ctx;

		let state = {
			strokeStyle: c.strokeStyle,
			fillColor: c.fillColor,
			fillStyle: c.fillStyle,
			lineWidth: c.lineWidth
		};

		this.states.push(state);
	}

	popState() {
		let c = this.ctx;

		let state = this.states.pop();

		if (state) {
			c.fillStyle = state.fillStyle;
			c.fillColor = state.fillColor;
			c.strokeStyle = state.strokeStyle;
			c.lineWidth = state.lineWidth;
		}
	}

	rect(x, y, width, height) {
		this.pushState();

		let c = this.ctx;

		c.fillColor = "red";

		c.fillRect(x, y, width, height);

		this.popState();
	}

	line(color, width, sx, sy, ex, ey) {
		this.pushState();

		let c = this.ctx;

		c.strokeStyle = color;
		c.lineWidth = width
		c.beginPath();
		c.moveTo(sx, sy);
		c.lineTo(ex, ey);
		c.stroke();

		this.popState();
	}
}

var crapper

class Tile {
	constructor(x, y) {
		this.x = x
		this.y = y

		this.selected = false
	}

	draw() {
		let c = window.crapper;

		let sx = (this.x * 25);
		let sy = (this.y * 25);

		c.rect(sx, sy, 25 - 1, 25 - 1);
	}
}


class Editor {
	get tileSize() {
		return 25
	}

	constructor(canvasEle) {
		this.canvas = canvasEle;
		this.ctx = this.canvas.getContext("2d");
		this.width = 250;
		this.height = 250;
		this.crapper = new Crapper(this.canvas);
		window.crapper = this.crapper

		this.tiles = [];

		for (var y = 0; y < 10; y++) {
			this.tiles[y] = [];

			for (var x = 0; x < 10; x++) {			
				let tile = new Tile(x, y);

				this.tiles[y][x] = tile;
			}
		}

		this.ctx.translate(0.5, 0.5);		
	}

	update() {
		let c = this.crapper;
		let gridColor = "#999999";

		// Draw our grid first. Everything else will be on top of this
		for (var y = 1; y <= this.height / this.tileSize; y++) {			
			c.line(gridColor, 1, 0, y * this.tileSize, 10000, y * this.tileSize);
		}

		for (var x = 1; x <= this.width / this.tileSize; x++) {			
			c.line(gridColor, 1, x * this.tileSize, 0, x * this.tileSize, 10000);
		}

		for (var y = 0; y < 10; y++) {
			for (var x = 0; x < 10; x++) {			
				this.tiles[y][x].draw();
			}
		}

	}
}

const $$ = (query) => {
	return document.querySelectorAll(query);
}

const $ = (query) => {
	return document.querySelector(query);
}

var editor

const init_app = () => {
	console.log("app init called");

	var canvas = document.createElement("canvas");
	canvas.width = 250;
	canvas.height = 250;

	editor = new Editor(canvas);
	console.log(editor);

	$("#container").appendChild(canvas);

	editor.update()
}

// Main entry point
// document.addEventListener('DOMContentLoaded', init_app);

