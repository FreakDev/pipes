import React from "react"

import RunPanel from "./Toolbar/RunPanel"
import Menu from "./Toolbar/Menu"

import css from "./Toolbar.sass"

const Toolbar = ({ program, loadProgram }) => {
    return (
        <div className={ css.toolbar }>
            <div className={ css.status }>
                <h1>PIPES</h1>
                <Menu onLoadProgram={ loadProgram } program={ program } />
            </div>
            <div className={ css.ribbon }>
                <RunPanel program={ program } onDebuggerHighlight={ () => {} } />
            </div>
        </div>
    )
}

export default Toolbar