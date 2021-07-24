
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
var barrier = term._core.buffer.x;
var h = new Array();
var index_h = 0;

// Receive data from socket
socket.on("result", function (msg) {
    term.write("\r" + msg);
})


term.onKey(e => {
    
    if (cur === "")
      barrier = term._core.buffer.x;
    cur += e.key;
    // special commands
    switch (e.key){
      case "\u0003": // ctrl-c
        socket.emit("command", "\u0003");
        cur = "";
        break;
    };
    
    switch (e.domEvent.keyCode) {
      case 13: // Enter
        if (cur === "\r" || cur === "" ){
          cur = "";
          socket.emit("command", "\r");
          break;
        }
        term.write("\n");
        socket.emit("command", cur);
        cur = cur.slice(0, -1);
        h.push(cur);
        index_h = h.length-1;
        cur = "";
        barrier = term._core.buffer.x;
        console.log(h, index_h);
        break;
      case 8: // backspace
        // Do not delete the prompt
        if (term._core.buffer.x > barrier) {
          term.write('\b \b');
          cur = cur.slice(0, -2);
          console.log(cur);
        }
        break;
      case 38: // up arrow
        cur = cur.slice(0, -1);
        if (index_h > 0) {
          console.log(cur);
          for(var i=0; i<cur.length; i++)
            term.write('\b \b');
          index_h -= 1;
          cur = h[index_h];
          term._core.buffer.x = barrier+1;
          // term.write(cur);
        }
        break;
      case 40: // down arrow
        cur = cur.slice(0, -1);
        if (index_h < h.length-1){
          console.log(cur);
          for(var i=0; i<cur.length; i++)
            term.write('\b \b');
          index_h += 1;
          cur = h[index_h];
          term._core.buffer.x = barrier+1;
          // term.write(cur);
        }
        break;
      case 9: // tab
        cur = cur.slice(0, -1);
        term.write("  ");
        cur += "  ";
        break;
      default: // Print all other characters for demo
        term.write(e.key);
    }
  });
