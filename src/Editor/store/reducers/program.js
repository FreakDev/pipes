
import uuid from "uuid/v4"

import { __sortInChainOrder, __dir, __resolvePath } from "../../utils"

import {
    PIPE_TYPE_FUNC,
    PIPE_TYPE_NATIVE,
    PIPE_TYPE_VAR
} from "../../../constants"

import {
    EDITOR_PARAM_PREFIX
} from "../../constants"

import { 
    PROGRAM_ADD_PIPE,
    PROGRAM_SAVE_PIPE,
    PROGRAM_REMOVE_PIPE,
    PROGRAM_SAVE_PROP,
    PROGRAM_LOAD,
    PROGRAM_CLEAN_TREE,
} from "../actions/program"


const __addPipe = (base, pipe, connected, connectedTo) => {
    const connectedToId = connected ? connectedTo : null

    if (pipe.type === PIPE_TYPE_VAR) {
        let params = pipe.params
        delete pipe.params
        Object.assign(pipe, params)
        
        let value, dataType        
        value = pipe.value
        dataType = pipe.dataType
        delete pipe.value
        delete pipe.dataType
        pipe.params = Object.assign(pipe.params || {}, { value, dataType })
        
    } else if (pipe.type === PIPE_TYPE_FUNC) {
        if (pipe.params[EDITOR_PARAM_PREFIX + "name"]) {
            pipe.name = pipe.params[EDITOR_PARAM_PREFIX + "name"]
            delete pipe.params[EDITOR_PARAM_PREFIX + "name"]
        }
        pipe.pipes = pipe.pipes || []
    }

    if (pipe.pipes)
        pipe.__dirty = true

    pipe.id = uuid()

    if (connectedToId) {
        let currentPipe = base.find(p => p.id === connectedToId)
        if (currentPipe.id) {
            pipe.previous = currentPipe.id

            let previouslyConnectedIndex = base.findIndex(p => p.previous === currentPipe.id)
            if (previouslyConnectedIndex !== -1) {
                base[previouslyConnectedIndex].previous = pipe.id
            }
        }
    } else {
        delete pipe.previous
    }

    base.push(pipe)
    
    return base
}

const reducers = {
    [PROGRAM_ADD_PIPE] : (state, action) => {
        const newProgram = { ...state },
            currentActive = __resolvePath(newProgram, action.payload.currentPath),
            currentContainer = __dir(action.payload.currentPath)

        const base = __resolvePath(newProgram, currentContainer)

        __addPipe(base, action.payload.pipe, action.payload.connected, action.payload.connectedTo || (currentActive ? currentActive.id : null))
    
        return newProgram
    },
    [PROGRAM_SAVE_PIPE] : (state, action) => {
        const newProgram = { ...state },
            old = action.payload.old,
            newProps = action.payload.newProps,
            currentPath = action.payload.currentPath

        let context = __resolvePath(newProgram, __dir(currentPath))
        let currentPathPos = context.findIndex(e => e.id === currentPath[currentPath.length - 1].id)

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

        return newProgram
    },
    [PROGRAM_REMOVE_PIPE] : (state, action) => {
        const newProgram = { ...state },
            pipe = action.payload.pipe,
            currentPath = action.payload.currentPath

        let base = __resolvePath(newProgram, __dir(currentPath).slice(0, -1))

        let currentPathPos = base.pipes.findIndex(e => e.id === pipe.id)

        if (currentPathPos !== -1) {
            base.pipes = [...base.pipes.slice(0, currentPathPos), ...base.pipes.slice(currentPathPos + 1)]
        }
    
        let previouslyConnectedIndex = base.pipes.findIndex(p => p.previous === pipe.id)
        if (previouslyConnectedIndex !== -1) {
            base.pipes[previouslyConnectedIndex].previous = pipe.previous
        }
    
        return newProgram
    },
    [PROGRAM_SAVE_PROP] : (state, action) => {
        const newProgram = { ...state }

        newProgram[action.payload.prop] = action.payload.value

        return newProgram
    },
    [PROGRAM_LOAD] : (state, action) => {
        return action.payload.program
    },
    [PROGRAM_CLEAN_TREE]: (state, action) => {
        const newProgram = { ...state }

        const tree = __resolvePath(newProgram, action.payload.currentPath)

        const dirtyTree = tree.pipes,
            idsMap = {}
        tree.pipes = []

        __sortInChainOrder(dirtyTree).forEach(p => {
            let previousId = p.id
            tree.pipes = __addPipe(tree.pipes, p, !!p.previous, (p.previous ? idsMap[p.previous] : null))
            idsMap[previousId] = p.id
        })

        delete tree.__dirty

        return newProgram
    }
}

export default (state = {}, action) => {
    return reducers[action.type] ? reducers[action.type](state, action) : state
}