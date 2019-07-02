
/**
 * @PipeDEF
 * @Pipe\lib math
 */
export default {
    /**
     * @deprecated
     * @PipeDEF
     * @Pipe\name listen
     * @Pipe\type pipe-native
     * @Pipe\param valueToAdd -
     * @Pipe\param getValueToAdd -
     */
    add: ({valueToAdd, getValueToAdd}, input, context) => {
        return new Promise((resolve) => {
            if (typeof valueToAdd === "number") {
                resolve(input + valueToAdd)
            }
            else {
                context.invoke(getValueToAdd).then((valueToAdd) => {
                    resolve(valueToAdd + input)
                })
            }
        })
    },

    /**
     * @PipeDEF
     * @Pipe\name operation
     * @Pipe\type pipe-native
     * @Pipe\description returns the result of a simple two term math operation
     * @Pipe\param operator {OneOf[+,-,*,/,%]} - input %s
     * @Pipe\param value - %s or
     * @Pipe\param variable - use the value of the %s variable
     */
    operation: ({ operator, value, variable }, input, context) => {
        let result
        switch (operator) {
        case "+":
            result = input + (value || context.getVarValue(variable))
            break
        case "-":
            result = input - (value || context.getVarValue(variable))
            break
        case "*":
            result = input + (value || context.getVarValue(variable))
            break
        case "/":
            result = input - (value || context.getVarValue(variable))
            break
        case "%":
            result = input + (value || context.getVarValue(variable))
            break
        }
        return result
    },

    /**
     * @PipeDEF
     * @Pipe\name compare
     * @Pipe\type pipe-native
     * @Pipe\description perform comparison between input and a given parameter
     * @Pipe\param operator {OneOf[=,>,<,>=,<=,!=]} - is the input %s to/than
     * @Pipe\param value - %s or
     * @Pipe\param variable - the value of the %s variable
     * @Pipe\param outputTrue - the data flow will be forwarded if the comparison result is true
     * @Pipe\param outputFalse - the data flow will be forwarded if the comparison result is false
     */
    compare: ({ operator, value, variable, outputTrue, outputFalse }, input, context) => {
        let result
        switch (operator) {
        case "=":
            result = input == (value || context.getVarValue(variable))
            break
        case ">":
            result = input > (value || context.getVarValue(variable))
            break
        case "<":
            result = input < (value || context.getVarValue(variable))
            break
        case ">=":
            result = input >= (value || context.getVarValue(variable))
            break
        case "<=":
            result = input <= (value || context.getVarValue(variable))
            break
        case "!=":
            result = input != (value || context.getVarValue(variable))
            break
        }
        return result ? context.invoke(outputTrue) : context.invoke(outputFalse)
    }

}