import React from 'react'

import cssClasses from '../../../sass/Editor/Pipe.sass'

export default ({ id, name, onSelect }) => (
    <div class={ cssClasses.pipe } onClick={ onSelect.bind(this, id) }>
        { name }
    </div>
)