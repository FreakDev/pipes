import React from 'react'

import NewPipeField from './NewPipeField'
import PipeForm from './PipeForm'

import cssClasses from '../../../sass/Editor/Toolbox.sass'

export default ({ selected, onAddPipe, cssClass }) => {
    return (
        <div class={ cssClasses.toolbox + ' ' + cssClass }>
            {
                !selected ?
                    <NewPipeField onAddPipe={ onAddPipe } />
                    : <PipeForm value={ selected } />
            }
        </div>
    )
}