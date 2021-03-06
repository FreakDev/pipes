import React, { useState } from "react"

import {
    RUNTIME_EXECUTION_STOPPED,
    RUNTIME_PIPE_CALLED,
    RUNTIME_EXECUTION_ERROR
} from "../../../constants"

import { 
    MESSAGE_LOAD, 
    MESSAGE_START, 
    MESSAGE_PAUSE,
    MESSAGE_RUN_ONE,
    MODE_NORMAL,
    MESSAGE_RUN,
    MODE_STEP,
    MODE_TURTLE
} from "../../constants"

import MessageManager, { MODE_WEB, MODE_NODE } from "../../MessageManager"

class RunPanel extends React.Component {

    state = {
        paused: false
    }

    constructor(props) {
        super(props)

        this.onMessage = this.onMessage.bind(this)
        this.clickPlay = this.clickPlay.bind(this)
        this.togglePause = this.togglePause.bind(this)
        this.runOnePipe = this.runOnePipe.bind(this)
        this.toggleMode = this.toggleMode.bind(this)

    }

    onMessage = (msg) => {
        switch(msg.name) {
        case RUNTIME_EXECUTION_STOPPED:
            console.log(msg)
            break
        case RUNTIME_PIPE_CALLED:
            console.log(msg.payload)
            let path = ['pipes']
            msg.payload.pipe.path.forEach(el => {
                path.push({ id: el }, 'pipes')
            });
            path.push({ id: msg.payload.pipe.id })
            // this.props.onDebuggerHighlight && 
            this.props.onDebuggerHighlight(path)
            break
        case RUNTIME_EXECUTION_ERROR: 
            console.error(msg.payload.error)
        }
    }
    
    sendMessage(name, payload) {
        this.msgManager.postMessage({
            name,
            payload
        })
    }


    clickPlay(mode = MODE_NORMAL) {
        const runProgram = (() => { 
            this.sendMessage(MESSAGE_LOAD, { program: this.props.program })
            this.sendMessage(MESSAGE_START, { mode })
            this.setState({
                paused: false
            })
        }).bind(this)

        if (!this.msgManager.isRunning) {
            this.msgManager.start().then(runProgram)
        } else {
            this.sendMessage(MESSAGE_LOAD, { program: this.props.program })
            this.sendMessage(MESSAGE_RUN, { mode })
        }
    }

    togglePause() {
        this.sendMessage(MESSAGE_PAUSE, !this.state.paused)
        
        this.setState({
            paused: !this.state.paused
        })
    }

    toggleMode(e) {
        if(e.target.checked) {
            this.msgManager.setMode(MODE_NODE)
        } else {
            this.msgManager.setMode(MODE_WEB)
        }
    }

    runOnePipe() {
        if (!this.state.runnerWindow) {
            this.clickPlay(MODE_STEP)
        } else {
            this.sendMessage(MESSAGE_RUN_ONE)
        }
    }

    componentWillMount() {
        this.msgManager = new MessageManager()
        this.msgManager.messageCallback = this.onMessage.bind(this)
    }

    componentWillUnmount() {
        this.msgManager.destoy()
        this.msgManager = null
    }

    render() {
        const { paused } = this.state
    
        return (
            <div>
                <input type="checkbox" name="mode" onChange={ this.toggleMode } /> { this.msgManager.mode } 
                <button onClick={ () => this.clickPlay() }>Play</button>
                <button onClick={ () => this.clickPlay(MODE_TURTLE) }>Play (Turtle mode)</button>
                { this.msgManager.isRunning ? <button onClick={ this.togglePause }>{ paused ? "Resume" : "Pause"}</button> : null }
                <button onClick={ this.runOnePipe }>Step by step</button>
            </div>
        )
        
    }

}


export default RunPanel