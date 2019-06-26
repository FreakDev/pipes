import { PIPE_VAR, PIPE_FUNC, PIPE_NATIVE } from "./Pipe"

import stdlib from "../Lib/stdlib"
import math from "../Lib/math"
import event from "../Lib/event"

import Pipe from "./Pipe"
import PipeFactory from "../Factory"

import CacheManager from "./CacheManager"

const LIB = {
    stdlib,
    math,
    event
}

export default class PipeFunc extends Pipe {
    _storage = []
    _index = {}

    _indexProp = "name"

    _cache

    _params
    _parent

    get params() {
        return this._params
    } 

    get pipes() {
        return this._storage
    }

    get length() {
        return this._storage.length
    }

    constructor(type, name, elems, context) {
        super(type, name, null)

        this._cache = new CacheManager()
        this._params = context.params
        this._parent = context.parent

        let pipeFactory = new PipeFactory()
        if (elems) {
                                                            // should (only) check if it has a name (to be indexed)
            elems.forEach(e => this.add(pipeFactory.build(e, this), e.type === PIPE_NATIVE))            
        }
    }

    start(input) {
        if (this.has("main"))
            return this.invoke("main", input)
    }
    
    _compile(chain) {
        return chain.pipes.map(pipe => {
            let fn = null
            
            // should be this test pipe.type !== PIPE_NATIVE
            if (pipe.pipes && pipe.pipes.length) {
                fn = this.find(chain => chain.name === pipe.name)
                if (fn)
                    fn = fn.run
            }
            
            if (!fn) {
                fn = this._resolveNS(pipe.name, LIB).bind(global, pipe.params || {})
            }
            
            return fn
        })
    }

    invoke(chainName, input) {
        let compiled
        if (typeof chainName === "string") {
            let chain = this.find(chain => chain.name === chainName)
            compiled = this._cache.getCacheOrPorcess(
                "compiled-" + chainName,
                () => this._compile(chain)
            )
        } else {
            compiled = this._compile({pipes:[chainName]})
        }

        return compiled.reduce((prev, curr) => curr(prev, this), input)
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

    add(element, noIndex = false) {
        if (!noIndex) {
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