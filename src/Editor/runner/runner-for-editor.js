
import RuntimeDebugger from "./RuntimeDebugger"

const MESSAGE_CLOSING = "Closing"

new RuntimeDebugger(() => {
    return new Promise((resolve) => {
        resolve( {
            addEventListener: cb => { window.addEventListener("message", (e) => { cb(e.data) }) },
            postMessage: (msg) => window.opener.postMessage(msg, "*")
        } )
    })
}).start()

window.onbeforeunload = () => {
    window.opener.postMessage({
        name : MESSAGE_CLOSING,
        payload: {
            platform: "web"
        }
    }, "*")
}