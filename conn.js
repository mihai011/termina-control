var socket = io();
var term = new Terminal({
    cols: 80,
    rows: 24,
    useStyle: true,
    screenKeys: true
});

// import { WebLinksAddon } from 'xterm-addon-web-links';

// term.loadAddon(new WebLinksAddon());
term.open(document.getElementById("terminal"));
var cur = "";

// Receive data from socket
socket.on("result", function (msg) {
    term.write("\r" + msg);
})


var history = [];
var index_h = 0;
term.onData(e => {
    cur += e;
    switch (e) {
      case '\r': // Enter
        socket.emit("command", cur);
        cur = "";
      case '\u0003': // Ctrl+C
        // prompt(term);
        socket.emit("command", '\u0003');
        cur = "";
        term.write(e+"\n");
        break;
      case '\u007F': // Backspace (DEL)
        // Do not delete the prompt
        if (term._core.buffer.x > 2) {
          term.write('\b \b');
        }
        break;
      default: // Print all other characters for demo
        term.write(e);
    }
  });
