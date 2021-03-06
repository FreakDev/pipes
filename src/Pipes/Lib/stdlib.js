
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
     * @Pipe\param value {String} - %s will be outputed by the the pipe
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
     * @Pipe\description forward data feed to a another pipe
     * @Pipe\param identifier {Pipe|pipe-func} - the next pipe to be executed will be %s or will be the inputed one
     */
    forward: function ({ identifier }, input) {
        this.forward(identifier, input)
    },

    /**
     * @PipeDEF
     * @Pipe\name invoke
     * @Pipe\type pipe-native
     * @Pipe\description call another pipe, but only it. If any, its chain will not be executed, its returned value will flow in the caller ouput
     * @Pipe\param identifier {Pipe|pipe-func} - will output to %s the value recieved as input
     */
    invoke: function ({ identifier }, input) {
        return this.invoke(identifier, input)
    },

    /**
     * @PipeDEF
     * @Pipe\name followOrFoward
     * @Pipe\type pipe-func
     * @Pipe\param mode {Boolean} - if True Follow
     * @Pipe\param forwardTo { Pipe|pipe-func } - a
     */
    followOrFoward: function ({ mode = false, forwardTo }, input) {
        return new Promise((resolve, reject) => {
            let updatedInput = !!input
            if (mode) {
                updatedInput = !updatedInput
            }
    
            if (updatedInput === true) {
                resolve(input)
            } else if (forwardTo) {
                this.forward(forwardTo)
            }
            reject()    
        })
    },

    /**
     * @PipeDEF
     * @Pipe\name hold
     * @Pipe\type pipe-native
     * @Pipe\description hold the data feed for a given amount of time
     * @Pipe\param [timeValue] {Number} - The data flow will be hold during %s ms
     * @Pipe\param [varValue] {Pipe|pipe-var} - if previous field left empty, waiting time will be the number store in the box %s
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
     * @Pipe\param [before] {String} - will print %s before input
     * @Pipe\param [after] {String} - then %s after. will output the same as inputed
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