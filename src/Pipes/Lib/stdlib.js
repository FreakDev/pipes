
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
    dataEmitter: ({value}) => {
        return value
    },
    
    /**
     * @PipeDEF
     * @Pipe\name write
     * @Pipe\type pipe-native
     * @Pipe\description write the input value into a variable
     * @Pipe\param name {Pipe|pipe-var} - will write the input value into box %s, and output the same value as input
     */
    write: ({ name }, input, context) => {        
        try {
            context.setVarValue(name, input)
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
    read: ({ name }, input, context) => {
        let searchedName = name || input
        
        try {
            return context.getVarValue(searchedName)
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
    forward: ({ identifier }, input, context) => {
        return context.invoke(identifier || input)
    },

    /**
     * @PipeDEF
     * @Pipe\name invoke
     * @Pipe\type pipe-native
     * @Pipe\description invoke a function (data feed is preserved)
     * @Pipe\param identifier {Pipe|pipe-func} - will output to %s the value recieved as input
     */
    invoke: ({ identifier }, input, context) => {
        return context.invoke(identifier, input)
    },


    /**
     * @PipeDEF
     * @Pipe\name log
     * @Pipe\type pipe-native
     * @Pipe\description log to console
     * @Pipe\param [before] {Free} - will print %s before input 
     * @Pipe\param [after] {Free} - then %s after. will output the same as inputed
     */
    log: ({ before, after }, input) => {
        let params = []
        before && params.push(before)
        params.push(input)
        after && params.push(after)
        console.log.apply(console, params)
        return input
    }
}