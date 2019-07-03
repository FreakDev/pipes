
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
     * @Pipe\description returns the result of a simple two terms math operation
     * @Pipe\param operator {OneOf[+,-,*,/,%]} - output will be the result of A %s B, with input value as A
     * @Pipe\param value - and %s as B or (if left empty)
     * @Pipe\param variable - the value from box labelled %s
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
     * @Pipe\param operator {OneOf[=,>,<,>=,<=,!=]} - if the input value is %s to/than
     * @Pipe\param value - %s or (if left empty)
     * @Pipe\param variable - the value in the %s box.
     * @Pipe\param outputTrue {Pipe|pipe-func} - Then data flow will be forwarded to %s if the comparison result is true
     * @Pipe\param outputFalse {Pipe|pipe-func} - or to %s if the comparison result is false (if left empty data flow will stop)
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
        return result ? context.invoke(outputTrue, input) : context.invoke(outputFalse, input)
    }

}