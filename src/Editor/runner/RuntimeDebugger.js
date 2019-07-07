import PipeCore, { MODE_DEBUG } from "../../Pipes/Core/PipeCore"

import {
    RUNTIME_PIPE_CALLED,
    RUNTIME_EXECUTION_STOPPED,
    RUNTIME_EXECUTION_STARTED,
    RUNTIME_EXECUTION_IDLE,
    RUNTIME_EXECUTION_ERROR,
    DEBUGGER_LOG
} from "../../constants"

import {
    MESSAGE_RUNNER_READY,
    MESSAGE_LOAD,
    MESSAGE_START,
    MESSAGE_PAUSE,
    MESSAGE_RUN_ONE,
    MESSAGE_RUN,
    MODE_NORMAL,
    MODE_TURTLE,
    MODE_STEP 
} from "../constants"

const buildPath = (current, trim = true) => {
    let path = []
    do {
        path.unshift(current.id)
        current = current.parent
    } while (current)
    return trim ? path.slice(1, -1) : path
}

export default class RuntimeDebugger {

    _core

    _getMessageManager
    _postMessage
    _onRuntimeError

    _running = false

    _paused = true

    set paused (value) {
        if (this._paused && !value) {
            let listener
            while (listener = this._onUnPauseListener.pop()) listener.call(global)
        }
        this._paused = value
    }

    _onUnPauseListener = []

    _mode = MODE_NORMAL

    constructor(getMessageManager) {
        this._core = new PipeCore(MODE_DEBUG, {
            pipe_called: this.__pipe_called.bind(this),
            program_started: this.__program_started.bind(this),
            program_stopped: this.__program_stopped.bind(this),
            program_turned_idle: this.__program_turned_idle.bind(this),
            program_error: this.__program_error.bind(this),

            hold: this.__holdRuntime.bind(this),
            log: this.__log.bind(this)
        })

        this._getMessageManager = getMessageManager
    }

    start() {
        this._getMessageManager()
            .then(({ addEventListener, postMessage, onRuntimeError = () => {} }) => {
                this._postMessage = postMessage
                this._onRuntimeError = onRuntimeError

                addEventListener((e) => {
                    const message = e
                    let listenerName = "on" + message.name
                    if (this[listenerName])
                        this[listenerName].call(this, message.payload)
                })
            })
    }

    emit(name, payload) {
        this._postMessage({
            name,
            payload
        })
    }

    onMessageLoad({ program }) {
        this._core
            .loadJSON(program)
    }

    onMessageStart({ mode }) {
        this.paused = false
        this._mode = mode || MODE_NORMAL
        this._core
            .run()
    }

    onMessageRun({ mode }) {
        this.paused = false
        this._mode = mode
        if(!this._running)
            this.onMessageStart({ mode })
    }

    onMessageRunOne() {
        if(!this._running)
            this.onMessageStart({ mode: MODE_STEP })
        else {
            this.paused = false
            this._mode = MODE_STEP
        }
    }

    onMessagePause(paused) {
        this.paused = paused
    }

    _onUnPause(callback) {
        this._onUnPauseListener.push(callback)
    }

    __holdRuntime() {
        return new Promise((resolve, reject) => {
            if (this._paused) {
                this._onUnPause(resolve)
                return
            }

            if (this._mode === MODE_TURTLE) {
                setTimeout(() => {
                    resolve()
                }, 1000);
                return
            }

            resolve()
        })
    }

    __pipe_called(payload) {

        if (this._mode === MODE_STEP) {
            this._paused = true
        }

        const path = buildPath(payload.pipe)

        this.emit(RUNTIME_PIPE_CALLED, {
            ...payload,
            pipe: { id: payload.pipe.id, name: payload.pipe.name, params: payload.pipe.params, path }
        })

    }

    __program_started() {
        this._running = true
        this.emit(RUNTIME_EXECUTION_STARTED)
    }

    __program_stopped() {
        this._running = false
        this.emit(RUNTIME_EXECUTION_STOPPED)
    }

    __program_turned_idle() {
        this.emit(RUNTIME_EXECUTION_IDLE)
    }

    __program_error(error, context) {
        this.emit(RUNTIME_EXECUTION_ERROR, {
            error: error.message,
            callstack: buildPath(context.pipe)  
        })
        this._onRuntimeError()
    }

    __log(d) {
        this.emit(DEBUGGER_LOG, d)
    }
}