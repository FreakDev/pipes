import React from "react"

import PipeForm from "./PipeForm"

import cssClasses from "../../../sass/Editor/Toolbox.sass"

export default class Toolbox extends React.Component 
{
    constructor(props) {
        super(props)
    }

    render () {
        const { selected, pipesDefs, onAddPipe } = this.props
        return (
            <div className={ cssClasses.toolbox }>
                {
                    <PipeForm pipesDefs={ pipesDefs } onSubmit={ onAddPipe } />
                }
            </div>
        )
    }
}