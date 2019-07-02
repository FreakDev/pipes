
export default {
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
     * @Pipe\param value - use the value of the %s variable
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
    }

}