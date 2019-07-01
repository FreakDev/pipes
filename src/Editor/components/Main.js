import React from "react"

import uuid from "uuid/v4"

import Menu from "./Menu"
import ChainView from "./ChainView"
import PipeInspector from "./PipeInspector"
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

const __dir = (path) => {
    let newPath = path.slice()
    while(typeof newPath[newPath.length - 1] !== "string") newPath.pop()
    return newPath
}

const __resolvePath = (context, path) => {
    let base = context
    for(let idx = 0, len = path.length; idx < len; idx++) {
        let curPath = path[idx]
        if (typeof curPath !== "string")
        curPath = base.findIndex(e => e.id === curPath.id)

        base = base[curPath]

        if (base === undefined)
            return undefined
    }
    return base
}

export default class Main extends React.Component {

    state = {
        program: INITIAL_PROGRAM,
        currentPath: ['pipes']
    }

    constructor(props) {
        super(props)

        this.addPipe = this.addPipe.bind(this)
        this.savePipe = this.savePipe.bind(this)
        this.focus = this.focus.bind(this)
        this.navigateTo = this.navigateTo.bind(this)
        this.navigateUp = this.navigateUp.bind(this)
        this.updateProgram = this.updateProgram.bind(this)

    }

    addPipe(pipe, connected) {
        let newProgram = { ...this.state.program }
        let currentContainer = __dir(this.state.currentPath)
        let base = __resolvePath(newProgram, currentContainer)

        pipe.id = uuid()


        if (connected) {
            let currentPipe = this.resolveCurrentPath()
            if (currentPipe.id) {
                pipe.previous = currentPipe.id
            }
            
            let previouslyConnectedIndex = base.findIndex(p => p.previous === currentPipe.id)
            if (previouslyConnectedIndex !== -1) {
                base[previouslyConnectedIndex].previous = pipe.id
            }
        }

        base.push(pipe)

        this.setState({
            program: newProgram,
        })

        this.focus(newProgram.pipes[newProgram.pipes.length -1].id)
    }

    savePipe(old, newProps) {
        let newProgram = { ...this.state.program }

        let context = __resolvePath(newProgram, __dir(this.state.currentPath))
        let currentPathPos = context.findIndex(e => e.id === this.state.currentPath[this.state.currentPath.length - 1].id)

        if (context[currentPathPos].id === old.id) {
            let newPipe = {
                ...old,
                params: {
                    ...old.params,
                    ...newProps
                }
            }

            context[currentPathPos] = newPipe
        }
        
        this.setState({
            program: newProgram,
        })
    }

    focus(id) {
        const currentActive = this.resolveCurrentPath()
        if (id === currentActive.id) {
            return this.navigateTo('pipes')
        } else {
            let newPath = this.state.currentPath.slice()
            let lastPath = newPath.pop()

            if (typeof lastPath === "string")
                newPath.push(lastPath)

            newPath.push({id})

            return this.navigateTo(newPath)
        }
    }

    navigateUp() {
        let newPath = __dir(this.state.currentPath)
        newPath.pop()
        this.navigateTo(newPath)
    }

    navigateTo(path) {
        let newPath
        if (Array.isArray(path)) {
            if (!path.length)
                return false

            newPath = path
        } else { 
            newPath = this.state.currentPath.slice()

            if (typeof path === "string" && path.indexOf("/") !== -1) {
                return path.split("/").map(e => this.navigateTo(JSON.parse(e))).reduce((p, c) => p && c, true)
            }

            if (typeof path === "string" && path === "")
                return false

            newPath.push(path)
        }

        // check path
        if (__resolvePath(this.state.program, newPath) === undefined) {
            return false
        }

        this.setState({
            currentPath: newPath
        })
        return true;
    }

    updateProgram(path, value) {
        const newProgram = { ...this.state.program }

        newProgram[path] = value

        this.setState({
            program: newProgram
        })
    }

    resolveCurrentPath(digUntilLastFolder = false) {
        let path = this.state.currentPath.slice()
        if (digUntilLastFolder) {
            while(typeof path[path.length - 1] !== "string") {
                path.pop()
            }
        }
        return __resolvePath(this.state.program, path)
    }

    render() {
        const { program, currentPath } = this.state

        let currentActive = this.resolveCurrentPath(),
            currentActiveId = typeof currentActive === "object" ? currentActive.id : null

        return (
            <div className={ cssClasses.main }>
                {/* <Menu /> */}
                <GenerateButton program={ program } />
                <TreeView 
                    program={ program } 
                    active={ currentActiveId } 
                    onSelect={ this.navigateTo }
                    onChangeProgramName={ this.updateProgram } />
                <ChainView 
                    chain={ this.resolveCurrentPath(true) } 
                    active={ currentActiveId } 
                    onSelectOne={ this.focus } 
                    onClickElseWhere={ this.navigateTo.bind(this,__dir(currentPath)) }
                    onDblClickElseWhere={ this.navigateUp }/>
                <PipeInspector 
                    active={ !Array.isArray(currentActive) ? currentActive : null } 
                    pipesDefs={ PIPES_DEFINITIONS }
                    onCreate={ this.addPipe } 
                    onSave={ this.savePipe } 
                    />
            </div>
        )
    }
}