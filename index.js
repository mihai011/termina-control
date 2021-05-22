const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { spawn } = require('child_process');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('command', (msg) => {
        console.log('message: ' + msg);

        const com = spawn(msg, [], { shell: true });

        com.stdout.on('data', (data) => {
            socket.emit('result', data);
        });

        com.stderr.on('data', (data) => {
            socket.emit('result', data);
        });

        com.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });

    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

