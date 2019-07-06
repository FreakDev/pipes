import React from "react"
import RunPanel from "./RunPanel"

import cssClasses from "./GenerateButton.sass"

export default class GenerateButton extends React.Component {

    constructor(props) {
        super(props)

        this.generate = this.generate.bind(this)
    }

    generate() {
        console.log(this.props.program)
    }

    render () {
        return (
            <div className={ cssClasses.generate_button }>
                <button onClick={ this.generate }>Generate</button>
                <RunPanel program={ this.props.program } onDebuggerHighlight={ this.props.onDebuggerHighlight } />
            </div>
        )
    }
}