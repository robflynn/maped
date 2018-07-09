const Component = require('./component')

class Room extends Component {  
    constructor() {
        super();

        this.properties["name"] = "Unknown Room"
        this.properties["description"] = "This room has no description."
        this.properties["exits"] = []
        this.properties["exits"]["north"] = "boo"

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

module.exports = Room