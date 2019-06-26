import Pipe, { PIPE_VAR, PIPE_FUNC, PIPE_NATIVE } from "./Pipe"
import pipeFactory from "../factory"

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
    _indexProp = "name"

    _params

    get params() {
        return this._params
    } 

    _parent

    _children

    constructor(type, name, children, context) {
        super(type, name, null)

        this._params = context.params
        this._parent = context.parent
        this._children = children
    }

    run(input) {
        if (!this.length)
            this._children.forEach(e => this.add(pipeFactory.build(e, this), e.type !== PIPE_NATIVE))

        if (this.has("main"))
            return this.invoke("main", input)
        else
            return this._compile(this.pipes).reduce((prev, curr) => curr(prev, this), input)
    }
    
    _compile(pipes) {

        return pipes.map(pipe => {
            let fn = null
            
            if (pipe.type !== PIPE_NATIVE) {
                fn = this.find(chain => chain.name === pipe.name)
                if (fn)
                    fn = fn.run
            }
            
            if (!fn) {
                fn = this._resolveNS(pipe.alias || pipe.name, LIB).bind(global, pipe.params || {})
            }
            
            return fn
        })
    }

    invoke(callable, input) {
        if (typeof callable === 'string') {
            let pipe = this.find(pipe => pipe.name === callable)
            return pipe.run(input)
        } else {
            if ([PIPE_NATIVE, PIPE_FUNC].indexOf(callable.type) !== -1)
                return this._compile([callable]).reduce((prev, curr) => curr(prev, this), input)
            else 
                throw Error(`Error : ${ callable } is not callable`)
        }
    }

    find(searchCallback) {
        return this._storage.find(searchCallback) || (this._parent && this._parent.find(searchCallback))
    }

    has(key, byRef = false) {
        if (!byRef) {
            return Object.keys(this._index).indexOf(key) !== -1
        } else {
            throw "not supported yet"
        }
    }

    add(element, index = true) {
        if (index) {
            let key = element[this._indexProp]

            if (Object.keys(this._index).indexOf(key) !== -1) {
                throw Error(`Key ${key} already exists`)
            }
    
            this._index[key] = this._storage.length    
        }
        this._storage.push(element)
    }

    remove(key, byRef = false) {
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

    get(key) {
        return this._storage[this._index[key]]
    }

    set(key, value) {
        this._storage[this._index[key]] = value
    }

    _resolveNS = (ns, ctxt) => {
        let ref = ctxt
        ns.split('.').forEach(ns => {
            ref = ref[ns]
        });
        return ref
    }
}