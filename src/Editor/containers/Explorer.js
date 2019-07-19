import { connect } from "react-redux"

import {
    addPipeAction,
    savePipeAction,
    removePipeAction,
    savePropAction,
    cleanTreeAction,
    movePipeAction
} from "../store/actions/program"

import {
    copyPipes,
    cutPipes,
    pastePipes
} from "../store/actions/ux"

import { default as ExplorerCmp } from "../components/Explorer"

const Explorer = connect(
    state => ({
        program: state.program,
    }),
    dispatch => ({
        addPipe: (pipe, connected, connectedTo, currentPath) => dispatch(addPipeAction(pipe, connected, connectedTo, currentPath)), 
        savePipe: (old, pipe, currentPath) => dispatch(savePipeAction(old, pipe, currentPath)), 
        removePipe: (pipe, currentPath) => dispatch(removePipeAction(pipe, currentPath)), 
        saveProp: (props, value) => dispatch(savePropAction(props, value)),
        cleanTree: (path) => dispatch(cleanTreeAction(path)),
        movePipe: (newPrevious, path) => dispatch(movePipeAction(newPrevious, path)),
        copyPipes: (selected) => dispatch(copyPipes(selected)),
        cutPipes: (selected, currentPath) => dispatch(cutPipes(selected, currentPath)),
        pastePipes: (previous) => dispatch(pastePipes(previous))
    })
)(ExplorerCmp)

export default Explorer