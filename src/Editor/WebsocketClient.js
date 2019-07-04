import io from "socket.io-client"

export const I_AM_RUNNER = "Runner"
export const I_AM_EDITOR = "Editor"

const MESSAGE_RUNNER_CONNECTED = "RunnerConnected"

export default class WebsocketClient {

    _iAm

    _socket

    _eventListener = []

    _connectedToRunner = false
    _connectedToServer = false

    get connected() {
        return this._connectedToServer && this._connectedToRunner
    }

    constructor(WhatIAm) {
        this._iAm = WhatIAm
    }

    connect(server) {
        return new Promise((resolve) => {
            this._socket = io(server)

            this._socket.on('message', this.onMessage.bind(this))
            this._socket.on('disconnect', () => {
                this._connectedToServer = false
                this._connectedToRunner = false
            })

            this._socket.on('connect', () => {
                this.postMessage({
                    name: "IAm" + this._iAm
                })
                this._connectedToServer = true
                resolve()
            })
        })
    }

    onMessage(e) {
        if (e.name === MESSAGE_RUNNER_CONNECTED) {
            this._connectedToRunner = true
        } else if (e.name === MESSAGE_CLOSING) {
            this._connectedToRunner = false
        } else {
            this._eventListener.forEach(listener => {
                listener.call(this, e)
            });
        }
    }

    postMessage(d) {
        this._socket.emit("message", d)
    }

    addEventListener(callback) {
        this._eventListener.push(callback)
    }

    removeEventListener(callback) {
        const idx = this._eventListener.indexOf(callback)
        if (idx !== -1) {
            this._eventListener.splice(idx, 1)
        }
    }
}
