import React from "react"

import Toolbar from "../containers/Toolbar"
import Explorer from "../containers/Explorer"
import Runner from "../containers/Runner"

import css from "./Editor.sass"

const Editor = () => {
    return (
        <div className={ css.grid }>
            <div className={ css.row_top }>
                <Toolbar />
            </div>
            <div className={ css.row_main }>
                <Explorer />
                <Runner />
            </div>
        </div>
    )
}

export default Editor