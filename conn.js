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

var h = new Array();
var index_h = 0;
term.onKey(e => {
    cur += e.key;
    
    console.log(h, index_h, h.length);
    console.log(index_h);
    // special commands
    switch (e.key){
      case "\u0003": // ctrl-c
        socket.emit("command", "\u0003");
        break;
    };
    
    switch (e.domEvent.keyCode) {
      case 13: // Enter
          cur = cur.replace(/(\r\n|\n|\r)/gm, "\r")
          if (cur != "\r")
            term.write("\n");
          socket.emit("command", cur);
          h.push(cur);
          index_h += 1;
          cur = "";
          break;
      case 8: // backspace
        // Do not delete the prompt
        if (term._core.buffer.x > 47) {
          term.write('\b \b');
        }
        break;
      case 38: // up arrow
        if (index_h > 0) {
          index_h -= 1;
          cur = h[index_h];
        }
        break;
      case 40: // down arrow
      if (index_h < h.length-1){
        index_h += 1;
        cur = h[index_h]
        
      }
      break;
      default: // Print all other characters for demo
        term.write(e.key);
    }
  });
