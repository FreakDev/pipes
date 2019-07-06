
export const PROGRAM_ADD_PIPE = "PROGRAM_ADD_PIPE"
export const PROGRAM_SAVE_PIPE = "PROGRAM_SAVE_PIPE"
export const PROGRAM_REMOVE_PIPE = "PROGRAM_REMOVE_PIPE"
export const PROGRAM_SAVE_PROP = "PROGRAM_SAVE_PROP"
export const PROGRAM_LOAD = "PROGRAM_LOAD"

export const addPipeAction = (pipe, connected, connectedTo, currentPath) => {
    return {
        type: PROGRAM_ADD_PIPE,
        payload: {
            pipe, 
            currentPath, 
            connected,
            connectedTo
        }
    }
}

export const savePipeAction = (old, newProps, currentPath) => {
    return {
        type: PROGRAM_SAVE_PIPE,
        payload: {
            old,
            newProps,
            currentPath
        }
    }
}

export const removePipeAction = (pipe, currentPath) => {
    return {
        type: PROGRAM_REMOVE_PIPE,
        payload: {
            pipe, currentPath
        }
    }
}

export const savePropAction = (prop, value) => {
    return {
        type: PROGRAM_SAVE_PROP,
        payload: {
            prop, 
            value
        }
    }
}

export const loadAction = (program) => {
    return {
        type: PROGRAM_LOAD,
        payload: {
            program
        }
    }
}
