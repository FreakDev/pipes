import React from 'react'

import Pipe from './Pipe'

export default ({ chain }) => {
    return (
        <React.Fragment>
            { chain.map( pipe => <Pipe {...pipe} />) }
        </React.Fragment>
    )
}