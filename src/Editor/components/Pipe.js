import React from "react"

import cssClasses from "../../../sass/Editor/Pipe.sass"

const Pipe = ({ id, name, params }) => (
    <div className={ cssClasses.pipe }>
        { name }
        <ul>
            {
                params ? 
                    Object.keys(params).map((paramName, k) => {
                        return <li key={ "pipe_" + k }>{ paramName } : { params[paramName] }</li>
                    })
                    : null
            }
        </ul>
        
    </div>
)


export default Pipe