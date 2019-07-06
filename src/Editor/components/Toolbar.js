import React from "react"

import GenerateButton from "./Toolbar/GenerateButton"
import Menu from "./Toolbar/Menu"

import css from "./Toolbar.sass"

export default class Toolbar extends React.Component 
{
    constructor(props) {
        super(props)

        this.onLoadProgram = this.onLoadProgram.bind(this)
        this.onDebuggerHighlight = this.onDebuggerHighlight.bind(this)
    }


    onLoadProgram(program) {
        this.props.loadProgram(program)
    }


    onDebuggerHighlight(path) {
        // this.navigateTo(path)
    }

    render () {
        const { program } = this.props

        return (
            <div className={ css.toolbar }>
                <GenerateButton onDebuggerHighlight={ this.onDebuggerHighlight } program={ program } />
                <Menu onLoadProgram={ this.onLoadProgram } program={ program } />
            </div>
        )
    }
}