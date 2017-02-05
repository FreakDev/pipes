export default {
    add: ({valueToAdd, getValueToAdd}, input, context) => {
        if (typeof valueToAdd === "number")
            return input + valueToAdd
        else {
            return context.invoke(getValueToAdd) + input
        }
    }
}