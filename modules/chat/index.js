const http = require('http');

const ioServer = http.createServer(function(req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('okay');
});

const io = require('socket.io').listen(ioServer, {});


io.sockets.on('connection', function(client) {
  console.log('SOCKET.IO connection established');

  client.on('message', function(message) {
    console.log('Receive message from SOCKET.IO Client', message)
    client.broadcast.emit('message', message);
  })
});

    

module.exports = ioServer;