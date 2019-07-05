import WebsocketClient, { I_AM_EDITOR } from "./WebsocketClient"

export const MODE_WEB = "web"
export const MODE_NODE = "node"

const MESSAGE_CLOSING = "Closing"

export default class MessageManager {

    _messageCallback

    set messageCallback (cb) {
        this._messageCallback = cb
    }

    _runnerWindow
    _wsClient

    _mode = MODE_WEB

    get mode() {
        return this._mode
    }

    get isRunning() {
        return !!( (this.mode === MODE_WEB && this._runnerWindow) || (this.mode === MODE_NODE && this._wsClient && this._wsClient.connected) )
    }

    constructor() {
        this._onMessage = this._onMessage.bind(this)
    }

    setMode(value) {
        this._unset()
        this._mode = value
        this._setup()
    }

    start(dimension = {}) {
        return new Promise((resolve, reject) => {
            if (this.mode === MODE_WEB) {
                if (!this._runnerWindow)
                    this._createChildWindow(dimension)
                        .then(resolve)
            } else {
                if (!this._wsClient)
                    return this._createWebSocketClient()
                        .then(resolve)
                else if (!this._wsClient.connected) {
                    alert("No runner connecter - connect one and relaunch")
                }
            }

            reject()
        })
    }

    stop() {
        if (this.mode === MODE_WEB) {
            this._runnerWindow = null
        } else {
            this._wsClient /* && this._wsClient.stop() */
        }
    } 

    destroy() {
        this._unset()
    }

    postMessage(d) {
        if (this.mode === MODE_WEB) {
            this._runnerWindow && this._runnerWindow.postMessage(d, "*")
        } else {
            if (this._wsClient && this._wsClient.connected) {
                this._wsClient.postMessage(d)
            } else {
                alert("No runner client found")
            }
        }
    }

    _unset() {
        if (this.mode === MODE_WEB) {
            window.removeEventListener('message', this._onMessage)
        } else {
            this._wsClient && this._wsClient.removeEventListener(this._onMessage)
        }
    }

    _setup() {
        if (this._mode === MODE_WEB) {
            if (this._runnerWindow)
                window.addEventListener("message", this._onMessage)
        } else {
            if (this._wsClient)
                this._wsClient.addEventListener(this._onMessage)
        }
    }

    _createChildWindow({ width = 500, height = 350 }) {
        return new Promise(resolve => {
            this._runnerWindow = window.open("runner-for-editor.html", "Pipe Runner", "height=" + height + ",width=" + width)
            this._runnerWindow.onload = () => {
                this._setup()
                resolve()
            }
        })
    }

    _createWebSocketClient() {
        return new Promise (resolve => {
            this._wsClient = new WebsocketClient(I_AM_EDITOR)
            this._wsClient.connect(/* same url as served page */).then(() => {
                this._setup()
                if (!this._wsClient.connected) {
                    alert("No runner client found")
                }    
                resolve()
            })
        })
    }

    _onMessage(e) {
        let d = e
        if (this.mode === MODE_WEB) {
            d = e.data
        }

        if (d.name === MESSAGE_CLOSING) {
            if (d.payload.platform === MODE_WEB) {
                this._runnerWindow = null
            }
        }

        this._messageCallback.call(this, d)
    }

}