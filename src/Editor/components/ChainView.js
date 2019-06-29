import React from "react"

import Pipe from "./Pipe"

import cssClasses from "../../../sass/Editor/ChainView.sass"

const ChainView = ({ chain, active, onSelectOne, onClickElseWhere, onDblClickElseWhere }) => {
    let groups
    
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
        
    return (
        <div className={ cssClasses.chain_view } onClick={ onClickElseWhere } onDoubleClick={ onDblClickElseWhere }>
            { 
                groups.map( (group, k) => {
                    return (
                        <ul key={ "chain_view_chain_" + k }>
                            { group.map((pipe, id) => 
                                <li 
                                    className={ pipe.id === active ? cssClasses.active : "" } 
                                    onClick={ (e) => { e.stopPropagation(); onSelectOne(pipe.id) } } 
                                    key={ "chain_view_item_" + id }>
                                    <Pipe 
                                        {...pipe} 
                                        active={ pipe.id === active } />
                                </li>) }
                        </ul>
                    )
                }) 
            }
        </div>
    )
}

export default ChainView