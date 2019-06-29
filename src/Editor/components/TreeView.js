import React from "react"

import FreeField from "./formFields/FreeField"
import OneOfField from "./formFields/OneOfField"

import cssClasses from "../../../sass/Editor/TreeView.sass"

const TreeView = ({ program, active, onSelect, onChangeProgramName }) => {

    const onClick = (id, e) => {
        if (onSelect(id)) 
            e.stopPropagation()
    }

    const onValidateField = (value) => {
        onChangeProgramName(["name"], value)
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
            {/* <FreeField name="program-name" value={ program.name } onValidate={ onValidateField } /> */}
            <OneOfField name="program-name" value={ program.name } availableValues={ ['a', 'b'] } onValidate={ onValidateField } />
            { listChild(program.pipes, ["pipes"]) }
        </div>
    )
}

export default TreeView