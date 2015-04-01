/***
**Wesam Al-Haddad
**2015
***/

/**
*Enemy class
*parameters of the class include:
*x-position: constant at -200
*y-position randomly select y position along the 
*           three stone tiles
*speed
*sprite or image
**/
var Enemy = function() {
    //initial x-position (same)  
    this.x = -200;
    //initial y-position randomised across the three stone tiles
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

//get x-position of the enemy
Enemy.prototype.getXPosition = function() {
    return this.x;
}
//get y-position of the enemy
Enemy.prototype.getYPosition = function() {
    return this.y;
}

///////////////////
//Player class and methods
///////////////////
var Player = function() {
    //initial position
    this.x = 200;
    this.y = 400;
    //direction
    this.moveX=0;
    this.moveY = 0;
    //speed    
    this.speed = 50;
    //player image
    this.sprite = 'images/char-boy.png';
}

Player.prototype.update = function() {
    //move palyer code
    var changeX = player.getXPosition()+this.moveX*this.speed;
    
    if((changeX<500 && this.moveX==1) ||
        (changeX>-50 && this.moveX==-1)) 
        this.x += this.moveX*this.speed;

    var changeY = player.getYPosition()+this.moveY*this.speed;
    if((changeY<500 && this.moveY==1) ||
        (changeY>0 && this.moveY==-1)) 
        this.y += this.moveY*this.speed;

    //reset after pressing, otherwise, it will keep moving
    this.moveX = 0; this.moveY = 0;
}

//get x-position of the player
Player.prototype.getXPosition = function() {
    return this.x;
}
//get y-position of the player
Player.prototype.getYPosition = function() {
    return this.y;
}

//set position of the player
Player.prototype.setPosition = function (x,y) {
    this.x = x;
    this.y = y;
}

// Draw player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/**
*key input code
**/
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

/**
**collectibles class and methods
**/
var Collectible = function(image,x,y) {
    //position
    this.x = x;
    this.y = y;
    this.sprite = image;
}

Collectible.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Collectible.prototype.getXPosition = function () {
    return this.x;
}

Collectible.prototype.getYPosition = function() {
    return this.y;
}

//Counter class
var Counter = function(value) {
    this.counter = value;
}

Counter.prototype.countDown = function () {
    this.counter--;
}

Counter.prototype.getCount = function () {
    return this.counter;
}

///////////////////////
//Instantiate entities including enemies, player, gems
//and counter
////////////////////////

/**
*Instantiates entities
**/
var allEnemies = [];
//add a new enemy every 3 seconds
setInterval(function(){allEnemies.push(new Enemy());},3000);

//instantiate a player
var player = new Player();

//create an array of collectibles
var gems = [];
//instantiate collectibles
gems.push( new Collectible('images/Gem Orange.png',200,200) );
gems.push( new Collectible('images/Gem Green.png',100,200) );
gems.push( new Collectible('images/Gem Blue.png',100,100) );
gems.push( new Collectible('images/Key.png',400,200) );

//declare a counter variable and initialize it to x seconds
var counter = new Counter(60);

////////////////////////
//Functions
////////////////////////

/**
*Collision Detection function
*collision occurs when player is within
*20px and 40px  (x and y directions) from
*enemy
**/
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
               // return;
            }
        });
}

/**
*Gem collection function
*collection occurs when player is within
*20px and 40px  (x and y directions) from
*any of the gems
**/
var getCollections = function() {
    //here detect collection
        var playerPosX = player.getXPosition();
        var playerPosY = player.getYPosition();
        gems.forEach(function(gem) {
            var gemPosX = gem.getXPosition();
            var gemPosY = gem.getYPosition();
            if (Math.abs(gemPosX-playerPosX)<20 &&
                 Math.abs(gemPosY-playerPosY)<40){
                gems.splice(gems.indexOf(gem),1);
                checkEnd();
            }
        });
}

//check if there are not gems left
var checkEnd = function() {
    if(gems.length==0) {
       alert('All gems are collected. Great success!');
       //javascript for reloading page
       window.location.reload();
    }
}

/**
*CountDown function includes setInterval
*to separate each new count by 1000 ms or
*one second
**/
var countDown = function () {
    setInterval(function () {
        counter.countDown();
        if (counter.getCount()==0){
            alert('Time is up!');
            window.location.reload();
        }
    }, 1000);    
}  

//start counter
countDown();

var displayCount = function () {
      ctx.font = "20pt Impact";
      ctx.textAlign="center";      
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.linewidth = 2;
      var text = "Time left:"+" "+counter.getCount();
      if (text != null){
        ctx.fillText(text, 400, 100);
        ctx.strokeText(text, 400, 100);
      }
}

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
