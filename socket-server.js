const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();

app.set('port', (process.env.PORT || 8000));

const server = http.createServer(app);
const io = socketIo.listen(server);

io.on('connection', function (socket) {
  console.log(`user connected on ${socket.id}`)
  socket.on('SEND_MESSAGE', function (data) {
    console.log('sent message')
    io.emit('RECEIVE_MESSAGE', data);
    console.log(data);
  })
  socket.on('disconnect', function () {
    console.log('user disconnected')
  })
})

server.listen(app.get('port'), () => {
  console.log('listening on ', app.get('port'));
});

// var express = require('express');
// var app = express();
// var server = require('http').createServer(app);
// var io = require('socket.io').listen(server);
// users = [];
// connections = [];

// server.listen(process.env.PORT || 8000);

// app.get('/', function)



