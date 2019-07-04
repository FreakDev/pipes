/* eslint-env node */

const app = require("express")()
const http = require("http").createServer(app)
const io = require("socket.io")(http)

app.get("/", function(req, res){
    res.send("<h1>Hello PIPES</h1>")
})

const sockets = {
    runner: [],
    editor: []
}

const MESSAGE_I_AM = "IAm"

io.on("connection", function(socket){
    console.log("a user connected")

    socket.on("message", function (d) {
        if (d.name && d.name.indexOf(MESSAGE_I_AM) === 0) {
            const category = d.name.substr(MESSAGE_I_AM.length).toLowerCase()
            sockets[category].push(socket)
        } else {
            const categ = Object.keys(sockets).find(categ => sockets[categ].find( s => s === socket ))

            const forwardMessageFrom = {
                runner: () => {
                    sockets.editor.forEach(dest => dest.emit(d))
                    console.log("message forwarded to editors")
                },
                editor: () => {
                    sockets.runner.forEach(dest => dest.emit(d))
                    console.log("message forwarded to runners")
                }
            }
            
            forwardMessageFrom[categ](d)
        }
    })
})

http.listen(3000, function(){
    console.log("listening on *:3000")
})
