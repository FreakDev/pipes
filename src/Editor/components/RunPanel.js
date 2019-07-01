import React, { useState } from "react"
import { 
    MESSAGE_LOAD, 
    MESSAGE_START, 
    MESSAGE_PAUSE,
    MODE_NORMAL,
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


    clickPlay(turtleMode = false) {
        const runProgram = (() => { 
            this.sendMessage(MESSAGE_LOAD, { program: this.props.program })
            this.sendMessage(MESSAGE_START, { mode: (turtleMode ? MODE_TURTLE : MODE_NORMAL) })
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
            runProgram()
        }
    }

    togglePause() {
        this.sendMessage(MESSAGE_PAUSE, !this.state.paused)
        
        this.setState({
            paused: !this.state.paused
        })
    }

    componentDidMount() {
        window.addEventListener("message", this.onMessage, false)
    }

    componentWillUnmount() {
        window.removeEventListener("message", this.onMessage)
    }

    render() {
        const { program } = this.props 
        const { paused } = this.state
    
        return (
            <div>
                <button onClick={ () => this.clickPlay() }>Play</button>
                <button onClick={ () => this.clickPlay(true) }>Play (Turtle mode)</button>
                <button onClick={ this.togglePause }>{ paused ? "Resume" : "Pause"}</button>
            </div>
        )
        
    }

}


export default RunPanel