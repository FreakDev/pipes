import React, { useState } from "react"

import Pipe from "./Pipe"

import css from "./ChainView.sass"

const ChainView = ({ chain, active, selected, onSelectOne, onClickElseWhere, onDblClickElseWhere }) => {
    let groups
    
    const [isMouseDown, setMouseDown] = useState(false)
    const [wrapperCoord, setWrapperCoord] = useState({top: 10, left:10})

    groups = chain.filter((e) => !e.previous).map(head => {
        let group = [],
            current = head,
            next
        do {
            group.push(Object.assign({}, current))
            next = chain.find(e => e.previous === current.id)
            current = next
        } while(next)
        return group
    })
        
    const onMouseDown = () => setMouseDown(true)
    const onMouseUp = () => setMouseDown(false)
    const onMouseMove = (e) => {
        if (isMouseDown) {
            setWrapperCoord({left: wrapperCoord.left + e.movementX, top: wrapperCoord.top + e.movementY})
        }
    }

    return (
        <div className={ css.chain_view } onMouseDown={ onMouseDown } onMouseUp={ onMouseUp } onMouseMove={ onMouseMove } onClick={ onClickElseWhere } onDoubleClick={ onDblClickElseWhere }>
            <div className={ css.wrapper_inner } style={ wrapperCoord }>
                { 
                    groups.map( (group, k) => {
                        return (
                            <ul key={ "chain_view_chain_" + k }>
                                { group.map((pipe, id) => 
                                    <li 
                                        onClick={ (e) => { e.stopPropagation(); onSelectOne(pipe.id) } } 
                                        key={ "chain_view_item_" + id }>
                                        <Pipe 
                                            {...pipe}
                                            active={ pipe.id === active }
                                            selected={ selected.indexOf(pipe.id) !== -1 } />
                                    </li>) }
                            </ul>
                        )
                    }) 
                }
            </div>
        </div>
    )
}

export default ChainView