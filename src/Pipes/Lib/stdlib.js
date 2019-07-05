
/**
 * @PipeDEF
 * @Pipe\lib stdlib
 */
export default {
    /**
     * @PipeDEF
     * @Pipe\name dataEmitter
     * @Pipe\type pipe-native
     * @Pipe\description emit a value
     * often used to start a sequence
     * @Pipe\param value - %s will be outputed by the the pipe
     */
    dataEmitter: function ({value}) {
        return value
    },

    /**
     * @PipeDEF
     * @Pipe\name write
     * @Pipe\type pipe-native
     * @Pipe\description write the input value into a variable
     * @Pipe\param name {Pipe|pipe-var} - will write the input value into box %s, and output the same value as input
     */
    write: function ({ name }, input) {
        try {
            this.setVarValue(name, input)
            return input
        } catch (e) {
            console.warn (e)
        }
    },


    /**
     * @PipeDEF
     * @Pipe\name read
     * @Pipe\type pipe-native
     * @Pipe\description read a variable value
     * @Pipe\param name {Pipe|pipe-var} - will output the content of the box named %s or (if left empty) the inputed name
     */
    read: function ({ name }, input) {
        let searchedName = name || input

        try {
            return this.getVarValue(searchedName)
        } catch (e) {
            console.warn (e)
        }
    },


    /**
     * @PipeDEF
     * @Pipe\name forward
     * @Pipe\type pipe-native
     * @Pipe\description forward to a another pipe (data feed is broken)
     * @Pipe\param identifier {Pipe|pipe-func} - the next pipe to be executed will be %s or will be the inputed one
     */
    forward: function ({ identifier }, input) {
        return this.invoke(identifier || input)
    },

    /**
     * @PipeDEF
     * @Pipe\name invoke
     * @Pipe\type pipe-native
     * @Pipe\description invoke a function (data feed is preserved)
     * @Pipe\param identifier {Pipe|pipe-func} - will output to %s the value recieved as input
     */
    invoke: function ({ identifier }, input) {
        return this.invoke(identifier, input)
    },

    /**
     * @PipeDEF
     * @Pipe\name hold
     * @Pipe\type pipe-native
     * @Pipe\description hold the data feed for a given amount of time
     * @Pipe\param [timeValue] {Free} - The data flow will be hold during %s ms
     * @Pipe\param [varValue] {Free} - if previous field left empty, waiting time will be the number store in the box %s
     */
    hold: function ({ timeValue, varValue }, input) {
        return new Promise(resolve =>  {
            setTimeout(() => resolve(input), timeValue || this.getVarValue(varValue))
        })
    },

    /**
     * @PipeDEF
     * @Pipe\name log
     * @Pipe\type pipe-native
     * @Pipe\description log to console
     * @Pipe\param [before] {Free} - will print %s before input
     * @Pipe\param [after] {Free} - then %s after. will output the same as inputed
     */
    log: function ({ before, after }, input) {
        let params = []
        before && params.push(before)
        params.push(input)
        after && params.push(after)
        console.log.apply(console, params)
        return input
    }
}