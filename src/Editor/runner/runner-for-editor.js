
import RuntimeDebugger from "./RuntimeDebugger"

new RuntimeDebugger(() => {
    return new Promise((resolve) => {
        resolve( {
            messageEventEmitter: {
                addEventListener: (callback) => {
                    window.addEventListener("message", callback)
                }
            },
            messageEventPoster: {
                postMessage: (msg) => {
                    window.opener.postMessage(msg, "*")
                }
            }
        } )
    })
}).start()

