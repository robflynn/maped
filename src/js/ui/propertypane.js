class PropertyPane {
    constructor() {
        this.currentComponent = null
        this.id = "propertiesPane"
    }

    setComponent(component) {
        this.currentComponent = component

        this.update()
    }

    createPropertyEditor(property) {
        var edit = null

        if (property.type == PropertyType.Text) {

            edit = document.createElement("div")
            edit.classList.add("textarea")
            edit.contentEditable = true
            edit.innerHTML = property.value
        }

        if (property.type == PropertyType.Room) {
            var rooms = app.editor.rooms

            if (rooms.length > 0) {
                edit = document.createElement("select")    
                
                app.editor.rooms.forEach(room => {
                    var option = document.createElement('option')
                    option.value = room.properties.id.value
                    option.innerHTML = room.properties.name.value

                    edit.appendChild(option)
                });
            }
        }

        if (property.type == PropertyType.String) {
            edit = document.createElement("input")    
            edit.type = "text"
            edit.value = property.value
        }

        return edit
    }

    draw() {
        this.element.innerHTML = this.renderHTML()     

        const properties = $$("#propertiesTable .propertyValue")

        properties.forEach(property => {
            property.addEventListener('click', (evt) => {
                const field = property             
                const name = property.getAttribute("data-property-name")
                const value = this.currentComponent.properties[name]
                const propertyStruct = this.currentComponent.properties[name]

                const edit = this.createPropertyEditor(this.currentComponent.properties[name])

                if (edit) {
                    edit.addEventListener('blur', evt => {
                        let newValue

                        if (propertyStruct.type == PropertyType.Text) {
                            newValue = evt.target.innerHTML
                        } else {
                            newValue = evt.target.value
                        }

                        field.innerHTML = newValue

                        // FIXME: This should really be wrapped in some logic - WIP
                        this.currentComponent.properties[name] = { type: propertyStruct.type, value: newValue }
                        this.currentComponent.update()
                    })

                    field.innerHTML = ""
                    field.appendChild(edit)

                    edit.focus()                    
                }
            })
        })
    }

    update() {
        this.draw()
    }

    render() {
        var c = document.createElement('aside')
        c.id = this.id
        c.classList.add("propertiesPane")

        this.element = c

        this.draw()

        return c
    }

    renderHTML() {
        const html = `
            <table id="propertiesTable">
                <thead>
                    <tr>
                        <th colspan="2">
                            Properties
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${this.renderProperties()}
                </tbody>
            </table>
        </aside>
                `

        return html        
    }

    renderProperties() {
        if (this.currentComponent) {
            return this.propertiesHTML(this.currentComponent.properties)
        }

        return ""
    }

    propertiesHTML(properties) {
        var html = ""

        for (var key in properties) {

            if (properties[key].type == PropertyType.Separator) {
                html += `
                    <tr>
                        <th colspan="2">
                            ${properties[key].value }
                        </th>
                    </tr>
                `
            } else {
                html += `
                    <tr class="property">
                        <td class="propertyKey">${key}</td>
                        <td class="propertyValue" data-property-name="${key}">${properties[key].value}</td>
                    </tr>
                `
            }
        }

        return html
    }
}

module.exports = PropertyPane