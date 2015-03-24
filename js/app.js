// Enemies our player must avoid
var Enemy = function() {
    //initial x-position (same)  
    this.x = -200;
    //initial y-position randomised across the three stone tiles
    //70, 145, 225
    //this.y = 225;
    var yPos = function(){
        var y = [65,145,225];
        //var y = [100,175,250];
        return y[Math.floor(Math.random()*y.length)];
    }
    this.y = yPos();
    //generate a random speed between 40 inclusive and 200 exclusive
    this.speed = 40+Math.floor(Math.random()*160);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    //console.log(dt);    
    this.x += this.speed*dt;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//get position of the enemy
Enemy.prototype.getXPosition = function() {
    return this.x;
}

Enemy.prototype.getYPosition = function() {
    return this.y;
}

/**
*Player class
**/
var Player = function() {
    //initial position
    this.x = 200;
    this.y = 400;

    this.moveX=0;
    this.moveY = 0;    
    this.moveSpeed = 50;

    this.sprite = 'images/char-boy.png';
}

//TODO clean up
Player.prototype.update = function() {
    //move palyer code
    var changeX = player.getXPosition()+this.moveX*this.moveSpeed;
    console.log(changeX);
    if((changeX<500 && this.moveX==1) ||
        (changeX>-50 && this.moveX==-1)) 
        this.x += this.moveX*this.moveSpeed;

    var changeY = player.getYPosition()+this.moveY*this.moveSpeed;
    if((changeY<500 && this.moveY==1) ||
        (changeY>0 && this.moveY==-1)) 
        this.y += this.moveY*this.moveSpeed;

    //stop after pressing, otherwise, it will move indefintely
    this.moveX = 0; this.moveY = 0;
}

//get position of the player
Player.prototype.getXPosition = function() {
    return this.x;
}

Player.prototype.getYPosition = function() {
    return this.y;
}

Player.prototype.setPosition = function (x,y) {
    this.x = x;
    this.y = y;
}

//check later
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(hd) {
    
    if(hd=='right'){
        this.moveX = 1;
        this.moveY = 0;
    } else if (hd == 'left') {
        this.moveX = -1;
        this.moveY = 0;
    } else if (hd == 'up'){
        this.moveX = 0;
        this.moveY = -1;
    } else if (hd == 'down') {
        this.moveX = 0;
        this.moveY = 1;
    }
}

//add a new enemy every 3 seconds
var allEnemies = [];
setInterval(function(){allEnemies.push(new Enemy());},3000);

//TODO improve collision detection
var checkCollisions = function() {  

        var playerPosX = player.getXPosition();
        var playerPosY = player.getYPosition();
        //console.log("Player: "+playerPosX+" "+playerPosY);
        allEnemies.forEach(function(enemy) {
            var enemyPosX = enemy.getXPosition();
            var enemyPosY = enemy.getYPosition();
            //console.log(enemyPosX+" "+enemyPosY);
            if (Math.abs(enemyPosX-playerPosX)<20 &&
                 Math.abs(enemyPosY-playerPosY)<40){
                player.setPosition(200,400);
                return;
            }
        });
}

//TODO make sure player doesn't exceed

//instantiate a player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
