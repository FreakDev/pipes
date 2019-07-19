import { __copyTreeStructure, __sortInChainOrder, __resolvePath, __dir } from "../../utils"

import {
    PIPE_TYPE_FUNC,
    PIPE_TYPE_VAR
} from "../../../constants"

import { addPipeAction, removePipeAction } from "./program"

export const UX_COPY = "UX_COPY"
export const UX_PASTE = "UX_PASTE"
export const UX_CUT = "UX_CUT"

export const copyPipes = (selected) => {
    return (dispatch, getState) => {
        let payload

        payload = __copyTreeStructure(getState().program, selected)

        dispatch({
            type: UX_COPY,
            payload
        })
    }
}

export const cutPipes = (selected, currentPath) => {
    return (dispatch, getState) => {

        dispatch({ type: UX_CUT }) // for dispatch history lisibility

        dispatch(copyPipes(selected))

        const program = getState().program,
            base = __resolvePath(program, __dir(currentPath))
        selected.forEach(s => {
            const p = base.find(p => p.id === s)
            if (p)
                dispatch(removePipeAction(p, currentPath))
        })
    }
}

export const pastePipes = (currentPath) => {
    return (dispatch, getState) => {
        dispatch({ type: UX_PASTE }) // for dispatch history lisibility

        const clipboard = getState().ux.clipboard,
            program = getState().program,
            currentDir = __resolvePath(program, __dir(currentPath)),
            currentPrevious = __resolvePath(program, currentPath)
        let prev = null
        if (!Array.isArray(currentPrevious)) {
            prev = currentPrevious
        }

        __sortInChainOrder( clipboard.map(p => JSON.parse(JSON.stringify(p))) )
            .forEach(p => {
                if ([PIPE_TYPE_FUNC, PIPE_TYPE_VAR].indexOf(p.type) !== -1 && currentDir.find(e => e.name === p.name)) {
                    let i = 1, name = p.name
                    do {
                        if (name.slice(name.lastIndexOf("_")).match(/_[0-9]+/)) {
                            name = name.slice(0, name.lastIndexOf("_"))
                        }
                        name += ("_" + i)
                        i++
                    } while(currentDir.find(e => e.name === name))
                    p.name = name
                }
                
                dispatch(addPipeAction(p, true, prev ? prev.id : null, currentPath))
                prev = p.id
            })
    }
}