var socket = io();
var term = new Terminal({
    cols: 80,
    rows: 24,
    useStyle: true,
    screenKeys: true
});
var cur = "";
term.open(document.getElementById("terminal"));


// Receive data from socket
socket.on("result", function (msg) {
    term.write("\r" + msg);
})

term.onData(function (data) {
    cur += data;

    if (data === "\r") {
        socket.emit("command", cur);
        cur = ""
    }

    term.write(data);

});
