export const PIPE_VAR = "pipe-var"
export const PIPE_FUNC = "pipe-func"
export const PIPE_NATIVE = "pipe-native"

export default class Pipe {

    _type

    get type() {
        return this._type
    }

    _id

    get id() {
        return this._id
    }

    _name 

    get name() {
        return this._name
    }
    
    _previous

    get previous() {
        return this._previous
    }

    _value

    get value() {
        return this._value
    }

    set value(val) {
        this._value = val
    }

    constructor(type, id, name, value, context) {
        if ([PIPE_VAR, PIPE_FUNC, PIPE_NATIVE].indexOf(type) === -1)
            throw Error('Invalid type')

        if (typeof id !== "string" || id === "") 
            throw Error('Invalid id')

        if (typeof name !== "string") 
            throw Error('Invalid name')

        this._id = id
        this._type = type
        this._name = name
        this._value = value,
        this._previous = context.previous
    }

    run () {
        if (this._type === PIPE_FUNC) {
            this.pipes.run()
        }
    }
}