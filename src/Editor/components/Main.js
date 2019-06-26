import React from "react"

import Menu from "./Menu"
import ChainView from "./ChainView"
import Toolbox from "./Toolbox"
import TreeView from "./TreeView"
import GenerateButton from "./GenerateButton"

import PIPES_DEFINITIONS from "../../pipes-definitions.json"

import cssClasses from "../../../sass/Editor/Main.sass"

export const PIPE_TYPE_FUNC = 'pipe-func'
export const PIPE_TYPE_NATIVE = 'pipe-native'
export const PIPE_TYPE_VAR = 'pipe-var'

const INITIAL_PROGRAM = {
    name: "",
    type: PIPE_TYPE_FUNC,
    pipes: []  
}

export default class Main extends React.Component {

    state = {
        focused: null,
        program: INITIAL_PROGRAM,
        currentPath: ['pipes']
    }

    constructor(props) {
        super(props)

        this.onAddPipe = this.onAddPipe.bind(this)
    }

    onAddPipe(pipe) {
        let newProgram = { ...this.state.program }
        newProgram.pipes = [...this.state.program.pipes, pipe]
        this.setState({
            program: newProgram
        })
    }

    onFocus(id) {
        this.setState({
            focused: id
        })
    }

    resolveCurrentPath() {
        let base = this.state.program
        this.state.currentPath.forEach(path => {
            base = base[path]
        });
        return base
    }

    render() {
        const { program, focused } = this.state

        return (
            <div class={ cssClasses.main }>
                {/* <Menu /> */}
                <GenerateButton program={ program } />
                <TreeView program={ program } />
                <ChainView chain={ this.resolveCurrentPath() } onSelect={ this.onFocus } />
                <Toolbox 
                    cssClass={ focused ? "open" : "" } 
                    selected={ focused ? null : null } 
                    pipesDefs={ PIPES_DEFINITIONS }
                    onAddPipe={ this.onAddPipe } />
            </div>
        )
    }
}