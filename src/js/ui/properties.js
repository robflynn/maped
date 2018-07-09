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
                    ${this.renderProperties()}
                </tbody>
            </table>
        </aside>
                `;

        return html;        
    }

    renderProperties() {
        if (this.currentComponent) {
            return this.propertiesHTML(this.currentComponent.properties);
        }

        return "";
    }

    propertiesHTML(properties) {
        var html = "";

        for (var key in properties) {

            if (Array.isArray(properties[key])) {
                html += `
                    <th colspan="2">
                        ${key}
                    </th>

                    ${this.propertiesHTML(properties[key])}
                `;
            } else {
                html += `
                    <tr class="property">
                        <td class="propertyKey">${key}</td>
                        <td class="propertyValue" data-property-name="${key}">${properties[key]}</td>
                    </tr>
                `;
            }
        }

        return html;
    }
}

module.exports = PropertyPane