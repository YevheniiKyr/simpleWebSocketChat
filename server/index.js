const express = require('express');
const app = express();
const cors = require('cors');
const {Server} = require("socket.io");
http = require('http');

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

const messages = [
    {
        id: Date.now(),
        user: 'User',
        text: 'hello my dear',
        roomId: 'clock'
    },
    {
        id: Date.now() - 1,
        user: 'User2',
        text: 'hello i am not deer',
        roomId: 'clock'
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
    console.log("CONNECTED" + socket.id)

    socket.on('create_room', ({room, password, name}) => {

        const existingRoom = rooms.find(current_room => current_room.room === room.toString())
        if (existingRoom) {
            socket.emit('room_already_exists', "Room name already taken")
            return
        }
        users.push(name)
        rooms.push({room: room, password: password, participants: 1, users: [name]})
        socket.join(room)

        socket.emit('room_id', {roomId: room})
    })

    socket.on('join_room', ({room, password, username}) => {
        const existingRoom = rooms.find(current_room => current_room.room === room.toString())
        if (!existingRoom || !(password === existingRoom.password)) {
            socket.emit('invalid_room_name_or_password', "Wrong name or password")
            return
        }
        existingRoom.users.push(username)
        existingRoom.participants += 1;
        socket.join(room)
        socket.emit('room_id', {roomId: room})
    })

    socket.on('rejoin_room', ({username, room}) => {
        const existingRoom = rooms.find(current_room => current_room.room === room.toString())
        const existingUsername = existingRoom.users.find(user => user === username)
        if (!existingRoom || !existingUsername) {
            //не був у цій кімнаті
            socket.emit('invalid_room_name_or_password', "Wrong name or password")
            return
        }

        existingRoom.participants += 1;
        socket.join(room)
        socket.emit('room_id', {roomId: room})
    })

    socket.on('get_messages', ({roomId}) => {
            const chat_messages = messages.filter(m => m.roomId === roomId)
            socket.emit('messages', chat_messages)
        }
    )

    socket.on('message', (message) => {
        console.log("add message", message)
        messages.push(message)
        console.log("id " + message.roomId)
        io.in(message.roomId).emit('receive_message', message); // Send to all users in room, including sender
    })

    socket.on('register', ({userName}) => {
        console.log("username " + userName)
        console.log(users)
        const existingUser = users.find(user => user === userName)
        if (existingUser) {
            socket.emit('username_is_taken', "Username already taken")
            return
        }
        console.log("new user emit registered")
        users.push(userName)
        socket.emit('registered');
    })

    socket.on('disconnect', () => {
        console.log('User disconnected from the chat');
    })

    socket.on('get_rooms', () => {
        socket.emit('rooms', rooms)
    })
})

server.listen(5000, () => 'Server is running on port 5000');
