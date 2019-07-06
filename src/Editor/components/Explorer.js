import React from "react"
import uuid from "uuid/v4"

import { __sortInChainOrder, __dir, __resolvePath } from "../utils"

import { PIPE_TYPE_FUNC, PIPE_TYPE_VAR, PIPE_TYPE_NATIVE } from "../../constants";
import { EDITOR_PARAM_PREFIX } from "../constants";

import ChainView from "./Explorer/ChainView"
import PipeInspector from "./Explorer/PipeInspector"
import TreeView from "./Explorer/TreeView"

import PIPES_DEFINITIONS from "../../pipes-definitions.json"

import cssClasses from "./Explorer.sass"


const PIPE_FUNC_DEF = {
    "type":PIPE_TYPE_FUNC,
    "description":"a pipe",
    "params":{
        [EDITOR_PARAM_PREFIX + "name"]:{
            "type":"Free",
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
            "type":"Free",
            "optional":false,
            "description":"You may reference to this variable with \'%s\' (choose it wisely)"
        },
        "value":{
            "type":"Free",
            "optional":true,
            "description":"At startup your variable will contain \'%s\'"
        }
    }
}

const INITIAL_PROGRAM = {
    id: uuid(),
    name: "",
    type: PIPE_TYPE_FUNC,
    pipes: []
}


// navigate
const __findInChain = (needleId, chain, from) => {
    let [found, path] = __findAfterInChain(needleId, chain, from)

    if (!found)
        [found, path] = __findBeforeInChain(needleId, chain, from)

    return [found, path]
}

const __findAfterInChain = (needleId, chain, from) => {
    let found = false,
        path = [],
        curr = from

    while (!found) {
        const next = chain.find(e => e.previous === curr.id)
        if (!next)
            break

        path.push(next.id)
        if (next.id === needleId)
            found = true

        curr = next
    }

    return [found, path]
}

const __findBeforeInChain = (needleId, chain, from) => {
    let found = false,
        path = [],
        curr = from

    while (!found) {
        const next = chain.find(e => e.id === curr.previous)
        if (!next)
            break

        path.push(next.id)
        if (next.id === needleId)
            found = true

        curr = next
    }

    return [found, path]
}



// copy / paste
const KEY_SHIFT = 16
const KEY_CTRL = 17
const KEY_C = 67
const KEY_V = 86
const KEY_X = 88

const KEY_COMPO = [
    [KEY_CTRL, KEY_C],
    [KEY_CTRL, KEY_V],
    [KEY_CTRL, KEY_X]
]

const __checkPressedKeys = (currentKeyDown) => {
    return KEY_COMPO.find(keyCompo => {
        let found,
            i = 0,
            len = keyCompo.length
        do {
            found = currentKeyDown.indexOf(keyCompo[i]) !== -1
            i++
        } while(found && i < len)

        return found
    })
}

const __copyTreeStructure = (treeSrc, ids) => {
    return JSON.parse(JSON.stringify(ids.map(__findInTree.bind(this, treeSrc))))
}

const __findInTree = (tree, needleId) => {
    const flattenTree = (tree, base = []) => {
        tree.pipes.forEach(p => base.push(p) && p.pipes && flattenTree(p, base))
        return base
    }
    return flattenTree(tree).find(e => e.id === needleId)
}



// deprecated stuff

const __cleanTree = (tree) => {
    // const dirtyTree = tree.pipes,
    //     idsMap = {}
    // tree.pipes = []

    // __sortInChainOrder(dirtyTree).forEach(p => {
    //     let previousId = p.id
    //     tree.pipes = __addPipe(tree.pipes, p, (p.previous ? idsMap[p.previous] : null))
    //     idsMap[previousId] = p.id
    // })

    // delete tree.__dirty
    throw "use reducer"

}


// the component 

export default class Explorer extends React.Component {

    state = {
        // program: INITIAL_PROGRAM,
        currentPath: ['pipes'],
        selected: [],
        keysDown: [],
        clipboard: []
    }

    constructor(props) {
        super(props)

        this.addPipe = this.addPipe.bind(this)
        this.savePipe = this.savePipe.bind(this)
        this.onRemove = this.onRemove.bind(this)
        this.focus = this.focus.bind(this)
        this.unFocus = this.unFocus.bind(this)
        this.navigateTo = this.navigateTo.bind(this)
        this.navigateUp = this.navigateUp.bind(this)
        this.navigateDown = this.navigateDown.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
        this.onKeyUp = this.onKeyUp.bind(this)
    }

    addPipe(pipe, connected, connectedTo = null) {        
        this.props.addPipe(pipe, connected, connectedTo, this.state.currentPath)

        this.focus(pipe.id)
    }

    savePipe(old, newProps) {
        this.props.savePipe(old, newProps, this.state.currentPath)
    }

    onRemove(pipe) {
        this.props.removePipe(pipe, this.state.currentPath)
        this.setState({
            currentPath: this.state.currentPath.slice(0, -1),
        })
    }

    focus(id) {
        const currentActive = this.resolveCurrentPath()
        if (id === currentActive.id) {
            return this.navigateTo('pipes')
        } else {
            let newPath = this.state.currentPath.slice()
            let lastPath = newPath.pop()
            if (typeof lastPath === "string") {
                newPath.push(lastPath)
            }

            newPath.push({id})

            if (this.navigateTo(newPath)) {
                if (!this.state.selected.length) {
                    this.setState({
                        selected: [id]
                    })
                } else {
                    if (this.state.keysDown.indexOf(KEY_SHIFT) !== -1) {

                        const chain = this.resolveCurrentPath(true),
                            [found, path] = __findInChain(id, chain, chain.find(e => e.id === this.state.selected[0]))

                        let newSelected = []
                        if (found) {
                            newSelected = [...this.state.selected, ...path, id]
                            newSelected = newSelected.sort().filter((e,index) => !(newSelected.indexOf(e) < index))
                        }

                        if (!newSelected.length) {
                            newSelected = [id]
                        }

                        this.setState({
                            selected: newSelected
                        })

                    } else if (this.state.selected.indexOf(id) === -1) {
                        this.setState({
                            selected: [id]
                        })
                    }
                }

                return true
            }
        }
        return false
    }

