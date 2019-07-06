import React from "react"

import Pipe from "./Pipe"

import cssClasses from "./ChainView.sass"

const ChainView = ({ chain, active, selected, onSelectOne, onClickElseWhere, onDblClickElseWhere }) => {
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
                                    className={[
                                        (selected.indexOf(pipe.id) !== -1 ?  cssClasses.selected : ""),
                                        (pipe.id === active ? cssClasses.active : "")
                                    ].join(" ")}
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
    )
}

export default ChainView