import Pipe, { PIPE_VAR } from "../Core/Pipe"

/**
 * @PipeDEF
 * @Pipe\lib stdlib
 */
export default {
    /**
     * @PipeDEF
     * @Pipe\name dataEmitter
     * @Pipe\description emit a value
     * often used to start a sequence
     * @Pipe\param value - value to emit
     */
    dataEmitter: ({value}) => {
        return value
    },
    
    /**
     * @PipeDEF
     * @Pipe\name write
     * @Pipe\description write the input value into a variable
     * @Pipe\param name - name of the vqriqble
     */
    write: ({ name }, input, context) => {
        let newValue = new Pipe(PIPE_VAR, name, input)
        context.has( name ) ? context.set(name, newValue) : context.add({ name, value: newValue })
        return input
    },

    
    /**
     * @PipeDEF
     * @Pipe\name read
     * @Pipe\description read a variable value
     * name of the variable couls be either a given identifier (as paramter) or the input value (as indentifier)
     * @Pipe\param name - identifier
     */
    read: ({ name }, input, context) => {
        return context.get(name || input).value
    },

    
    /**
     * @PipeDEF
     * @Pipe\name invoke
     * @Pipe\description invoke a function
     * the invoked function identifier can be provided either as a parameter or as the input value
     * @Pipe\param identifier - function to invoke identifier
     */
    invoke: ({ identifier }, input, context) => {
        return context.invoke(identifier || input)
    },

    
    /**
     * @PipeDEF
     * @Pipe\name log
     * @Pipe\description log to console
     * (should be in a ui or debug package)
     * @Pipe\param prefix - set a prefix to the logged value (input value)
     */
    log: ({ prefix }, input) => {
        console.log(prefix + input)
        return input
    }
}