import React from "react"

import cssClasses from "../../../sass/Editor/TreeView.sass"

const TreeView = ({ program, path, onSelect }) => {

    const listChild = (context, level = 0) => {
        const active = path.slice().pop()
        return context.pipes ? 
            <ul>
                { context.pipes.map( 
                    (pipe, k) => 
                        <li className={ active === k ? cssClasses.active : "" } onClick={ onSelect.bind(this, k) } key={ "tree_view_" + level + "_" + k }>
                            { pipe.name} { pipe.pipes ? listChild(pipe, ++level) : null }
                        </li> 
                ) }
            </ul>
            : null
    }

    return (
        <div className={ cssClasses.tree_view }>
            { program.name }
            { listChild(program) }
        </div>
    )
}

export default TreeView