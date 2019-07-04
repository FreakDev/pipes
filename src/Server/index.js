/* eslint-env node */
const express = require("express")
const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http)

app.use(express.static(__dirname + "/../../public"))

app.get("/", function(req, res){
    res.send("<h1>Hello PIPES</h1>")
})

const sockets = {
    runner: [],
    editor: []
}

const MESSAGE_I_AM = "IAm"

io.on("connection", function(socket){
    console.log("a user connected which is a...   ")

    socket.on("message", function (d) {
        if (d.name && d.name.indexOf(MESSAGE_I_AM) === 0) {
            const category = d.name.substr(MESSAGE_I_AM.length).toLowerCase()
            console.log(category + " !")
            sockets[category].push(socket)
        } else {
            const categ = Object.keys(sockets).find(categ => sockets[categ].find( s => s === socket ))

            const forwardMessageFrom = {
                runner: () => {
                    sockets.editor.forEach(dest => dest.emit("message", d))
                    console.log("message forwarded to " + sockets.editor.length + " editor(s)")
                },
                editor: () => {
                    sockets.runner.forEach(dest => dest.emit("message", d))
                    console.log("message forwarded to " + sockets.runner.length + " runner(s)")
                }
            }
            
            forwardMessageFrom[categ](d)
        }
    })
})

http.listen(3000, function(){
    console.log("listening on *:3000")
})
