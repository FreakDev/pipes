import React from "react"
import { MESSAGE_LOAD, MESSAGE_START } from "../runner/RuntimeDebugger"

const sendMessageTo = (dest, name, payload) => {
    dest.postMessage(JSON.stringify({
        name,
        payload
    }), "*")
}

const RunPanel = ({ program }) => {

    const onMessage = (msg) => {
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
    window.addEventListener("message", onMessage, false)
    
    let runnerWindow = null
    
    const runProgramInDebugger = (turtleMode = false) => {
        const runProgram = () => { sendMessageTo(runnerWindow, MESSAGE_LOAD, { program }); sendMessageTo(runnerWindow, MESSAGE_START) }
        if (!runnerWindow) {
            runnerWindow = window.open("runner-for-editor.html", "Pipe Runner", "height=150,width=200")
            runnerWindow.onload = runProgram
        }
        runProgram()
    }

    return (
        <div>
            <button onClick={ runProgramInDebugger }>Play</button>
            <button onClick={ runProgramInDebugger.bind(this, true) }>Play (Turtle mode)</button>
        </div>
    )
}

export default RunPanel