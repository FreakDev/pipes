
import RuntimeDebugger from "./RuntimeDebugger"

new RuntimeDebugger(() => {
    return new Promise((resolve) => {
        resolve( {
            addEventListener: window.addEventListener.bind(window, "message"),
            postMessage: (msg) => window.opener.postMessage(msg, "*")
        } )
    })
}).start()

