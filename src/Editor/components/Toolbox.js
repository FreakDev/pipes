import React from 'react'

import NewPipeField from './NewPipeField'

export default ({ selected, onAddPipe }) => {
    if (selected) {
        return 'Not Implemeneted yet'
    } else {
        return (
            <NewPipeField onAddPipe={ onAddPipe } />
        )
    }
}