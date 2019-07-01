import PipeCore from "../../Pipes/Core/PipeCore"

const sendMessage = function (msg) {
    // Make sure you are sending a string, and to stringify JSON
    window.parent.postMessage(msg, "*")
}

window.addEventListener("message", (e) => {
    (new PipeCore)
        .loadJSON(JSON.parse(e.data))
        .run()
        .then(() => {
            sendMessage("execution-stopped")
        })
}, false)

