import { PIPE_TYPE_NATIVE } from "../../constants"

import PipeFactory from "./PipeFactory"

import stdlib from "../Lib/stdlib"
import math from "../Lib/math"
import event from "../Lib/event"
import string from "../Lib/string"
// import cli from "../Lib/cli"
import time from "../Lib/time"

const LIB = {
    stdlib,
    // cli,
    math,
    event,
    time,
    string
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
            compile: this._compile.bind(this, this._mode === MODE_DEBUG),
            debug: this._mode === MODE_DEBUG ? this._debugger.log : () => {}
        })
        return this
    }

    run() {
        this._debugger && this._debugger.program_started()
        return this._program.run()
            .then(() => {
                this._debugger && this._debugger.program_stopped()
            }, (e) => {
                if (!this._debugger)
                    throw e
                else 
                    this._debugger && this._debugger.program_error(e, { pipe: this })
            })
    }


    _doRun(compiled, input) {
        const errHandler = (e) => {
            if (e instanceof Error) {
                return Promise.reject(e)
            } else {
                // pipe has stopped the flow by will
                return Promise.reject()
            }
        }

        return compiled.reduce((prev, curr) => prev.then(i => {
            return curr(i).then(false, errHandler)
        }), Promise.resolve(input))
    }

    _compilePipe(context, debug = false, pipe) {
        let fn = null

        if (pipe.type !== PIPE_TYPE_NATIVE) {
            fn = pipe.run.bind(pipe)
        }

        if (!fn) {
            fn = this._resolveNS(pipe.alias || pipe.name, LIB).bind({ id: pipe.id, name: pipe.name, ...context }, pipe.params || {})
        }

        return !debug ?
            (input) => {
                return fn(input, context)
            }
            :
            ((input) => {
                this._debugger.pipe_called({ pipe, input })
                return this._debugger.hold()
                    .then(() => {
                        return fn(input, context)
                    })

            }).bind(this)
    }

    _compile(withDebugger, pipes, context) {
        return pipes.map(this._compilePipe.bind(this, context, withDebugger))
    }

    _resolveNS = (ns, ctxt) => {
        let ref = ctxt
        ns.split('.').forEach(ns => {
            ref = ref[ns]
        });
        return ref
    }

}