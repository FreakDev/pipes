/* eslint-env node */

import readline from "readline"

import RuntimeDebugger from "./RuntimeDebugger"


export default class NodeRuntimeDebugger extends RuntimeDebugger {

    constructor(getMessageManager) {
        super(getMessageManager)
    }

    onMessageLoad(program) {
        super.onMessageLoad(program)
        console.log("Program loaded !")
    }

    onMessageStart({ mode }) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        
        console.log("A PIPES program is about to be run (in " + mode + " mode). Are you ready ?")        
        rl.question("[press enter to start]", () => {
            rl.close()
            super.onMessageStart({ mode })
        })
    }

}