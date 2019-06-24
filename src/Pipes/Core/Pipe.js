export const PIPE_VAR = "pipe-var"
export const PIPE_FUNC = "pipe-func"
export const PIPE_ALIAS = "pipe-alias"

export default class Pipe {

    _type

    get type() {
        return this._type
    }

    _name 

    get name() {
        return this._name
    }
    _value

    get value() {
        return this._value
    }

    constructor(type, name, value) {
        if ([PIPE_VAR, PIPE_FUNC, PIPE_ALIAS].indexOf(type) === -1)
            throw Error('Invalid type')

        if (typeof name !== "string") 
            throw Error('Invalid name')

        this._type = type
        this._name = name
        this._value = value
    }

    run () {
        if (this._type === PIPE_FUNC) {
            this.pipes.run()
        }
    }
}