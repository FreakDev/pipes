import React from "react"

import PipeInspector, { MODE_CREATE, MODE_EDIT } from "./PipeInspector"

import cssClasses from "../../../sass/Editor/Toolbox.sass"

export default class Toolbox extends React.Component 
{
    constructor(props) {
        super(props)
    }

    render () {
        const { active, pipesDefs, onAddPipe } = this.props
        return (
            <div className={ cssClasses.toolbox }>
                {
                    <PipeInspector 
                        pipesDefs={ pipesDefs }
                        value={ active }
                        mode={ active ? MODE_EDIT : MODE_CREATE }
                        onSubmit={ onAddPipe } />
                }
            </div>
        )
    }
}