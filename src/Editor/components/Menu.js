import React from "react"

import cssClasses from "./Menu.sass"

const Menu = ({ onLoadProgram, program }) => {
    let fileInput, saveButton

    const handleFiles = function (e) {
        const file = e.target.files[0]

        const reader = new FileReader()
        reader.onloadend = (e) => {
            let program
            try {
                program = JSON.parse(reader.result)
            } catch (e) {
                alert(e)
                return
            }
            
            onLoadProgram(program)
        }
        reader.readAsText(file)
    }

    const clickSave = () => {
        saveButton.href = window.URL.createObjectURL(
            new Blob([JSON.stringify(program)], { type: "application/json" })
        )

        saveButton.setAttribute("download", program.name.replace(/\s+/g, "-") + ".json")

        saveButton.click()
    }

    return  (
        <div className={ cssClasses.menu }>
            <input ref={ r => fileInput = r } type="file" id="fileElem" accept="application/json" style={{ display:"none" }} onChange={ handleFiles } />
            <button onClick={ () => fileInput.click() }>Load File</button>

            <a ref={ r => saveButton = r } style={{ display:"none" }} />
            <button onClick={ clickSave }>Save File</button>
            <h1>PIPES</h1>
        </div>
    )
}

export default Menu