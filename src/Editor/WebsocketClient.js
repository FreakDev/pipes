import io from "socket.io-client"

export const I_AM_RUNNER = "Runner"
export const I_AM_EDITOR = "Editor"

export default class WebsocketClient {

    _iAm

    socket

    _eventListener = []

    constructor(WhatIAm) {
        this._iAm = WhatIAm
    }

    connect(server) {
        this.socket = io(server)

        this.socket.on('message', this.onMessage.bind(this))
        this.socket.on('disconnect', this.onDisconnect.bind(this))

        return new Promise((resolve) => {
            this.socket.on('connect', this.onConnect.bind(this))
            resolve(0)
        })
    }

    onConnect() {
        this.postMessage({
            name: "IAm" + this._iAm
        })
    }

    onMessage(e) {
        this._eventListener.forEach(listener => {
            listener.call(this, e)
        });
    }

    onDisconnect() {

    }

    postMessage(d) {
        this.socket.emit("message", d)
    }

    addEventListener(callback) {
        this._eventListener.push(callback)
    }
}
