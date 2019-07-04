import React, { useState } from "react"
import { 
    MESSAGE_LOAD, 
    MESSAGE_START, 
    MESSAGE_PAUSE,
    MESSAGE_RUN_ONE,
    MODE_NORMAL,
    MESSAGE_RUN,
    MODE_STEP,
    MODE_TURTLE
} from "../runner/RuntimeDebugger"

import MessageManager, { MODE_WEB, MODE_NODE } from "../MessageManager"

class RunPanel extends React.Component {

    state = {
        mode: MODE_WEB,
        paused: false
    }

    constructor(props) {
        super(props)

        this.msgManager = new MessageManager()
        this.msgManager.messageCallback = this.onMessage.bind(this)

        this.onMessage = this.onMessage.bind(this)
        this.clickPlay = this.clickPlay.bind(this)
        this.togglePause = this.togglePause.bind(this)
        this.runOnePipe = this.runOnePipe.bind(this)
        this.toggleMode = this.toggleMode.bind(this)

    }

    onMessage = (msg) => {
        if (typeof msg.data === "string") {
            const event = JSON.parse(msg.data)
            switch(event.name) {
            case "execution-stopped":
                console.log(event)
                break
            case "pipe-called":
                console.log(event.payload)
                break
            }
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
            this.msgManager.start(this.state.mode).then(runProgram)
        } else {
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

    componentDidMount() {
        window.addEventListener("message", this.onMessage, false)
    }

    componentWillUnmount() {
        window.removeEventListener("message", this.onMessage)
    }

    render() {
        const { paused, mode } = this.state
    
        return (
            <div>
                <input type="checkbox" name="mode" onChange={ this.toggleMode } /> { mode } 
                <button onClick={ () => this.clickPlay() }>Play</button>
                <button onClick={ () => this.clickPlay(MODE_TURTLE) }>Play (Turtle mode)</button>
                { this.msgManager.isRunning ? <button onClick={ this.togglePause }>{ paused ? "Resume" : "Pause"}</button> : null }
                <button onClick={ this.runOnePipe }>Step by step</button>
            </div>
        )
        
    }

}


export default RunPanel