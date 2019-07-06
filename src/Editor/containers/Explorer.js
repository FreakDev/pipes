import { connect } from "react-redux"

import {
    addPipeAction,
    savePipeAction,
    removePipeAction,
    savePropAction,
    cleanSubTreeAction
} from "../store/actions/program"

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
        cleanSubTree: (program, path) => dispatch(cleanSubTreeAction(program, path))
    })
)(ExplorerCmp)

export default Explorer