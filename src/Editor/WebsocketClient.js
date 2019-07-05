import io from "socket.io-client"

export const I_AM_RUNNER = "Runner"
export const I_AM_EDITOR = "Editor"

const MESSAGE_RUNNER_CONNECTED = "RunnerConnected"
const MESSAGE_RUNNER_NOT_CONNECTED = "RunnerNotConnected"
const MESSAGE_CLOSING = "Closing"

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

            this._socket.on('disconnect', () => {
                this._connectedToServer = false
                this._connectedToRunner = false
            })

            this._socket.on('connect', () => {
                this.postMessage({
                    name: "IAm" + this._iAm
                })
                this._connectedToServer = true

                if (this._iAm === I_AM_EDITOR) {
                    const onInitMessage = (e) => {
                        if (e.name === MESSAGE_RUNNER_CONNECTED || e.name === MESSAGE_RUNNER_NOT_CONNECTED) {
                            if (e.name === MESSAGE_RUNNER_CONNECTED) {
                                this._connectedToRunner = true
                                this._socket.off("message", onInitMessage)
                            } else {
                                this._connectedToRunner = false
                            }
                        }
                        this._socket.off("message", onInitMessage)
                        this._socket.on('message', this.onMessage.bind(this))
                        resolve()
                    }
                    this._socket.on("message", onInitMessage)    
                } else {
                    this._socket.on('message', this.onMessage.bind(this))
                    resolve()
                }
            })
        })
    }

    onMessage(e) {
        if (e.name === MESSAGE_CLOSING) {
            this._connectedToRunner = false
        } else if (e.name === MESSAGE_RUNNER_CONNECTED) {
            this._connectedToRunner = true
        } else {
            this._eventListener.forEach(listener => {
                listener.call(this, e)
            })    
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
