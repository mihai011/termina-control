const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { spawn } = require('child_process');
const pty = require('node-pty');

app.use(express.static('public'))
app.use(express.static('node_modules'))


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

    term = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
        name: 'xterm-256color',
        cols: 80,
        rows: 24,
        encoding: 'utf8'
    });

    term.on('data', function(data) {

		socket.emit('result', data);

	});

    socket.on('command', (msg) => {

        console.log('message: ' + msg);
        term.write(data);

    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

