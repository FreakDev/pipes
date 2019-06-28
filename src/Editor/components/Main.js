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

const INITIAL_PROGRAM = {
    name: "",
    type: PIPE_TYPE_FUNC,
    pipes: //[]  

    [{
        id: "1", name: "valueToAdd",
        type: "pipe-var",
        value: 4
    },
    {
        id: "2", name: "firstValueToAdd",
        type: "pipe-var",
        value: 4
    },

    {
        id: "3", name: "main",
        type: "pipe-func",
        pipes: [{
            id: "20", name: "event.listen",
            type: "pipe-native",
            params: {
                eventName: "input",
                invoke: "incValue"
            }
        }]
    },
    
    {
        id: "4", name: "incValue",
        type: "pipe-func",
        pipes: [{
            id: "5", name: "stdlib.read",
            type: "pipe-native",
            params: {
                id: "21", name: "firstValueToAdd"
            } 
        },
        {
            id: "6", name: "math.add",
            type: "pipe-native",
            params: {
                valueToAdd: 1
            }, previous: "5"
        },
        {
            id: "7", name: "stdlib.write",
            type: "pipe-native",
            params: {
                id: "22", name: "firstValueToAdd"
            }, previous: "6" 
        }
        ,
        {
            id: "8", name: "stdlib.log",
            type: "pipe-native",
            params: {
                before: "a "
            }, previous: "7"
        }
        ,
        {
            id: "9", name: "stdlib.read",
            type: "pipe-native",
            params: {
                name: "firstValueToAdd"
            }, previous: "8" 
        },
        {
            id: "10", name: "stdlib.log",
            type: "pipe-native",
            params: {
                before: "b "
            }, previous: "9"
        },
        {
            id: "11", name: "stdlib.invoke",
            type: "pipe-native",
            params: {
                identifier: "addAValue"
            } , previous: "10"
        }
        ]
    },

    {
        id: "12", name: "addAValue",
        type: "pipe-func",
        pipes : [{
            id: "13", name: "stdlib.read",
            type: "pipe-native",
            params: {
                id: "24", name: "firstValueToAdd"
            } 
        },
        {
            id: "14", name: "math.add",
            type: "pipe-native",
            params: {
                // valueToAdd: 3
                getValueToAdd: { 
                    id: "15", name: "stdlib.read", 
                    type: "pipe-native",
                    params: { 
                        id: "16", name: "valueToAdd" 
                    }
                }
            }, previous: "13"
        }
        ,
        {
            id: "17", name: "stdlib.log",
            type: "pipe-native",
            params: {
                before: "c "
            }, previous: "14"
        },
        {
            id: "18", name: "stdlib.read",
            type: "pipe-native",
            params: {
                id: "25", name: "firstValueToAdd"
            }, previous: "17" 
        },
        {
            id: "19", name: "stdlib.log",
            type: "pipe-native",
            params: {
                before: "d "
            }, previous: "18"
        }]
    }]


}

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
                <ChainView chain={ this.resolveCurrentPath(true) } active={ this.resolveCurrentPath().id } onSelect={ this.onFocusById } />
                <Toolbox 
                    selected={ focused ? null : null } 
                    pipesDefs={ PIPES_DEFINITIONS }
                    onAddPipe={ this.onAddPipe } />
            </div>
        )
    }
}