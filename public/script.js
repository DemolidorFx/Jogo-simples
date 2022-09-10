const socket = io.connect();
const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
var fired = false;
var space = false;
var powered = 0
var controller = false;
var definied = true;
var bulletCollisionX = -1
var bulletCollisionY = -1
var currentUserId = null
const game = {
    players: { }
}
const fire = {
    bullet: { }
}
var bulletDirection = 'up'

socket.on('connect', ()=>{
    currentUserId = socket.id
    addPlayer(currentUserId)
})
socket.on('currentState', already)

function already(currentState, userId){
    currentUserId = socket.id
    for(let alreadyPlayers in currentState){
        player = alreadyPlayers
        addPlayer(player)
        game.players[player] = currentState[alreadyPlayers]

    }
}

socket.on('log', addPlayer)

function addPlayer(userId){
    game.players[userId] = {
        x: 0,
        y: 0
    } 
}

function power(){
    if(fired && space){
        powered = powered +1
        if(bulletDirection == 'up'){
            fire.bullet[currentUserId] = {
                x: bulletPosX,
                y: bulletPosY + 1,
                height: powered * -1,
                width: 1
            }
        }
        if(bulletDirection == 'down'){
            fire.bullet[currentUserId] = {
                x: bulletPosX,
                y: bulletPosY,
                height: powered,
                width: 1
            }
        }
        if(bulletDirection == 'left'){
            fire.bullet[currentUserId] = {
                x: bulletPosX + 1,
                y: bulletPosY,
                height: 1,
                width: powered * -1
            }
        }
        if(bulletDirection == 'right'){
            fire.bullet[currentUserId] = {
                x: bulletPosX,
                y: bulletPosY,
                height: 1,
                width: powered
            }
        }
    }
}setInterval(power, 40);

function addBullet(userId){
    const playerPos = game.players[userId]

    bulletPosX = playerPos.x
    bulletPosY = playerPos.y
    powered = 0

    if(bulletDirection === 'up'){
        bulletPosY = bulletPosY - 1
    }
    if(bulletDirection === 'down'){
        bulletPosY = bulletPosY + 1
    }
    if(bulletDirection === 'right'){
        bulletPosX = bulletPosX + 1
    }
    if(bulletDirection === 'left'){
        bulletPosX = bulletPosX - 1
    }
        fire.bullet[userId] = {
            x: bulletPosX,
            y: bulletPosY,
        }
        
}

document.addEventListener('keydown', move);

document.onkeyup = function(event){
    collision()
    fired = false;        
    space = false;
    controller = true
}

socket.on('updatePlayerPos', update)

function update(currentPos, userId){
    game.players[userId] = currentPos
}
socket.on('disconnected', deleter)

function deleter(userId){
    delete game.players[userId];
}
function deleteBullet(){
    if(space == false && controller == true){   
        delete fire.bullet[currentUserId];
        powered = 1
    }

}

function collision(){

    for(const bullet in fire.bullet){
        const bulletPos /* position */ = fire.bullet[bullet] // real id;
    }
    for(const player in game.players){
        const playerPos /* position */ = game.players[player] // real id
        if(playerPos.x == bulletCollisionX || playerPos.y == bulletCollisionY){
            console.log(player)
            if(bulletDirection == 'right'){
                game.players[player].x = game.players[currentUserId].x + 1 // direita pra esquerda
            }
            if(bulletDirection == 'left'){
                game.players[player].x = game.players[currentUserId].x - 1 // esquerda pra direita
            }
            if(bulletDirection == 'up'){
                game.players[player].y = game.players[currentUserId].y - 1 // direita pra esquerda
            }
            if(bulletDirection == 'down'){
                game.players[player].y = game.players[currentUserId].y + 1 // esquerda pra direita
            }
            console.log('colidiu')
            console.log(player)
            var grabbed = game.players[player]
            socket.emit('grabbedPlayer', player, grabbed)
            console.log(grabbed)
        }
    
    }
}

function move(event){
        const posX = game.players[currentUserId].x
        const posY = game.players[currentUserId].y
            if(event.key === 'w' && game.players[currentUserId].y > 0){
                game.players[currentUserId].y = posY - 1
            }
            else if(event.key === 'a' && game.players[currentUserId].x > 0){
                game.players[currentUserId].x = posX - 1
            }
            else if(event.key === 's' && game.players[currentUserId].y < 24){
                game.players[currentUserId].y = posY + 1
            }
            else if(event.key === 'd' && game.players[currentUserId].x < 24){
                game.players[currentUserId].x = posX + 1
            }

            currentPos = game.players[currentUserId]

            socket.emit('currentPos', currentPos)
                definied = true 
    if(!fired){
        fired = true;
        if(event.code === 'Space'){
            addBullet(currentUserId)
            space = true
        }
    }
    if(event.key == 'ArrowUp' && space == false){
        bulletDirection = 'up'
    }
    if(event.key == 'ArrowDown' && space == false){
        bulletDirection = 'down'
    }
    if(event.key == 'ArrowRight' && space == false){
        bulletDirection = 'right'
    }
    if(event.key == 'ArrowLeft' && space == false){
        bulletDirection = 'left'
    }
}
function bulletPos(playerId){
    const bulletPos /* position */ = fire.bullet[playerId] // real id;

        if(bulletDirection == 'right'){
            bulletCollisionX = bulletPos.x + bulletPos.width -1 
        }
        if(bulletDirection == 'left'){
            bulletCollisionX = bulletPos.x + bulletPos.width 
        }
        if(bulletDirection == 'up'){
            bulletCollisionY = bulletPos.y + bulletPos.height
        }
        if(bulletDirection == 'down'){
            bulletCollisionY = bulletPos.y + bulletPos.height -1
        }
}

renderScreen()

function renderScreen(){
    if(space == true){
        bulletPos(currentUserId)
    }else{
        bulletCollisionX = -1
        bulletCollisionY = -1
    }
    setTimeout(deleteBullet, 400)
    context.fillStyle = 'white'
    context.fillRect(0, 0, width, height)
    for (const playerBullet in fire.bullet){
        const shoot = fire.bullet[playerBullet]
        context.fillStyle = 'red'
        context.fillRect(shoot.x, shoot.y, shoot.width, shoot.height)      
    }
    for(const playerId in game.players){
        const player = game.players[playerId]
        if(playerId == currentUserId){
            context.fillStyle = '#F0941F'
        }else{
            context.fillStyle = 'rgb(0 0 0 / 50%)'
        }
        context.fillRect(player.x, player.y, 1, 1)
    }
    requestAnimationFrame(renderScreen)
}

