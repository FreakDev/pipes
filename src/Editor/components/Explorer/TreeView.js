import React, { useState } from "react"

import FreeField from "./formFields/FreeField"

import cssClasses from "./TreeView.sass"

const TreeView = ({ 
    program, 
    active, 
    onSelect, 
    activePath, 
    onNavigateDown,
    onChangeProgramName }) => {

    const [openedPath, setOpenedPath] = useState([])

    const toggleOpenPath = (path, e) => {
        e.stopPropagation && e.stopPropagation()

        const pathAsString = JSON.stringify(path)
        const openedPathIndex = openedPath.indexOf(pathAsString)
        if (openedPathIndex === -1)
            setOpenedPath([...openedPath, pathAsString])
        else 
            setOpenedPath([...openedPath.slice(0, openedPathIndex), ...openedPath.slice(openedPathIndex + 1)])
    }

    const activePathAsString = JSON.stringify(activePath)

    const onClick = (path, e) => {
        if (JSON.stringify(path) === activePathAsString) {
            setOpenedPath([...openedPath, activePathAsString])
            return onNavigateDown() && e.stopPropagation()
        }

        return onSelect(path) && e.stopPropagation()
    }

    const onValidateField = (value) => {
        onChangeProgramName("name", value)
    }

    const listChild = (context, path, level = 0) => {
        return <ul>
            { context.map( 
                (pipe, k) => {
                    let currentPath = [...path, { id: pipe.id }]
                    const pathAsString = JSON.stringify(currentPath)
                    return (
                        <li className={ [active === pipe.id ? cssClasses.active : null, cssClasses[pipe.type.substr(pipe.type.lastIndexOf("-") + 1)]].join(" ") } 

                            data-path={ currentPath.map(JSON.stringify).join("/") } 
                            onClick={ onClick.bind(this, currentPath) } 
                            key={ "tree_view_" + level + "_" + k } >
                            { pipe.pipes ? 
                                <span onClick={ toggleOpenPath.bind(this, currentPath) } >
                                    { openedPath.indexOf(pathAsString) !== -1 ? 
                                        <i className="icofont-caret-down"></i>
                                        : <i className="icofont-caret-right"></i>
                                    }
                                </span>
                                : null
                            }
                            <span>{ pipe.name }</span>
                            { pipe.pipes ? 
                                ( openedPath.indexOf(pathAsString) !== -1 ? listChild(pipe.pipes, [...currentPath, "pipes"], ++level) : null)
                                : null 
                            }
                        </li> 
                    )
                }
            ) }
        </ul>
    }

    return (
        <div className={ cssClasses.tree_view }>
            <FreeField name="program-name" value={ program.name } placeholder="[ Nom de Votre projet ]" onValidate={ onValidateField } />
            { listChild(program.pipes, ["pipes"]) }
        </div>
    )
}

export default TreeView