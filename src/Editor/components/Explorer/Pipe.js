import React from "react"

import css from "./Pipe.sass"

const Pipe = ({ name, params, active, selected }) => {
    const lastDotIndex = name.lastIndexOf(".") + 1
    return (
        <div data-name={ name } className={ [
            css.pipe,
            selected ?  css.selected : "",
            active ? css.active : ""
        ].join(" ") }>
            <div className={ css.header }>
                { lastDotIndex !== -1 ? <span className={ css.namespace }>{ name.substr(0, lastDotIndex) }</span> : null }
                { lastDotIndex !== -1 ? name.substr(lastDotIndex) : name }
            </div>
            <div className={ css.body }>
                {
                    params ? 
                        <ul className={ css.params }> 
                            { Object.keys(params).map((paramName, k) => {
                                return <li key={ "pipe_" + k }>{ paramName } : { JSON.stringify(params[paramName]) }</li>
                            }) }
                        </ul>
                        : null
                }
            </div>
        </div>
    )
}

export default Pipe