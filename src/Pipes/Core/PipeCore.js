
import PipeFactory from "./PipeFactory"
import { PIPE_NATIVE } from "./Pipe"

import stdlib from "../Lib/stdlib"
import math from "../Lib/math"
import event from "../Lib/event"

const LIB = {
    stdlib,
    math,
    event
}

export const MODE_DEBUG = "debug"
export const MODE_PROD = "prod"

export default class PipeCore 
{
    _pipeFactory

    _program

    _mode

    constructor(mode = MODE_PROD, runtimeDebugger = null) {
        this._pipeFactory = new PipeFactory()

        this._debugger = runtimeDebugger

        this._mode = mode
    }

    loadJSON(programAsJson) {
        this._program = this._pipeFactory.build(programAsJson, null, {
            doRun: this._doRun.bind(this),
            compile: this._mode === MODE_DEBUG ? this._compileWithDebug.bind(this) : this._compile.bind(this)
        })
        return this
    }

    run() {
        return this._program.run()
    }


    _doRun(compiled, input) {
        return compiled.reduce((prev, curr) => prev.then(curr), Promise.resolve(input))
    }

    _compile(pipes, context) {

        return pipes.map(pipe => {
            let fn = null
            
            if (pipe.type !== PIPE_NATIVE) {
                fn = pipe.run.bind(pipe)
            }
            
            if (!fn) {
                fn = this._resolveNS(pipe.alias || pipe.name, LIB).bind(global, pipe.params || {})
            }
            
            return this._makeRunnable(fn, false, context)
        })
    }

    _compileWithDebug(pipes, context) {

        return pipes.map(pipe => {
            let fn = null
            
            if (pipe.type !== PIPE_NATIVE) {
                fn = pipe.run.bind(pipe)
            }
            
            if (!fn) {
                fn = this._resolveNS(pipe.alias || pipe.name, LIB).bind(global, pipe.params || {})
            }
            
            return this._makeRunnable(fn, true, context, { pipe })
        })
    }

    _makeRunnable(fn, withDebug, context, { pipe }) {
        return !withDebug ? 
            (input) => {
                return fn(input, context)
            }
            :
            ((input) => {
                this._debugger.emit({
                    name: "pipe call",
                    payload: {
                        pipe,
                        input
                    }
                })
                return fn(input, context)
            }).bind(this)
    }

    _resolveNS = (ns, ctxt) => {
        let ref = ctxt
        ns.split('.').forEach(ns => {
            ref = ref[ns]
        });
        return ref
    }

}