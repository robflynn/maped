const $$ = (query) => {
	return document.querySelectorAll(query);
}

const $ = (query) => {
	return document.querySelector(query);
}


class Component {		
	constructor() {
		this.x = 100;
		this.y = 100;

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

		c.style.left = this.x + "px";
		c.style.top = this.y + "px";

		this.properties["id"] = this.component_id;

		this.element = c;
	}	

	update() {
		var c = this.element;

		c.style.left = this.x + "px";
		c.style.top = this.y + "px";		
	}

	render() {		
		return this.element;
	}

	toJSON() {
		return this.properties;
	}
}

class Room extends Component {	
	constructor() {
		super();

		this.properties["name"] = "Unknown Room"
		this.properties["description"] = "This room has no description."

		console.log(this.properties);
	}

	render() {
		var c = super.render();

		this.draw();

		return c;
	}

	draw() {
		var c = this.element;

		let html = `
			<div class="title">${this.properties.name}</div>
			<div class="body">${this.properties.description}</div>
		`;

		c.innerHTML = html;				

		return c;		
	}

	update() {
		super.update();
		
		const title = $(`#${this.component_id} .title`);
		const body = $(`#${this.component_id} .body`);

		if (title) { title.innerHTML = this.properties["name"] }
		if (body) { body.innerHTML = this.properties["description"] }
	}
}

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

class PropertyPane {
	constructor() {
		this.currentComponent = null;
		this.id = "propertiesPane";
	}

	setComponent(component) {
		this.currentComponent = component;

		this.update();
	}

	draw() {
		this.element.innerHTML = this.renderHTML();		

		const properties = $$("#propertiesTable .propertyValue");

		properties.forEach(property => {
			property.addEventListener('click', (evt) => {
				const field = property;				
				const name = property.getAttribute("data-property-name");
				const value = this.currentComponent.properties[name];

				const edit = document.createElement("input") 
				edit.type = "text";
				edit.value = value;

				edit.addEventListener('blur', evt => {
					const newValue = evt.target.value;

					field.innerHTML = newValue;

					this.currentComponent.properties[name] = newValue;
					this.currentComponent.update();
				})

				field.innerHTML = "";
				field.appendChild(edit);

				edit.focus();
			});
		});
	}

	update() {
		this.draw();
	}

	render() {
		var c = document.createElement('aside');
		c.id = this.id;
		c.classList.add("propertiesPane");

		this.element = c;

		this.draw();

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
					<tr class="property">
						<td class="propertyKey">${key}</td>
						<td class="propertyValue" data-property-name="${key}">${component.properties[key]}</td>
					</tr>
				`;
			}
		}

		return html;
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
	}
}

const init_app = () => {
	console.log("app init called");

	var app = new MapEdApp("#app");
	app.render();
}

// Main entry point
document.addEventListener('DOMContentLoaded', init_app);

