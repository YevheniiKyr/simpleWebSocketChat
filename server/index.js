const express = require('express');
const app = express();
const { Server } = require("socket.io");
const {withSocketErrorHandler} = require("./errorHandler");
http = require('http');

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

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
];

const rooms = [];
const users = [];

io.on('connection', (socket) => {

    socket.on('create_room', withSocketErrorHandler((data) => {
        const { roomName, password, creatorName } = data;
        const existingRoom = rooms.find(room => room.name === roomName.toString());
        if (existingRoom) {
            socket.emit('room_already_exists', `Room name ${roomName} is already taken`);
            return;
        }
        users.push(creatorName);
        rooms.push({ name: roomName, password, participants: 1, users: [creatorName]});
        console.log('New room ', { name: roomName, password, participants: 1, users: [creatorName]})
        socket.join(roomName);
        console.log(`${creatorName} joined room ${roomName}`);
        socket.data.roomName = roomName;
        socket.data.username = creatorName;
        socket.emit('room_created', { roomId: roomName });
        socket.emit('rooms', rooms);
    }));

    socket.on('join_room', withSocketErrorHandler((data) => {
        const { roomName, password, username } = data;
        console.log("joinRoom ", roomName, username, roomName);
        const existingRoom = rooms.find(room => room.name === roomName.toString());
        console.log(existingRoom,  password)
        if (!existingRoom || existingRoom.password !== password) {
            console.log("invalid_room_name_or_password")
            socket.emit('invalid_room_name_or_password', "Wrong name or password");
            return;
        }
        existingRoom.users.push(username);
        existingRoom.participants += 1;
        socket.join(roomName);
        socket.data.roomName = roomName;
        socket.data.username = username;
        socket.emit('room_joined', { roomId: roomName });
    }));

    // socket.on('rejoin_room', withSocketErrorHandler((data) => {
    //     const { username, roomName } = data;
    //     const existingRoom = rooms.find(room => room.name === roomName.toString());
    //     const existingUsername = existingRoom?.users?.includes(username);
    //     if (!existingRoom || !existingUsername) {
    //         socket.emit('invalid_room_name_or_password', "Wrong name or password");
    //         return;
    //     }
    //     existingRoom.participants += 1;
    //     socket.join(roomName);
    //     socket.data.roomName = roomName;
    //     socket.data.username = username;
    //     socket.emit('room_id', { roomId: roomName });
    // }));

    socket.on('get_messages', withSocketErrorHandler((data) => {
        const { roomId } = data;
        const room = rooms.find(room => room.name === roomId.toString());
        if (!room) {
            socket.emit('no_room_exists');
            return;
        }
        const chat_messages = messages.filter(m => m.roomId === roomId);
        socket.emit('messages', chat_messages);
    }));

    socket.on('message', withSocketErrorHandler((message) => {
        messages.push(message);
        io.in(message.roomId).emit('receive_message', message);
    }));

    socket.on('register', withSocketErrorHandler((data) => {
        const { userName } = data;
        const existingUser = users.includes(userName);
        if (existingUser) {
            socket.emit('username_is_taken', "Username already taken");
            return;
        }
        users.push(userName);
        socket.emit('registered');
    }));

    socket.on('disconnect', () => {
        const room = socket.data.roomName;
        const username = socket.data.username;

        console.log(`User ${username} disconnected from room: ${room}`);

        const existingRoom = rooms.find(r => r.name === room);
        if (existingRoom) {
            existingRoom.participants -= 1;
            existingRoom.users = existingRoom.users.filter(u => u !== username);
        }
    });

    socket.on('get_rooms', withSocketErrorHandler(() => {
        socket.emit('rooms', rooms);
    }));

    socket.on('check_if_user_is_in_chat', withSocketErrorHandler(({roomId, username}) => {
        const room = rooms.find(room => room.name === roomId.toString());
        if(!room) {
            socket.emit('no_room_exists');
            console.log(`no room ${roomId} exists`)
            return
        }
        const user = room.users.find(user => user === username.toString());
        if(!user) {
            console.log(`user ${username} is not in room ${roomId}`);
            console.log('room', room)
            console.log('users', room.users)
            socket.emit('user_is_not_in_room', roomId);
        }
    }));

});

server.listen(5000, () => console.log('Server is running on port 5000'));