import io from "socket.io-client"

const MESSAGE_I_AM_A_RUNNER = {
    name: "IAmRunner"
}

export default class WebsocketClient {

    socket

    _eventListener = []

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
        this.postMessage(MESSAGE_I_AM_A_RUNNER)
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
