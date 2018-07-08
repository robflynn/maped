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

		var id = (new Date()).getMilliseconds()+Math.floor(Math.random()*1000);

		while(document.getElementById(id)) {
		    id += 1;		
		}

		this.id = id;
		this.component_name = this.constructor.name.toLowerCase();		
		this.component_id = this.component_name + "_" + this.id;

	}

	render() {		
		var c = document.createElement('div');
		c.id = this.component_id;
		c.classList.add('room');				
		c.classList.add('component');

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

		let html = `
<div class="title">${this.name}</div>
<div class="body">${this.description}</div>
		`;

		c.innerHTML = html;

		return c;
	}
}

const EditorEvent = {
	ComponentUnselected: "unselect_component",
	ComponentSelected: "select_component"
}

class Editor {
	constructor() {
		// The editor can have many rooms
		this.rooms = [];

		this.currentComponent = null;
		this.listener = null;

		// Setup event listeners
		var editor = $("#editor");
	}

	componentSelected(evt, component) {		
		this.selectComponent(component);
	}

	fireEvent(eventType, data) {
		if (this.listener) {
			this.listener(eventType, data);
		}
	}

	createRoom() {
		var room = new Room();

		this.rooms.push(room);

		let component = room.render();
		$("#editor").appendChild(component);

		component.addEventListener("click", evt => this.componentSelected(evt, room));

		return room;
	}

	selectComponent(component) {
		if (this.currentComponent != null) {
			this.unselectComponent(this.currentComponent);
		}

		const c = $(`#${component.component_id}`);

		if (c) {
			c.classList.add("selected");
			this.currentComponent = component;
		}

		this.fireEvent(EditorEvent.ComponentSelected, { component: component });
	}

	unselectComponent(component) {
		const c = $(`#${component.component_id}`);
		console.log(c);

		if (c) {
			c.classList.remove("selected");
		}

		this.fireEvent(EditorEvent.ComponentUnselected, { component: component });		
	}
}

class MapEdApp {
	constructor() {		
		this.editor = new Editor();
		this.editor.listener = (event, data) => this.handleEditorEvent(event, data);

		this.setupListeners();

		this.editor.createRoom();
	}

	roomButtonClicked() {
		var room = this.editor.createRoom();
	}

	setupListeners() {
		$("#roomButton").addEventListener('click', () => this.roomButtonClicked());
	}

	handleEditorEvent(event, data) {
		console.log(event, data);
	}
}

const init_app = () => {
	console.log("app init called");

	var app = new MapEdApp();
}

// Main entry point
document.addEventListener('DOMContentLoaded', init_app);

