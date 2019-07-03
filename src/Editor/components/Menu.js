import React from "react"

import cssClasses from "./Menu.sass"

const Menu = () => {
    return  (
        <div className={ cssClasses.menu }>
            <button>Load File</button>
            <button>Save File</button>
            <h1>PIPES</h1>
        </div>
    )
}

export default Menu