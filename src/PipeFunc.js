import stdlib from "./PipesLib/stdlib"
import math from "./PipesLib/math"
import event from "./PipesLib/event"

import Pipe from "./Pipe"
import PipeFactory from "./PipeFactory"

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

    get params() {
        return this._params
    } 

    get pipes() {
        return this._storage
    }

    get length() {
        return this._storage.length
    }

    constructor(type, name, elems, params) {
        super(type, name, null)

        this._cache = new CacheManager()
        this._params = params

        this.find = this._storage.find.bind(this._storage)

        let pipeFactory = new PipeFactory()
        if (elems)
            elems.forEach(e => this.add(pipeFactory.build(e)))
    }

    run(input) {
        if (this.has("main"))
            return this.invoke("main", input)
    }
    
    _compile(chain) {
        return chain.pipes.map(pipe => {
            let fn = null
            
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

    invoke(chainName, input, params = {}) {
        let compiled
        const chain = this.find(chain => chain.name === chainName)
        if (chain) {
            compiled = this._cache.getCacheOrPorcess(
                "compiled-" + chainName,
                () => this._compile(chain)
            )
        } else {
            compiled = this._compile({pipes:[chainName]})
        }

        return compiled.reduce((prev, curr) => curr(prev, this), input)
    }



    has(key, byRef = false) {
        if (!byRef) {
            return Object.keys(this._index).indexOf(key) !== -1
        } else {
            throw "not supported yet"
        }
    }

    add(element) {
        let key = element[this._indexProp]

        if (Object.keys(this._index).indexOf(key) !== -1) {
            throw Error(`Key ${key} already exists`)
        }

        this._index[key] = this._storage.length
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

        this._storage.splice()
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