import PipeCore, { MODE_DEBUG } from "../../Pipes/Core/PipeCore"

export const MESSAGE_PIPE_CALLED = "pipe-called"
export const MESSAGE_EXECUTION_STOPPED = "execution-stopped"
export const MESSAGE_EXECUTION_STARTED = "execution-started"
export const MESSAGE_EXECUTION_IDLE = "execution-idle"

export default class RuntimeDebugger {

    _core

    constructor() {
        this._core = new PipeCore(MODE_DEBUG, this)

        window.addEventListener("message", (e) => {
            this._core
                .loadJSON(JSON.parse(e.data))
                .run()
        })
    }

    emit(name, payload) {
        window.parent.postMessage(JSON.stringify({
            name,
            payload
        }), "*")
    }

    pipe_called(payload) {

        this.emit(MESSAGE_PIPE_CALLED, {
            ...payload,
            pipe: { id: payload.pipe.id, name: payload.pipe.name, params: payload.pipe.params }
        })
        
    }

    program_started() {
        this.emit(MESSAGE_EXECUTION_STARTED)
    }

    program_stopped() {
        this.emit(MESSAGE_EXECUTION_STOPPED)
    }

    program_turned_idle() {
        this.emit(MESSAGE_EXECUTION_IDLE)
    }
}