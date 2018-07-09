const Component = require('./component')

class Room extends Component {  
    constructor() {
        super();

        this.properties.name = { type: PropertyType.String, value: "Unknown Room" }
        this.properties.description = { type: PropertyType.Text, value: "This room has no description. How would you describe it?" }

        this.properties.sep1 = { type: PropertyType.Separator, value: "Exits" }

        this.properties.north = { type: PropertyType.Room, value: "" }
        this.properties.northeast = { type: PropertyType.Room, value: "" }        
        this.properties.east  = { type: PropertyType.Room, value: "" }        
        this.properties.southeast  = { type: PropertyType.Room, value: "" }                
        this.properties.south = { type: PropertyType.Room, value: "" }                
        this.properties.southwest  = { type: PropertyType.Room, value: "" }
        this.properties.west  = { type: PropertyType.Room, value: "" }        
        this.properties.northwest  = { type: PropertyType.Room, value: "" }                

        this.properties.sep2 = { type: PropertyType.Separator, value: "Escapes" }        
        this.properties.sep3 = { type: PropertyType.Separator, value: "Items" }                
        this.properties.sep4 = { type: PropertyType.Separator, value: "Monsters" }                        

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
            <div class="title">${this.properties.name.value}</div>
            <div class="body">${this.properties.description.value}</div>
        `;

        c.innerHTML = html;             

        return c;       
    }

    update() {
        super.update();

        // FIXME: Make setProperty() functions
        const title = $(`#${this.component_id} .title`);
        const body = $(`#${this.component_id} .body`);

        if (title) { title.innerHTML = this.properties.name.value }
        if (body) { body.innerHTML = this.properties.description.value }
    }
}

module.exports = Room