import React from 'react'

import PipeForm from "./PipeForm"

import cssClasses from "../../../sass/Editor/PipeInspector.sass"

export const MODE_CREATE = "mode-create"
export const MODE_EDIT = "mode-edit"

const PipeInspector = ({ active, pipesDefs, pipesInScope, onCreate, onSave, onRemove }) => {

    return <div className={ cssClasses.pipe_inspector }>
        { 
            active ?
                <PipeForm 
                    label={ "Edit " + active.name }
                    value={ active }
                    pipesDefs={ pipesDefs }
                    onSubmit={ onSave.bind(this, active) }
                    onRemove={ onRemove.bind(this, active) }
                    pipesInScope={ pipesInScope }
                />
                : null
        }
        <PipeForm 
            pipesDefs={ pipesDefs }
            onSubmit={ onCreate }
            pipesInScope={ pipesInScope }
        />
    </div>

}

export default PipeInspector