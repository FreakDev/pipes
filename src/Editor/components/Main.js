import React from "react"

import uuid from "uuid/v4"

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

// const INITIAL_PROGRAM = {
//     name: "",
//     type: PIPE_TYPE_FUNC,
//     pipes: []  
// }

import INITIAL_PROGRAM from "../../pipes-source-2.json"

export default class Main extends React.Component {

    state = {
        program: INITIAL_PROGRAM,
        currentPath: ['pipes']
    }

    constructor(props) {
        super(props)

        this.onAddPipe = this.onAddPipe.bind(this)
        this.onFocus = this.onFocus.bind(this)
        this.onFocusById = this.onFocusById.bind(this)
    }

    onAddPipe(pipe, connected) {
        let newProgram = { ...this.state.program }

        pipe.id = uuid()

        if (connected) {
            let currentPipe = this.resolveCurrentPath()
            pipe.previous = currentPipe.id
        }

        newProgram.pipes = [...this.state.program.pipes, pipe]

        this.setState({
            program: newProgram,
        })

        this.onFocus(newProgram.pipes.length -1)
    }

    onFocus(idx) {
        let newPath = this.state.currentPath.slice()
        let lastPath = newPath.pop()

        if (typeof lastPath !== "number")
            newPath.push(lastPath)

        newPath.push(idx)

        this.setState({
            currentPath: newPath
        })
    }

    onFocusById(id) {
        const index = this.resolveCurrentPath(true).findIndex(e => e.id === id)

        if (index != -1) {
            this.onFocus(index)
        }
    }

    resolveCurrentPath(digUntilLastFolder = false) {
        let base = this.state.program
        for(let idx = 0, len = this.state.currentPath.length; idx < len; idx++) {
            let path = this.state.currentPath[idx]
            if (digUntilLastFolder && idx === len - 1 && typeof path === "number") {
                break
            }
            base = base[path]
        }
        return base
    }

    render() {
        const { program, focused, currentPath } = this.state

        return (
            <div className={ cssClasses.main }>
                {/* <Menu /> */}
                <GenerateButton program={ program } />
                <TreeView program={ program } path={ currentPath } onSelect={ this.onFocus } />
                <ChainView chain={ this.resolveCurrentPath(true, -1) } active={ this.resolveCurrentPath().id } onSelect={ this.onFocusById } />
                <Toolbox 
                    selected={ focused ? null : null } 
                    pipesDefs={ PIPES_DEFINITIONS }
                    onAddPipe={ this.onAddPipe } />
            </div>
        )
    }
}