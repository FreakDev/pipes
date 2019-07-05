/* eslint-env node */

import readline from "readline"

/**
 * @PipeDEF
 * @Pipe\lib cli
 */
export default {
    /**
     * @PipeDEF
     * #@Pipe\name readInput
     * @Pipe\type pipe-native
     * @Pipe\platform node
     * @Pipe\param useParam {Free} - a
     * @Pipe\param question {Free} - a
     * @Pipe\output {String}
     */
    readInput: function ({ useParam = true, question }, input) {
        return new Promise(resolve => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            })
            
            rl.question((useParam ? question : input), (answer) => {
                rl.close()
                resolve(answer)
            })            
        })
    }
}