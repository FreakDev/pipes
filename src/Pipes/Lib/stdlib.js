import Pipe, { PIPE_VAR } from "../Core/Pipe"

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
     * @Pipe\param name - will write the inputed value in variable named %s 
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
     * name of the variable couls be either a given identifier (as paramter) or the input value (as indentifier)
     * @Pipe\param name - identifier
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
     * @Pipe\description invoke a function
     * the invoked function identifier can be provided either as a parameter or as the input value
     * @Pipe\param identifier - function to invoke identifier
     */
    forward: ({ identifier }, input, context) => {
        return context.invoke(identifier || input)
    },

    
    /**
     * @PipeDEF
     * @Pipe\name log
     * @Pipe\type pipe-native
     * @Pipe\description log to console
     * (should be in a ui or debug package)
     * @Pipe\param before - % will be print before output
     * @Pipe\param after - % will be print after output
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