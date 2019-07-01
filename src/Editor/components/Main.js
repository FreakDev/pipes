import React from "react"

import uuid from "uuid/v4"

import RunPanel from "./RunPanel"
import ChainView from "./ChainView"
import PipeInspector from "./PipeInspector"
import TreeView from "./TreeView"
import GenerateButton from "./GenerateButton"

import PIPES_DEFINITIONS from "../../pipes-definitions.json"

import cssClasses from "../../../sass/Editor/Main.sass"

export const PIPE_TYPE_FUNC = 'pipe-func'
export const PIPE_TYPE_NATIVE = 'pipe-native'
export const PIPE_TYPE_VAR = 'pipe-var'

const PIPE_FUNC_DEF = {
    "type":PIPE_TYPE_FUNC,
    "description":"a pipe",
    "params":{
        "name":{
            "type":"free",
            "optional":false,
            "description":"You may reference to this pipe with \'%s\' (choose it wisely)"
        }
    }
}

const PIPE_VAR_DEF = {
    "type":PIPE_TYPE_VAR,
    "description":"a variable",
    "params":{
        "name":{
            "type":"free",
            "optional":false,
            "description":"You may reference to this variable with \'%s\' (choose it wisely)"
        },
        "value":{
            "type":"free",
            "optional":true,
            "description":"At startup your variable will contain \'%s\'"
        }
    }
}

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
        currentPath: ['pipes'],
        isRunning: false
    }

    constructor(props) {
        super(props)

        this.addPipe = this.addPipe.bind(this)
        this.savePipe = this.savePipe.bind(this)
        this.onRemove = this.onRemove.bind(this)
        this.focus = this.focus.bind(this)
        this.navigateTo = this.navigateTo.bind(this)
        this.navigateUp = this.navigateUp.bind(this)
        this.navigateDown = this.navigateDown.bind(this)
        this.updateProgram = this.updateProgram.bind(this)
        this.run = this.run.bind(this)

    }

    addPipe(pipe, connected) {
        let newProgram = { ...this.state.program }
        let currentContainer = __dir(this.state.currentPath)
        let base = __resolvePath(newProgram, currentContainer)

        if (pipe.type === PIPE_TYPE_FUNC || pipe.type === PIPE_TYPE_VAR) {
            let params = pipe.params
            delete pipe.params
            pipe = {
                ...pipe,
                ...params,
            }
            if (pipe.type === PIPE_TYPE_FUNC) {
                pipe.pipes = []
            }
        }

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

    onRemove(pipe) {
        let newProgram = { ...this.state.program }

        let context = __resolvePath(newProgram, __dir(this.state.currentPath))
        let currentPathPos = context.findIndex(e => e.id === this.state.currentPath[this.state.currentPath.length - 1].id)

        if (context[currentPathPos].id === pipe.id) {
            context.splice(currentPathPos, 1)
        }
        
        let previouslyConnectedIndex = context.findIndex(p => p.previous === pipe.id)
        if (previouslyConnectedIndex !== -1) {
            context[previouslyConnectedIndex].previous = pipe.previous
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
        return this.navigateTo(newPath)
    }

    navigateDown() {
        if (this.resolveCurrentPath().pipes)
            return this.navigateTo('pipes')
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

    run() {
        this.setState({
            isRunning: true
        })
        const onMessage = (msg) => {
            event = JSON.parse(msg.data)
            switch(event.name) {
                case "execution-stopped":
                    this.setState({
                        isRunning: false
                    })  
                    break;  
                case "pipe-called":
                    console.log(event.payload)
                    break;
            }
        }
        window.addEventListener("message", onMessage, false)
        this.iframe.contentWindow.postMessage(JSON.stringify(this.state.program), '*');
    }

    resolveCurrentPath(digUntilLastFolder = false) {
        let path = this.state.currentPath.slice()
        if (digUntilLastFolder) {
            path = __dir(path)
        }
        return __resolvePath(this.state.program, path)
    }

    render() {
        const { program, currentPath, isRunning } = this.state

        let currentActive = this.resolveCurrentPath(),
            currentActiveId = typeof currentActive === "object" ? currentActive.id : null

        const defs = { ...PIPES_DEFINITIONS, pipe: PIPE_FUNC_DEF, var: PIPE_VAR_DEF }

        return (
            <div className={ cssClasses.main }>
                {/* <Menu /> */}
                <GenerateButton program={ program } onClickRun={ this.run } />
                <TreeView 
                    program={ program } 
                    active={ currentActiveId } 
                    activePath={ currentPath }
                    onSelect={ this.navigateTo }
                    onNavigateDown={ this.navigateDown }
                    onChangeProgramName={ this.updateProgram } />
                <ChainView 
                    chain={ this.resolveCurrentPath(true) } 
                    active={ currentActiveId } 
                    onSelectOne={ this.focus } 
                    onClickElseWhere={ this.navigateTo.bind(this,__dir(currentPath)) }
                    onDblClickElseWhere={ this.navigateUp }/>
                <RunPanel show={ isRunning } getRef={ ref => this.iframe = ref } />
                <PipeInspector 
                    active={ !Array.isArray(currentActive) ? currentActive : null } 
                    pipesDefs={ defs }
                    onCreate={ this.addPipe } 
                    onSave={ this.savePipe }
                    onRemove={ this.onRemove }
                    />
            </div>
        )
    }
}