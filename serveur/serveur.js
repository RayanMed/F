const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const cors = require("cors")
const formatMessage = require ("./utills/messages")
const {userJoin,getCurrentUser,getRoomUsers,userLeave} = require("./utills/users")

const app = express()
app.use(cors())
const server = http.createServer(app)
const io = socketio(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]

    }
})

const botName = 'Rayan'

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)

        socket.join(user.room)

        socket.emit('message', formatMessage(botName, 'Mer7ba a sidi'))

        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(botName, `rah m3ana ${user.username} jdid`))

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id)

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} ra7 :( `))

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }

    })
})

const PORT = 5000 || process.env.PORT

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
