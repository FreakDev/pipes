import WebsocketClient, { I_AM_EDITOR } from "./WebsocketClient"

export const MODE_WEB = "web"
export const MODE_NODE = "node"

export default class MessageManager {

    _messageCallback

    set messageCallback (cb) {
        this._messageCallback = cb
    }

    _runnerWindow
    _wsClient

    _mode = MODE_WEB

    get isRunning() {
        return !!(this._runnerWindow || this._wsClient)
    }

    constructor() {
        this._onMessage = this._onMessage.bind(this)
    }

    setMode(value) {
        this._unset()
        this._mode = value
        this._setup()
    }

    get mode() {
        return this._mode
    }

    start() {
        return new Promise((resolve) => {
            if (this.mode === MODE_WEB) {
                if (!this._runnerWindow)
                    this._createChildWindow().then(resolve)
            } else {
                if (!this._wsClient)
                    this._createWebSocketClient().then(resolve)
            }
        })
    }

    postMessage(d) {
        if (this.mode === MODE_WEB) {
            this._runnerWindow && this._runnerWindow.postMessage(d, "*")
        } else {
            this._wsClient && this._wsClient.postMessage(d)
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
        if (this._mode === MODE_NODE) {
            if (this._wsClient)
                this._wsClient.addEventListener(this._onMessage)
        } else {
            if (this._runnerWindow)
                window.addEventListener("message", this._onMessage)
        }
    }

    _createChildWindow(width = 500, height = 350) {
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
                resolve()
            })
        })
    }

    _onMessage(e) {
        this._messageCallback.call(this, e)
    }

}