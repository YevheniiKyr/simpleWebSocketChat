const express = require('express');
const app = express();
const cors = require('cors');
const {Server} = require("socket.io");
http = require('http');

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
})

const messages = [
    {
        id: Date.now(),
        user: 'User',
        text: 'hello my dear',
        roomId: 'cock'
    },
    {
        id: Date.now() - 1,
        user: 'User2',
        text: 'hello i am not deer',
        roomId: 'cock'
    },
    {
        id: Date.now() - 2,
        user: '3',
        text: 'hello i am not deer',
        roomId: 'banana'
    }
]

const rooms = []
const users = []

io.on('connection', (socket) => {
    console.log(socket.id)

    socket.on('create_room', ({room, password, name}) => {

        const existingUser = users.find(user => user === name)
        if (existingUser) {
            socket.emit('name_is_taken', "Room name already taken")
            return
        }
        const existingRoom = rooms.find(current_room => current_room.room === room.toString())
        if (existingRoom) {
            socket.emit('room_already_exists', "Room name already taken")
            return
        }
        users.push(name)
        rooms.push({room: room, password: password})
        socket.join(room)

        socket.emit('room_id', {roomId: room})
    })

    socket.on('join_room', ({room, password, name}) => {

        const existingUser = users.find(user => user === name)

        if (existingUser) {
            socket.emit('username_is_taken', "Username already taken")
            return
        }
        users.push(name)
        const existingRoom = rooms.find(current_room => current_room.room === room.toString())

        if (!existingRoom || !(password === existingRoom.password)) {
            socket.emit('invalid_name_or_password', "Wrong name or password")
            return
        }
        socket.join(room)
        socket.emit('room_id', {roomId: room})
    })

    socket.on('get_messages', ({roomId}) => {
            const chat_messages = messages.filter(m => m.roomId === roomId)
            socket.emit('messages', chat_messages)
        }
    )

    socket.on('message', (message) => {
        messages.push(message)
        io.in(message.roomId).emit('receive_message', message); // Send to all users in room, including sender
    })

    socket.on('disconnect', () => {
        console.log('User disconnected from the chat');
    })
})

server.listen(5000, () => 'Server is running on port 5000');
