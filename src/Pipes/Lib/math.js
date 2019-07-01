
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
    }
}