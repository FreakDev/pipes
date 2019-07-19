import React, { useState, useRef } from "react"

import DropZone from "./DropZone"
import Draggable from "./Draggable"

import Pipe from "./Pipe"

import css from "./ChainView.sass"

const ChainView = ({ chain, active, selected, onSelectOne, onClickElseWhere, onDblClickElseWhere, onMovePipe }) => {
    let groups, pipe
    
    // const [chain, setChain] = useState(propChain)
    const [positions, setPositions] = useState([])

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

    const onDrop = (targetId, ev) => {
        ev.stopPropagation()
        console.log(`dropped "${ev.dataTransfer.getData("source_id")}" ${(targetId ? `after  ${targetId}` : "on the floor")}`)
        onMovePipe(ev.dataTransfer.getData("source_id"), targetId)
        setMouseDown(false)
    }

    return (
        <div className={ css.chain_view } onMouseDown={ onMouseDown } onMouseUp={ onMouseUp } onMouseMove={ onMouseMove } onClick={ onClickElseWhere } onDoubleClick={ onDblClickElseWhere }>
            <DropZone classNames={ [css.drop_zone] } onDrop={ onDrop.bind(this, null) }>
                <div className={ css.wrapper_inner } style={ wrapperCoord }>
                    { 
                        groups.map( (group, k) => {
                            const position = {
                                left: 0,
                                top: k * 200
                            }
                            return (
                                <div className={ css.chain } style={ position } key={ "chain_view_chain_" + k }>
                                    <ul>
                                        { group.map((pipe, id) => {
                                            const pipeElement = (<Pipe 
                                                {...pipe}
                                                active={ pipe.id === active }
                                                selected={ selected.indexOf(pipe.id) !== -1 }
                                            />)
                                            return (
                                                <React.Fragment key={ "chain_view_item_wrapper_" + id }>
                                                    <li 
                                                        key="chain_view_item"
                                                        onClick={ (e) => { e.stopPropagation(); onSelectOne(pipe.id) } }
                                                    >
                                                        { active === pipe.id ? 
                                                            <Draggable>{ pipeElement }</Draggable>
                                                            : pipeElement
                                                        }
                                                    </li>
                                                    { active !== pipe.id ? 
                                                        <li
                                                            key="chain_view_drop_zone"
                                                        >
                                                            <DropZone classNames={ [css.drop_zone] } onDrop={ onDrop.bind(this, pipe.id) } />
                                                        </li>
                                                        : null 
                                                    }
                                                </React.Fragment>
                                            )
                                        } ) }
                                    </ul>
                                </div>
                            )
                        }) 
                    }
                </div>
            </DropZone>
        </div>
    )
}

export default ChainView