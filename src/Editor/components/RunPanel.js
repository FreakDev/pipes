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

class RunPanel extends React.Component {

    state = {
        runnerWindow: null,
        paused: false
    }

    constructor(props) {
        super(props)

        this.onMessage = this.onMessage.bind(this)
        this.clickPlay = this.clickPlay.bind(this)
        this.togglePause = this.togglePause.bind(this)
        this.runOnePipe = this.runOnePipe.bind(this)
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
        this.state.runnerWindow && this.state.runnerWindow.postMessage(JSON.stringify({
            name,
            payload
        }), "*")
    }


    clickPlay(mode = MODE_NORMAL) {
        const runProgram = (() => { 
            this.sendMessage(MESSAGE_LOAD, { program: this.props.program })
            this.sendMessage(MESSAGE_START, { mode })
            this.setState({
                paused: false
            })
        }).bind(this)
        if (!this.state.runnerWindow) {
            const runnerWindow = window.open("runner-for-editor.html", "Pipe Runner", "height=150,width=200")
            this.setState({
                runnerWindow
            })
            runnerWindow.onload = runProgram
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
        const { paused, runnerWindow } = this.state
    
        return (
            <div>
                <button onClick={ () => this.clickPlay() }>Play</button>
                <button onClick={ () => this.clickPlay(MODE_TURTLE) }>Play (Turtle mode)</button>
                { runnerWindow ? <button onClick={ this.togglePause }>{ paused ? "Resume" : "Pause"}</button> : null }
                <button onClick={ this.runOnePipe }>Step by step</button>
            </div>
        )
        
    }

}


export default RunPanel