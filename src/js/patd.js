const $$ = (query) => {
	return document.querySelectorAll(query);
}

const $ = (query) => {
	return document.querySelector(query);
}

window.__cpt_cnt = 1;

class Component {		
	constructor() {
		this.x = 10;
		this.y = 10;

		var id = "item"+(new Date()).getMilliseconds()+Math.floor(Math.random()*1000);

		while(document.getElementById(id)) {
		    id += 1;		
		}

		this.id = id;
	}

	render() {		
		var c = document.createElement('div');
		c.id = "component_" + this.id;
		c.classList.add('component');
		c.classList.add('draggable');

		return c;
	}
}

class Room extends Component {	
	constructor() {
		super();

		this.name = "Unknown Room"
		this.description = "This room has no description."
	}

	render() {
		var c = super.render();

		c.classList.add('room');

		let html = `
<div class="title">${this.name}</div>
<div class="body">${this.description}</div>
		`;

		c.innerHTML = html;

		return c;
	}
}

class Editor {
	constructor() {
		// The editor can have many rooms
		this.rooms = [];
	}

	createRoom() {
		var room = new Room();

		this.rooms.push(room);

		let component = room.render();
		$("#editor").appendChild(component);

		return room;
	}
}

var editor = null;

const roomClicked = (e) => {
	console.log("Room was clicked");

	var room = editor.createRoom();
}

const setup_listeners = () => {
	$("#roomButton").addEventListener('click', roomClicked);
}

const init_app = () => {
	console.log("app init called");

	editor = new Editor();

	setup_listeners();
}

// Main entry point
document.addEventListener('DOMContentLoaded', init_app);

