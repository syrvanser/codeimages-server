const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 1337;

server.listen(port, () => {
    console.log('Listening on 1337');
});

io.on('connection', (socket) => {
    console.log('new connection');
});