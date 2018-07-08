const $$ = (query) => {
	return document.querySelectorAll(query);
}

const $ = (query) => {
	return document.querySelector(query);
}

class Component {		
	constructor() {
		this.x = 10;
		this.y = 10;

		this.properties = [];

		var id = (new Date()).getMilliseconds()+Math.floor(Math.random()*1000);

		while(document.getElementById(id)) {
		    id += 1;		
		}

		this.id = id;
		this.component_name = this.constructor.name.toLowerCase();		
		this.component_id = this.component_name + "_" + this.id;

		var c = document.createElement('div');
		c.id = this.component_id;
		c.classList.add('room');				
		c.classList.add('component');

		this.element = c;
	}

	render() {		
		return this.element;
	}
}

class Room extends Component {	
	constructor() {
		super();

		this.properties["name"] = "Unknown Room"
		this.properties["description"] = "This room has no description."
	}

	render() {
		var c = super.render();

		let html = `
			<div class="title">${this.properties.name}</div>
			<div class="body">${this.properties.description}</div>
		`;

		c.innerHTML = html;

		return c;
	}
}

const EditorEvent = {
	COMPONENT_UNSELECTED: "unselect_component",
	COMPONENT_SELECTED: "select_component"
}

class Toolbar {
	constructor() {
		this.id = "toolbar";
		this.buttons = [];		

		this.addButton("Room", () => {});
	}

	render() {
		var c = document.createElement("div");
		c.id = this.id;
		c.classList.add("toolbar");

		this.buttons.forEach(button => {
			var b = document.createElement("button");
			console.log(button);
			b.innerText = button.label;

			c.appendChild(b);
		});

		return c;
	}

	addButton(label, callback) {
		this.buttons.push({label: label, callback: callback});
	}
}

class PropertyPane {
	constructor() {
		this.currentComponent = null;
		this.id = "propertiesPane";
	}

	setComponent(component) {
		this.currentComponent = component;

		this.update();
	}

	update() {
		this.element.innerHTML = this.renderHTML();
	}

	render() {
		var c = document.createElement('aside');
		c.id = this.id;
		c.classList.add("propertiesPane");

		c.innerHTML = this.renderHTML();

		return c;
	}

	renderHTML() {
		const html = `
			<header>
				Properties
			</header>

			<table id="propertiesTable">
				<thead>
					<tr>
						<th>
							Name
						</th>
						<th>
							Value
						</th>
					</tr>
				</thead>
				<tbody>
					${this.propertiesHTML()}
				</tbody>
			</table>
		</aside>
				`;

		return html;		
	}

	propertiesHTML() {
		var html = "";

		var component = this.currentComponent;		

		if (component) {
			for (var key in component.properties) {
				html += `
					<tr>
						<td>${key}</td>
						<td>${component.properties[key]}</td>
					</tr>
				`;
			}
		}

		return html;
	}

	update() {
		var c = $(`#${this.id}`);

		if (c) {
			c.innerHTML = this.renderHTML();
		}
	}
}

class Editor {
	constructor() {
		// The editor can have many rooms
		this.rooms = [];

		this.currentComponent = null;
		this.listener = null;
	}

	componentSelected(evt, component) {		
		this.selectComponent(component);
	}

	fireEvent(eventType, data) {
		if (this.listener) {
			this.listener(eventType, data);
		}
	}

	render() {
		var c = document.createElement("div");
		c.id = "editor";
		c.classList.add('editor');

		this.rooms.forEach(room => {
			const roomComponent = room.render();

			roomComponent.addEventListener('click', (evt) => this.componentSelected(evt, room));

			c.appendChild(roomComponent);
		});

		return c;
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

		this.id = "main";
	}

	roomButtonClicked() {
		var room = this.editor.createRoom();
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
	}
}

const init_app = () => {
	console.log("app init called");

	var app = new MapEdApp("#app");
	app.render();
}

// Main entry point
document.addEventListener('DOMContentLoaded', init_app);

