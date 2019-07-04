import PipeCore, { MODE_DEBUG } from "../../Pipes/Core/PipeCore"

export const RUNTIME_PIPE_CALLED = "pipe-called"
export const RUNTIME_EXECUTION_STOPPED = "execution-stopped"
export const RUNTIME_EXECUTION_STARTED = "execution-started"
export const RUNTIME_EXECUTION_IDLE = "execution-idle"

export const MESSAGE_RUNNER_READY = "MessageRunnerReady"

export const MESSAGE_LOAD = "MessageLoad"
export const MESSAGE_START = "MessageStart"
export const MESSAGE_PAUSE = "MessagePause"
export const MESSAGE_RUN_ONE = "MessageRunOne"
export const MESSAGE_RUN = "MessageRun"

export const MODE_NORMAL = "normal"
export const MODE_TURTLE = "turtle"
export const MODE_STEP = "step"

export default class RuntimeDebugger {

    _core

    _getMessageManager
    _postMessage

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

            hold: this.__holdRuntime.bind(this)
        })

        this._getMessageManager = getMessageManager
    }

    start() {
        this._getMessageManager()
            .then(({ addEventListener, postMessage }) => {
                this._postMessage = postMessage

                addEventListener((e) => {
                    const message = e
                    let listenerName = "on" + message.name
                    if (this[listenerName])
                        this[listenerName].call(this, message.payload)
                })
            })
    }

    emit(name, payload) {
        this._postMessage(JSON.stringify({
            name,
            payload
        }))
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

        this.emit(RUNTIME_PIPE_CALLED, {
            ...payload,
            pipe: { id: payload.pipe.id, name: payload.pipe.name, params: payload.pipe.params }
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
}