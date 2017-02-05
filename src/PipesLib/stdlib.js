
export default {
    dataEmitter: ({value}) => {
        return value
    },

    save: ({ name }, input, context) => {
        context.add({ name, value: input })
        return input
    },

    read: ({ name }, input, context) => {
        return context.get(name || input).value
    },

    log: ({}, input) => {
        console.log(input)
        return input
    }
}