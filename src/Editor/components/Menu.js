import React from "react"

import cssClasses from "./Menu.sass"

const Menu = ({ onLoadProgram }) => {
    let fileInput

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

    return  (
        <div className={ cssClasses.menu }>
            <input ref={ r => fileInput = r } type="file" id="fileElem" accept="application/json" style={{ display:"none" }} onChange={ handleFiles } />
            <button onClick={ () => fileInput.click() }>Load File</button>
            <button>Save File</button>
            <h1>PIPES</h1>
        </div>
    )
}

export default Menu