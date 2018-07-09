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

        this.properties["id"] = { type: PropertyType.String, value: this.component_id };

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

module.exports = Component