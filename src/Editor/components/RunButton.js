import React from "react"

import cssClasses from "../../../sass/Editor/GenerateButton.sass"

export default class RunButton extends React.Component {

    constructor(props) {
        super(props)

        this.generate = this.generate.bind(this)
    }

    generate() {
        console.log(this.props.program)
    }

    render () {
        return (
            <button className={ cssClasses.generate_button } onClick={ this.generate }>Generate</button>
        )
    }
}