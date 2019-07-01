import Pipe, { PIPE_VAR, PIPE_FUNC, PIPE_NATIVE } from "./Pipe"
import pipeFactory from "./factory"

import stdlib from "../Lib/stdlib"
import math from "../Lib/math"
import event from "../Lib/event"

const LIB = {
    stdlib,
    math,
    event
}

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

    _params

    get params() {
        return this._params
    } 

    _parent

    _context

    constructor(type, id, name, children, context) {
        super(type, id, name, children, context)

        this._params = context.params
        this._parent = context.parent

        this._context = { 
            invoke: this._invoke.bind(this), 
            getVarValue: this._getVarValue.bind(this), 
            setVarValue: this._setVarValue.bind(this),
            addVarListener: this._addVarListener.bind(this),
            removeVarListener: this._removeVarListener.bind(this)
        }

    }

    run(input) {
        if (!this.length)
            this._value.forEach(e => this._add(pipeFactory.build(e, this), e.type !== PIPE_NATIVE))
        let main = "main"
        const chainHeads = this._filter(p => !p.previous)
        if (chainHeads.length === 1) {
            main = chainHeads[0].name
        }

        try {
            return this._invoke(main, input)
        } catch (e) {
            throw Error("Invalid Pipe : several chains or pipes and none called \"main\" in \"" + this.name + "\" (" + this.id + ") run failed with message " + e)   
        }
    }

    _invoke(callable, input) {
        if (typeof callable === 'string') {
            let pipe = this._find(pipe => pipe.name === callable)
            if (pipe) {
                return this._doRun(this._buildAndCompile(pipe), input)
            }
        } else if ([PIPE_NATIVE, PIPE_FUNC].indexOf(callable.type) !== -1) {
                return this._doRun(this._compile([callable]), input)
        }
        throw Error(`Error : ${ callable } is not callable`)
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
            chain.push(current)
            next = this._find(p => p.previous === current.id)
            current = next
        } while(next)
        return this._compile(chain)
    }

    _doRun(compiled, input) {
        return compiled.reduce((prev, curr) => prev.then(curr), Promise.resolve(input))
    }

    _compile(pipes) {

        return pipes.map(pipe => {
            let fn = null
            
            if (pipe.type !== PIPE_NATIVE) {
                fn = pipe.run.bind(pipe)
            }
            
            if (!fn) {
                fn = this._resolveNS(pipe.alias || pipe.name, LIB).bind(global, pipe.params || {})
            }
            
            return (input) => {
                return fn(input, this._context)
            }
        })
    }

    _find(searchCallback, thisArg = this, disableLookUp = false) {
        return this._storage.find(searchCallback, thisArg) || (!disableLookUp && this._parent && this._parent._find(searchCallback, thisArg))
    }

    _filter(filterCallback, thisArg = this) {
        return this._storage.filter(filterCallback, thisArg)
    }

    _resolveNS = (ns, ctxt) => {
        let ref = ctxt
        ns.split('.').forEach(ns => {
            ref = ref[ns]
        });
        return ref
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