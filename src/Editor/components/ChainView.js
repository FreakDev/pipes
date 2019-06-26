import React from 'react'
import styled from 'styled-components'

import Pipe from './Pipe'

import cssClasses from '../../../sass/Editor/ChainView.sass'

export default ({ chain, onSelect }) => {
    return (
        <div class={ cssClasses.chain_view }>
            { chain.map( (pipe, id) => <Pipe key={ "chain_view_" + id } id {...pipe} onSelect={ onSelect } />) }
        </div>
    )
}