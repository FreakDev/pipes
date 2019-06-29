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


const resolvePath = (context, path) => {
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

        this.onAddPipe = this.onAddPipe.bind(this)
        this.onFocus = this.onFocus.bind(this)
        this.navigateTo = this.navigateTo.bind(this)
        this.navigateUp = this.navigateUp.bind(this)

    }

    onAddPipe(pipe, connected) {
        let newProgram = { ...this.state.program }

        pipe.id = uuid()

        if (connected) {
            let currentPipe = this.resolveCurrentPath()
            if (currentPipe.id)
                pipe.previous = currentPipe.id
        }

        let currentContainer = this.state.currentPath.slice()
        while(typeof currentContainer[currentContainer.length -1] !== "string") currentContainer.pop()

        let base = resolvePath(newProgram, currentContainer)
        base.push(pipe)

        this.setState({
            program: newProgram,
        })

        this.onFocus(newProgram.pipes[newProgram.pipes.length -1].id)
    }

    onFocus(id) {
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
        let newPath = this.state.currentPath.slice()

        while(typeof newPath[newPath.length -1] !== "string") newPath.pop()

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
        if (resolvePath(this.state.program, newPath) === undefined) {
            return false
        }

        this.setState({
            currentPath: newPath
        })
        return true;
    }

    resolveCurrentPath(digUntilLastFolder = false) {
        let path = this.state.currentPath.slice()
        if (digUntilLastFolder) {
            while(typeof path[path.length - 1] !== "string") {
                path.pop()
            }
        }
        return resolvePath(this.state.program, path)
    }

    render() {
        const { program, focused, currentPath } = this.state

        return (
            <div className={ cssClasses.main }>
                {/* <Menu /> */}
                <GenerateButton program={ program } />
                <TreeView program={ program } active={ this.resolveCurrentPath().id } onSelect={ this.navigateTo } />
                <ChainView 
                    chain={ this.resolveCurrentPath(true, -1) } 
                    active={ this.resolveCurrentPath().id } 
                    onSelectOne={ this.onFocus } 
                    onDblClickElseWhere={ this.navigateUp }/>
                <Toolbox 
                    selected={ focused ? null : null } 
                    pipesDefs={ PIPES_DEFINITIONS }
                    onAddPipe={ this.onAddPipe } />
            </div>
        )
    }
}