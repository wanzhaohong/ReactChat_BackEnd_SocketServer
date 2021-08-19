const express = require('express');
const http = require('http');
const cors = require('cors');

const { addUser, removeUser, getUser, checkUserRoom } = require('./users');

const PORT = process.env.PORT || 5000;

const router = require('./router');

//make the socket.io server working.
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, { cors: { origin: "http://localhost:3000", credentials: true } });

// const io = require('socket.io')(8900, { 
//     cors: { 
//         origin: "http://localhost:3000",
//     },
// });

app.use(cors());
app.use(router);


//set up socket.io conenction
io.on('connect', (socket) => {

    socket.on('join', ({ name, room }, callback) => {

        const { error, user } = addUser({ id: socket.id, name, room });

        if (error) return callback(error);

        socket.join(user.room);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

        io.to(user.room).emit('roomData', { room: user.room, users: checkUserRoom(user.room) });

        callback();
    });


    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);


        io.to(user.room).emit('message', { user: user.name, text: message });

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: checkUserRoom(user.room) });
        }
    })
});




server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


