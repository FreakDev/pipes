import PipeCore, { MODE_DEBUG } from "../../Pipes/Core/PipeCore"

export const RUNTIME_PIPE_CALLED = "pipe-called"
export const RUNTIME_EXECUTION_STOPPED = "execution-stopped"
export const RUNTIME_EXECUTION_STARTED = "execution-started"
export const RUNTIME_EXECUTION_IDLE = "execution-idle"

export const MESSAGE_LOAD = "MessageLoad"
export const MESSAGE_START = "MessageStart"
export const MESSAGE_PAUSE = "MessagePause"

export default class RuntimeDebugger {

    _core

    _messageEventEmitter

    _messageEventPoster

    constructor(messageEventEmitter, messageEventPoster) {
        this._core = new PipeCore(MODE_DEBUG, {
            pipe_called: this.__pipe_called.bind(this),
            program_started: this.__program_started.bind(this),
            program_stopped: this.__program_stopped.bind(this),
            program_turned_idle: this.__program_turned_idle.bind(this),
        })

        this._messageEventEmitter = messageEventEmitter
        this._messageEventPoster = messageEventPoster
    }

    start() {
        this._messageEventEmitter.addEventListener("message", (e) => {
            const message = JSON.parse(e.data)
            let listenerName = "on" + message.name
            if (this[listenerName])
                this[listenerName].call(this, message.payload)
        })
    }

    emit(name, payload) {
        this._messageEventPoster.postMessage(JSON.stringify({
            name,
            payload
        }), "*")
    }

    onMessageLoad({ program }) {
        this._core
            .loadJSON(program)
    }

    onMessageStart() {
        this._core
            .run()
    }

    __pipe_called(payload) {

        this.emit(RUNTIME_PIPE_CALLED, {
            ...payload,
            pipe: { id: payload.pipe.id, name: payload.pipe.name, params: payload.pipe.params }
        })

    }

    __program_started() {
        this.emit(RUNTIME_EXECUTION_STARTED)
    }

    __program_stopped() {
        this.emit(RUNTIME_EXECUTION_STOPPED)
    }

    __program_turned_idle() {
        this.emit(RUNTIME_EXECUTION_IDLE)
    }
}