import { connect } from "react-redux"

import {
} from "../store/actions/runner"

import { default as RunnerCmp } from "../components/Runner"

const Explorer = connect(
    state => ({
        program: state.program,
    }),
    dispatch => ({
    })
)(RunnerCmp)

export default Explorer