import React from 'react'

import cssClasses from '../../../sass/Editor/Pipe.sass'

export default ({ id, name, params, onSelect }) => (
    <div class={ cssClasses.pipe } onClick={ onSelect.bind(this, id) }>
        { name }
        <ul>
            {
                Object.keys(params).map((paramName, k) => {
                    return <li key={ "pipe_" + k }>{ paramName } : { params[paramName] }</li>
                })
            }
        </ul>
        
    </div>
)