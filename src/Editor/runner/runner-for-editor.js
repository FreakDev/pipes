
import RuntimeDebugger from "./RuntimeDebugger"

import { 
    MESSAGE_CLOSING
} from "../../constants"

new RuntimeDebugger(() => {
    return new Promise((resolve) => {
        resolve( {
            addEventListener: cb => { window.addEventListener("message", (e) => { cb(e.data) }) },
            postMessage: (msg) => window.opener.postMessage(msg, "*"),
            onRuntimeError: () => window.close()
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