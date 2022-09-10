const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const server = app.listen(port);
app.use(express.static('public'));
console.log("conectado")
const socket = require('socket.io');
const io = socket(server);
const gameServer = {
    players: { }
}
function addPlayer(playerId){
    gameServer.players[playerId] = {
        x:0,
        y:0
    }
}
io.sockets.on('connection', (socket)=>{
    console.log('nova conexão');
    
    const userId = socket.id
    
    addPlayer(userId)

    const currentState = gameServer.players
  
    io.emit('currentState', currentState, userId)

    socket.broadcast.emit('log', userId)

    socket.on('currentPos', updatePlayerPos)

    socket.on('grabbedPlayer', (grabPlayer))


    function grabPlayer(player, grabbed){
        gameServer.players[player].x = grabbed.x
        gameServer.players[player].y = grabbed.y
        currentPos = gameServer.players[player]
        const userId = player
        socket.broadcast.emit('updatePlayerPos', currentPos, userId)
    }
    function updatePlayerPos(currentPos){
        gameServer.players[userId] = currentPos
        socket.broadcast.emit('updatePlayerPos', currentPos, userId)
    }
    socket.on("disconnect", () => {
        const userId = socket.id
        deletePlayer(userId)    
    });

    function deletePlayer(userId){
        delete gameServer.players[userId]
        socket.broadcast.emit('disconnected', userId)

    }

});