    unFocus() {
        if (this.navigateTo(__dir(this.state.currentPath))) {
            this.setState({
                selected: []
            })
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
        const newActive = __resolvePath(this.props.program, newPath)
        if (newActive === undefined) {
            return false
        }

        if (newActive.pipes && newActive.__dirty) {
            console.warn("tree cleaning is disabled during refactoring")
            // const newProgram = { ...this.props.program },
            //     newActive = __resolvePath(newProgram, newPath)
            // __cleanTree(newActive)
            // this.setState({
            //     program: newProgram
            // })
        }

        if (newActive.pipes) {
            this.setState({
                selected: []
            })
        }

        this.setState({
            currentPath: newPath
        })
        return true;
    }

    onKeyDown(e) {
        const keysDown = this.state.keysDown
        const key = e.keyCode
        if (keysDown.indexOf(key) === -1)
            this.setState({
                keysDown: [...keysDown, key]
            })
    }

    onKeyUp(e) {
        const keysDown = this.state.keysDown
        const key = e.keyCode

        let index = keysDown.indexOf(key)
        if (index !== -1) {
            const keyCombo = __checkPressedKeys(keysDown)

            if (keyCombo)
                if (keyCombo.indexOf(KEY_C) === 1 || keyCombo.indexOf(KEY_X) === 1) {
                    this.setState({
                        clipboard: __copyTreeStructure(this.props.program, this.state.selected)
                    })
                    if (keyCombo.indexOf(KEY_X) === 1) {
                        console.warn("cut is disabled during refacto")
                        // const newProgram = { ...this.props.program },
                        //     base = __resolvePath(newProgram, __dir(this.state.currentPath).slice(0, -1))
                        // this.state.selected.forEach(s => {
                        //     const p = base.pipes.find(p => p.id === s)
                        //     p && (base.pipes = __removePipe(base.pipes, p))
                        // })
                        // this.setState({
                        //     program: newProgram,
                        //     currentPath: this.state.currentPath.slice(0, -1),
                        //     selected: []
                        // })
                    }
                } else if (keyCombo.indexOf(KEY_V) === 1) {
                    console.warn("paste is disabled during refacto")
                    // let prev = null
                    // const currentDir = this.resolveCurrentPath(true)
                    // __sortInChainOrder(this.state.clipboard).forEach(p => {
                    //     if (p.type === PIPE_TYPE_FUNC && currentDir.find(e => e.name === p.name)) {
                    //         let i = 1, name = p.name
                    //         do {
                    //             if (name.slice(name.lastIndexOf("_")).match(/_[0-9]+/)) {
                    //                 name = name.slice(0, name.lastIndexOf("_"))
                    //             }
                    //             name += ("_" + i)
                    //             i++
                    //         } while(currentDir.find(e => e.name === name))
                    //         p.name = name
                    //     }
                    //     this.addPipe(p, true, prev ? prev : null)
                    //     prev = p.id
                    // })
                }

            this.setState({
                keysDown: [...keysDown.slice(0, index), ...keysDown.slice(index + 1)]
            })
        }
    }

    resolveCurrentPath(digUntilLastFolder = false) {
        let path = this.state.currentPath.slice()
        if (digUntilLastFolder) {
            path = __dir(path)
        }
        return __resolvePath(this.props.program, path)
    }

    render() {
        const { currentPath, selected } = this.state
        const { program, saveProp } = this.props

        let currentActive = this.resolveCurrentPath(),
            currentActiveId = typeof currentActive === "object" ? currentActive.id : null

        const defs = { ...PIPES_DEFINITIONS, pipe: PIPE_FUNC_DEF, box: PIPE_VAR_DEF }

        const buildPipeInScope = () => {
            const pipesInScope = []
            let path = currentPath

            path.push("removed immediatly")
            do {
                path.pop()
                path = __dir(path)
                let currentDir = __resolvePath(program, path)
                pipesInScope.push(...currentDir.filter(p => [PIPE_TYPE_FUNC, PIPE_TYPE_VAR].indexOf(p.type) !== -1))
            } while ( path.length > 1)

            return pipesInScope
        }

        return (
            <div className={ cssClasses.main } onKeyDown={ this.onKeyDown } onKeyUp={ this.onKeyUp } tabIndex="0">
                <div className={ cssClasses.left_col }>
                    <TreeView
                        program={ program }
                        active={ currentActiveId }
                        activePath={ currentPath }
                        onSelect={ this.navigateTo }
                        onNavigateDown={ this.navigateDown }
                        onChangeProgramName={ saveProp } />
                </div>
                <div  className={ cssClasses.col_main }>
                    <ChainView
                        chain={ this.resolveCurrentPath(true) }
                        active={ currentActiveId }
                        selected={ selected }
                        onSelectOne={ this.focus }
                        onClickElseWhere={ this.unFocus }
                        onDblClickElseWhere={ this.navigateUp }/>
                    <PipeInspector
                        active={ !Array.isArray(currentActive) ? currentActive : null }
                        pipesInScope={ buildPipeInScope() }
                        pipesDefs={ defs }
                        onCreate={ this.addPipe }
                        onSave={ this.savePipe }
                        onRemove={ this.onRemove }
                        />
                </div>
            </div>
        )
    }
}