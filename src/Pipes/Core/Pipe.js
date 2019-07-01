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
        const oldValue = this._value
        this._value = val
        this._valueChangeListener.forEach(listener => listener.call(this, this._value, oldValue))
    }

    _valueChangeListener = []

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

    addListener (callback) {
        this._valueChangeListener.push(callback)
    }

    removeListener (callback) {
        const listenerIndex = this._valueChangeListener.indexOf(callback)
        if (listenerIndex !== -1) {
            this._valueChangeListener.splice(listenerIndex, 1)
            return true
        }
        return false
    }

}