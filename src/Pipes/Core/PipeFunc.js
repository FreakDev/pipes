import Pipe, { PIPE_VAR, PIPE_FUNC, PIPE_NATIVE } from "./Pipe"

export default class PipeFunc extends Pipe {

    _storage = []
    get pipes() {
        return this._storage
    }

    get length() {
        return this._storage.length
    }

    _index = {}
    _indexProp = "id"

    _parent

    get parent() {
        return this._parent
    }

    _context

    _runner

    _pipeFactory

    _value

    get value() {
        return this._value
    }

    constructor(type, id, name, context) {
        super(type, id, name, context)

        this._parent = context.parent
        this._runner = context.runner
        this._pipeFactory = context.factory

        this._value = context.value
        
        this._context = {
            invoke: this._invoke.bind(this),
            forward: this._runFrom.bind(this),
            getVarValue: this._getVarValue.bind(this),
            setVarValue: this._setVarValue.bind(this),
            addVarListener: this._addVarListener.bind(this),
            removeVarListener: this._removeVarListener.bind(this),
            debug: this._runner.debug
        }

    }

    run(input, context) {
        if (!this.length)
            this.value.forEach(e => this._add(this._pipeFactory.build(e, this, this._runner), e.type !== PIPE_NATIVE))
        let main = "main"
        const chainHeads = this._findHeads()
        if (chainHeads.length === 1) {
            main = chainHeads[0].name
        }

        const variables = this._filter(p => p.type === PIPE_VAR)
        const variableInitialValue = {}
        variables.forEach((variable) => {
            variableInitialValue[variable.name] = variable.value
            if (this.params[variable.name]) {
                variable.value = context.getVarValue(this.params[variable.name])
            }
        })

        // try {
            return this._runFrom(main, input)
                .then(() => {
                    variables.forEach((variable) => {
                        variable.value = variableInitialValue[variable.name]
                    })
                })
        // } catch (e) {
        //     throw Error("Invalid Pipe : several chains or pipes and none called \"main\" in \"" + this.name + "\" (" + this.id + ") run failed with message " + e)
        // }
    }

    _runFrom(callable, input) {
        let pipe = this._find(pipe => pipe.name === callable, this, true)
        if (pipe) {
            return this._doRun(this._buildAndCompile(pipe), input)
        }
    }

    _invoke(callable, input) {
        if (typeof callable === 'string') {
            callable = this._find(pipe => pipe.name === callable, this, true)
        }
        return callable && this._doRun(this._compile([callable]), input)
    }

    _getVarValue(varName) {
        let targetVar = this._find(p => p.type === PIPE_VAR && p.name === varName)
        if (targetVar) {
            return targetVar.value
        } else {
            throw Error ('Unknow var ' + varName)
        }
    }

    _setVarValue(varName, varValue) {
        let targetVar = this._find(p => p.type === PIPE_VAR && p.name === varName)
        if (targetVar) {
            targetVar.value = varValue
        } else {
            throw Error ('Unknow var ' + varName)
        }
    }

    _addVarListener(varName, callback) {
        const pipeVar = this._find(p => p.type === PIPE_VAR && p.name === varName)

        if (pipeVar) {
            pipeVar.addListener(callback)
            return true
        }
        return false
    }

    _removeVarListener(varName, callback) {
        const pipeVar = this._find(p => p.type === PIPE_VAR && p.name === varName)

        if (pipeVar) {
            return pipeVar.removeListener(callback)
        }
        return false
    }

    _buildAndCompile(headPipe) {
        let chain = [], current = headPipe, next
        do {
            if (current.type !== PIPE_VAR) {
                chain.push(current)
            }
            next = this._find(p => p.previous === current.id)
            current = next
        } while(next)
        return this._compile(chain)
    }

    _doRun(compiled, input) {
        return this._runner.doRun(compiled, input)
    }

    _compile(pipes) {
        return this._runner.compile(pipes, this._context)
    }

    _findHeads(name = "") {
        const chainHeads = this._filter(p => !p.previous)
        if (name) {
            return chainHeads.find(p => p.name === name)
        }
        return chainHeads
    }

    _find(searchCallback, thisArg = this, disableLookUp = false) {
        return this._storage.find(searchCallback, thisArg) || (!disableLookUp && this._parent && this._parent._find(searchCallback, thisArg))
    }

    _filter(filterCallback, thisArg = this) {
        return this._storage.filter(filterCallback, thisArg)
    }

    _add(element, index = true) {
        if (index) {
            let key = element[this._indexProp]

            if (Object.keys(this._index).indexOf(key) !== -1) {
                throw Error(`Key ${key} already exists`)
            }

            this._index[key] = this._storage.length
        }
        this._storage.push(element)
    }


    // unused code

    _has(key, byRef = false) {
        if (!byRef) {
            return Object.keys(this._index).indexOf(key) !== -1
        } else {
            throw "not supported yet"
        }
    }

    _remove(key, byRef = false) {
        let storagePos, indexKey
        if (!byRef) {
            storagePos = this._index[key]
            indexKey = key
        } else {
            storagePos = this._storage.indexOf(key)
            indexKey = Object.keys(this._index).find(indexKey => this._index[indexKey] === storagePos)
        }

        this._storage.splice(storagePos, 1)
        delete this._index[indexKey]

        Object.keys(this._index).forEach(key => {
            if(this._index[key] > storagePos) {
                this._index[key] = this._index[key] - 1
            }
        })
    }

    _get(key) {
        return this._storage[this._index[key]]
    }

    _set(key, value) {
        this._storage[this._index[key]] = value
    }

}