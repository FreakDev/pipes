import React from "react"

import { TYPE_LABELS } from "../../constants"

import css from "./Pipe.sass"

const Pipe = ({ name, type, params, active, selected }) => {
    const lastDotIndex = name.lastIndexOf(".")

    return (
        <div data-name={ name } className={ [
            css.pipe,
            selected ?  css.selected : "",
            active ? css.active : "",
            css[type.substr(type.lastIndexOf("-") + 1)]
        ].join(" ") }>
            <div className={ css.header }>
                <span className={ css.namespace }>
                    { lastDotIndex !== -1 ? name.substr(0, lastDotIndex) : TYPE_LABELS[type] }
                </span>
                { lastDotIndex !== -1 ? name.substr(lastDotIndex + 1) : name }
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