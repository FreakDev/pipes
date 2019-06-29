import React from "react"

import cssClasses from "../../../sass/Editor/Pipe.sass"

const Pipe = ({ name, params }) => (
    <div data-name={ name } className={ cssClasses.pipe }>
        { name }
        <ul>
            {
                params ? 
                    Object.keys(params).map((paramName, k) => {
                        return <li key={ "pipe_" + k }>{ paramName } : { JSON.stringify(params[paramName]) }</li>
                    })
                    : null
            }
        </ul>
        
    </div>
)


export default Pipe