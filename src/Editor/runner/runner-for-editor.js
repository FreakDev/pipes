
import RuntimeDebugger from "./RuntimeDebugger"

new RuntimeDebugger(() => {
    return new Promise((resolve) => {
        resolve( {
            addEventListener: cb => { window.addEventListener("message", (e) => { cb(e.data) }) },
            postMessage: (msg) => window.opener.postMessage(msg, "*")
        } )
    })
}).start()

