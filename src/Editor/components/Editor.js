import React from "react"
import { connect } from 'react-redux'

import {
    addPipeAction,
    savePipeAction,
    removePipeAction,
    savePropAction,
    loadAction,
    cleanSubTreeAction
} from "../store/actions/program"

import Main from "./Main"

const Editor = connect(
    state => ({
        program: state.program,
    }),
    dispatch => ({
        addPipe: (pipe, connected, connectedTo, currentPath) => dispatch(addPipeAction(pipe, connected, connectedTo, currentPath)), 
        savePipe: (old, pipe, currentPath) => dispatch(savePipeAction(old, pipe, currentPath)), 
        removePipe: (pipe, currentPath) => dispatch(removePipeAction(pipe, currentPath)), 
        saveProp: (props, value) => dispatch(savePropAction(props, value)),
        loadProgram: (program) => dispatch(loadAction(program)),
        cleanSubTree: (program, path) => dispatch(cleanSubTreeAction(program, path))
    })
)(Main)

export default Editor