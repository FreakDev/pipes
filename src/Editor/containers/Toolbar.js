import { connect } from "react-redux"

import {
} from "../store/actions/toolbar"

import {
    loadAction,
} from "../store/actions/program"

import { default as ToolbarCmp } from "../components/Toolbar"

const Toolbar = connect(
    state => ({
        program: state.program,
    }),
    dispatch => ({
        loadProgram: (program) => dispatch(loadAction(program)),
    })
)(ToolbarCmp)

export default Toolbar