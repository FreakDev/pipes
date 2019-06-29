import React from "react"

import cssClasses from "../../../sass/Editor/TreeView.sass"

const TreeView = ({ program, active, onSelect }) => {

    const onClick = (id, e) => {
        if (onSelect(id)) 
            e.stopPropagation()
    }

    const listChild = (context, path, level = 0) => {
        return <ul>
            { context.map( 
                (pipe, k) => {
                    let currentPath = [...path, { id: pipe.id }]
                    return (
                        <li className={ active === pipe.id ? cssClasses.active : "" } 
                            data-path={ currentPath.map(JSON.stringify).join("/") } 
                            onClick={ onClick.bind(this, currentPath) } 
                            key={ "tree_view_" + level + "_" + k } >

                            <span>{ pipe.name}</span>
                            { pipe.pipes ? listChild(pipe.pipes, [...currentPath, "pipes"], ++level) : null }
                        </li> 
                    )
                }
            ) }
        </ul>
    }

    return (
        <div className={ cssClasses.tree_view }>
            { program.name }
            { listChild(program.pipes, ["pipes"]) }
        </div>
    )
}

export default TreeView