/* eslint-env node */
const express = require("express")
const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http)

app.use(express.static(__dirname + "/../../public"))

app.get("/", function(req, res){
    res.send("<h1>Hello PIPES</h1>")
})

const CATEG_RUNNER = "runner"
const CATEG_EDITOR = "editor"

const sockets = {
    runner: [],
    editor: []
}

const MESSAGE_I_AM = "IAm"
const MESSAGE_CLOSING = "Closing"
const MESSAGE_RUNNER_CONNECTED = "RunnerConnected"

io.on("connection", function(socket){
    console.log("a user connected which is a...   ")

    const forwardMessageFrom = {
        runner: (d) => {
            sockets.editor.forEach(dest => dest.emit("message", d))
            console.log("message forwarded to " + sockets.editor.length + " editor(s)")
        },
        editor: (d) => {
            sockets.runner.forEach(dest => dest.emit("message", d))
            console.log("message forwarded to " + sockets.runner.length + " runner(s)")
        }
    }

    const categ = Object.keys(sockets).find(categ => sockets[categ].find( s => s === socket ))
    if (categ === CATEG_RUNNER) {
        forwardMessageFrom[CATEG_RUNNER]({ name: MESSAGE_RUNNER_CONNECTED })
    }

    socket.on("disconnect", function () {
        const categ = Object.keys(sockets).find(categ => sockets[categ].find( s => s === socket ))
        const socketIndex = sockets[categ].indexOf(socket)
        sockets[categ].splice(socketIndex, 1)

        if (categ === CATEG_RUNNER && sockets[categ].length === 0) {
            forwardMessageFrom[CATEG_RUNNER]({
                name: MESSAGE_CLOSING,
                payload: {
                    platform: "node"
                }
            })
        }
    })

    socket.on("message", function (d) {
        if (d.name && d.name.indexOf(MESSAGE_I_AM) === 0) {
            const category = d.name.substr(MESSAGE_I_AM.length).toLowerCase()
            console.log(category + " !")
            sockets[category].push(socket)
        } else {
            const categ = Object.keys(sockets).find(categ => sockets[categ].find( s => s === socket ))
            if (categ && forwardMessageFrom[categ])
                forwardMessageFrom[categ](d)
        }
    })
})

http.listen(3000, function(){
    console.log("listening on *:3000")
})
