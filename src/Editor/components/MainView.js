import React from 'react'
import styled from 'styled-components'

import Pipe from './Pipe'

import cssClasses from '../../../sass/Editor/MainView.sass'

export default ({ chain, onSelect }) => {
    return (
        <div class={ cssClasses.main_view }>
            { chain.map( (pipe, id) => <Pipe id {...pipe} onSelect={ onSelect } />) }
        </div>
    )
}