import React from "react"

import cssClasses from '../../../sass/Editor/TreeView.sass'

const listChild = (context, level = 0) => {
    return <ul>
        { context.pipes.map( (pipe, k) => <li key={ "tree_view_" + level + "_" + k }>{ pipe.name} { pipe.pipes ? listChild(pipe.pipes, ++level) : null }</li> ) }
    </ul>
}

export default ({ program }) => {
    return (
        <div class={ cssClasses.tree_view }>
            { program.name }
            { listChild(program) }
        </div>
    )
}