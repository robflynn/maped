window['$$'] = (query) => {
	return document.querySelectorAll(query);
}

window['$'] = (query) => {
	return document.querySelector(query);
}

// FIXME: Make me a module
window["PropertyType"] = {
    String: "string",
    Text: "text",
}

const Component = require('./components/component')
const Room = require('./components/room')

const PropertyPane = require('./ui/propertypane')

const EditorEvent = {
	COMPONENT_UNSELECTED: "unselect_component",
	COMPONENT_SELECTED: "select_component"
}

const ToolbarEvent = {
	CREATE_ROOM: "create_room",
	DUMP_SOURCE: "dump"
}

class EventCannon {
	constructor() {
		this.listener = null;
	}

	fireEvent(event, data) {
		if (this.listener) {
			this.listener(event, data);
		}
	}
}

class Toolbar extends EventCannon {
	constructor() {
		super();

		this.id = "toolbar";
		this.buttons = [];	

		this.addButton("Room", () => {
			this.fireEvent(ToolbarEvent.CREATE_ROOM, {});
		});

		this.addButton("Dump", () => {
			this.fireEvent(ToolbarEvent.DUMP_SOURCE, {});
		});
	}

	render() {
		var c = document.createElement("div");
		c.id = this.id;
		c.classList.add("toolbar");

		this.buttons.forEach(button => {
			var b = document.createElement("button");
			b.innerText = button.label;

			b.addEventListener('click', button.callback);

			c.appendChild(b);
		});

		return c;
	}

	addButton(label, callback) {
		this.buttons.push({label: label, callback: callback});
	}
}

class Editor extends EventCannon {
	constructor() {
		super();

		var c = document.createElement("div");
		c.id = "editor";
		c.classList.add('editor');

		// The editor can have many rooms
		this.rooms = [];

		this.currentComponent = null;
		this.rendered = false;
		this.dragging = false;
		this.clickOffset = {
			x: 0,
			y: 0
		};

		this.element = c;
	}

	componentMouseDown(evt, component) {
		this.selectComponent(component);

		this.dragging = true;
		this.clickOffset = {
			x: evt.layerX,
			y: evt.layerY
		};
	}

	componentMouseUp(evt, component) {
		this.dragging = false;
	}

	handleMouseMove(evt) {
		if (this.dragging) {
			var component = this.currentComponent;
			var editor = $("#editor");

			var x = evt.pageX - editor.offsetLeft - this.clickOffset.x + editor.scrollLeft; 
			var y = evt.pageY - editor.offsetTop - this.clickOffset.y + editor.scrollTop; 			

			component.x = x;
			component.y = y;

			component.update();
		}
	}

	render() {
		this.rendered = true;

		this.draw();

		return this.element;
	}

	draw() {
		var c = this.element;

		var sw = document.createElement("div");
		sw.classList.add("contentPane");
		this.contentPane = sw;

		c.addEventListener('mousemove', (evt) => this.handleMouseMove(evt));			

		this.rooms.forEach(room => {
			const rc = room.render();

			rc.addEventListener('mousedown', (evt) => this.componentMouseDown(evt, room));
			rc.addEventListener('mouseup', (evt) => this.componentMouseUp(evt, room));			

			this.contentPane.appendChild(rc);
		});

		c.appendChild(sw);
	}

	update() {
		if (this.rendered) {
			this.element.innerHTML = '';

			this.draw();
		}
	}

	createRoom() {
		var room = new Room();

		this.rooms.push(room);

		return room;
	}

	selectComponent(component) {
		if (this.currentComponent != null) {
			this.unselectComponent(this.currentComponent);
		}

		const c = component.element;

		if (c) {
			c.classList.add("selected");
			this.currentComponent = component;
		}

		this.fireEvent(EditorEvent.COMPONENT_SELECTED, { component: component });
	}

	unselectComponent(component) {
		const c = $(`#${component.component_id}`);

		if (c) {
			c.classList.remove("selected");
		}

		this.fireEvent(EditorEvent.COMPONENT_UNSELECTED, { component: component });		
	}
}

class MapEdApp {
	constructor(containerID) {		
		this.editor = new Editor();
		this.editor.listener = (event, data) => this.handleEditorEvent(event, data);

		this.propertyPane = new PropertyPane();
		this.editor.createRoom();

		this.toolbar = new Toolbar();
		this.toolbar.listener = (event, data) => this.handleToolbarEvent(event, data);

		this.id = "main";

	}

	roomButtonClicked() {
		var room = this.editor.createRoom();

		this.editor.update();		
	}

	handleToolbarEvent(event, data) {
		if (event == ToolbarEvent.CREATE_ROOM) {
			this.roomButtonClicked();
		}

		if (event == ToolbarEvent.DUMP_SOURCE) {
			console.log(this.getJSON());
		}
	}

	getJSON() {
		var data = {
			rooms: []
		};

		for (var i in this.editor.rooms) {
			const room = this.editor.rooms[i];

			data.rooms.push(room.toJSON());
		}

		return data;
	}

	handleEditorEvent(event, data) {
		console.log(event, data);

		switch(event) {
			case EditorEvent.COMPONENT_SELECTED: {
				this.propertyPane.setComponent(data.component);
			}
		}
	}

	render() {
		var c = document.createElement("main");
		c.id = "main";
		c.classList.add("main");

		$("#app").appendChild(c);

		c.appendChild(this.editor.render());
		c.appendChild(this.propertyPane.render());		
		c.appendChild(this.toolbar.render());

		this.editor.selectComponent(this.editor.rooms[0]);
	}
}

const init_app = () => {
	console.log("app init called");

	var app = new MapEdApp("#app");
	app.render();
}

// Main entry point
document.addEventListener('DOMContentLoaded', init_app);

