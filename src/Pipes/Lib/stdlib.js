import Pipe, { PIPE_VAR } from "../Core/Pipe"

export default {
    dataEmitter: ({value}) => {
        return value
    },

    write: ({ name }, input, context) => {
        let newValue = new Pipe(PIPE_VAR, name, input)
        context.has( name ) ? context.set(name, newValue) : context.add({ name, value: newValue })
        return input
    },

    read: ({ name }, input, context) => {
        return context.get(name || input).value
    },

    invoke: ({ identifier }, input, context) => {
        return context.invoke(identifier || input)
    },

    log: ({ prefix }, input) => {
        console.log(prefix + input)
        return input
    }
}