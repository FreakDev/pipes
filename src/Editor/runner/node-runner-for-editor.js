import WebsocketClient, { I_AM_RUNNER } from "../WebsocketClient"
import NodeRuntimeDebugger from "./NodeRuntimeDebugger"
import argv from "argv"

argv.option({
    name: "server",
    short: "s",
    type: "string",
    description: "Defines the debugger server to connect to",
    example: "'script --server=value' or 'script -s value'"
})

const args = argv.run()

new NodeRuntimeDebugger(() => new Promise(resolve => {
    const wsClient = new WebsocketClient(I_AM_RUNNER)
    console.log("Trying to connect with : " + args.options.server)
    wsClient.connect(args.options.server)
        .then(() => {
            console.log("connected !")
            resolve( {
                addEventListener: wsClient.addEventListener.bind(wsClient),
                postMessage: wsClient.postMessage.bind(wsClient)
            } )
        }, (e) => {
            console.log("failed to eonnect", e)
        })
})
).start()

