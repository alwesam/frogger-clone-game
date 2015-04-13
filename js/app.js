/**
* Wesam Al-Haddad
* 2015
* code linted by jshint
*/

/*****************CLASSES************************/

/**
 * Enemy class
 * parameters of the class include:
 * x-position: constant at -200
 * y-position randomly select y position along the three stone tiles
 * speed: generate a random speed for enemy
 * sprite: image
 */
var Enemy = function () {
    //initial x-position (same)  
    this.x = -200;
    //initial y-position randomised across the three stone tiles
    var yPos = function () {
        var y = [65, 145, 225];
        //var y = [100,175,250];
        return y[Math.floor(Math.random()*y.length)];
    };
    this.y = yPos();
    //generate a random speed between 80 inclusive and 240 exclusive
    this.speed = 80+Math.floor(Math.random()*200);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

/**
 * Enemy Methods
 */

/* Update the enemy's position, required method for game*/
/* Parameter: dt, a time delta between ticks*/
Enemy.prototype.update = function (dt) {
    //console.log(dt);    
    this.x += this.speed*dt;
};

/*Draw the enemy on the screen, required method for game*/
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* get x-position of the enemy */
Enemy.prototype.getXPosition = function () {
    return this.x;
};

/* get y-position of the enemy*/
Enemy.prototype.getYPosition = function () {
    return this.y;
};

/**
 * Player class and methods
 * parameters include:
 * x-position
 * y-position
 * moveX to be set when pressing left or right key
 * moveY to be set when pressing up or down key
 * speed
 * sprite or image
*/
var Player = function () {
    //initial position
    this.x = 200;
    this.y = 400;
    //direction
    this.moveX=0;
    this.moveY = 0;  
    //update speed so player can move in blocks
    this.speedX = 100;
    this.speedY = 85;
    //player image
    this.sprite = 'images/char-boy.png';
};

/* update player position based on movement key input
 * Player movement is limited within the game screen
 */
Player.prototype.update = function () {
    //move palyer code
    var changeX = player.getXPosition()+this.moveX*this.speedX;
    
    if((changeX<450 && this.moveX==1) ||
        (changeX>-50 && this.moveX==-1)) 
        this.x += this.moveX*this.speedX;

    var changeY = player.getYPosition()+this.moveY*this.speedY;

    if((changeY<450 && this.moveY==1) ||
        (changeY>0 && this.moveY==-1)) 
        this.y += this.moveY*this.speedY;

    //reset after pressing, otherwise, it will keep moving
    this.moveX = 0; this.moveY = 0;
};

/* get x-position of the player*/
Player.prototype.getXPosition = function () {
    return this.x;
};
/* get y-position of the player*/
Player.prototype.getYPosition = function () {
    return this.y;
};

/* set position of the player*/
Player.prototype.setPosition = function (x,y) {
    this.x = x;
    this.y = y;
};

/* Draw player on the screen*/
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
*key input code
**/
Player.prototype.handleInput = function (hd) {
    
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
};

/**
 * Collision Detection function
 * collision occurs when player is within 50px x-axis and/or 50px y-axis from 
 * enemy
 */
Player.prototype.checkCollisions = function () {  

        var playerPosX = this.getXPosition();
        var playerPosY = this.getYPosition();
        allEnemies.forEach(function (enemy) {
            var enemyPosX = enemy.getXPosition();
            var enemyPosY = enemy.getYPosition();
            if (Math.abs(enemyPosX-playerPosX)<50 &&
                 Math.abs(enemyPosY-playerPosY)<50){
                //if collision happened with enemey, 
                //reset player position tp x=200,y=400
                player.setPosition(200,400);
                //lives
                life.numDown();

                if(life.getNum()===0){
                    alert("Game Over!");
                    //reload page and start over
                    window.location.reload();
                }

            }
        });
};

/**
 * Collectibles class and methods
 */
var Collectible = function (image,x,y) {
    //position
    this.x = x;
    this.y = y;
    this.sprite = image;
};

/** 
 * Collectibles are rendered after tiles
 */
Collectible.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);    
};

Collectible.prototype.getXPosition = function () {
    return this.x;
};

Collectible.prototype.getYPosition = function () {
    return this.y;
};

/**
 * Gem collection function
 * collection occurs when player is within 20px and 40px  (x and y directions) 
 * from any of the gems
 */
Collectible.prototype.getCollections = function () {
    //here detect collection
    var playerPosX = player.getXPosition();
    var playerPosY = player.getYPosition();
    var gemPosX = this.getXPosition();
    var gemPosY = this.getYPosition();
    if (Math.abs(gemPosX-playerPosX)<50 &&
        Math.abs(gemPosY-playerPosY)<50){
        //if collection happened, take gem
        //off the list
        gems.splice(gems.indexOf(this),1); 
        if(gems.length===0) {
            alert('All gems are collected. Great success!');
            //javascript for reloading page
            window.location.reload();
        }              
    }
};

/**
 * Counter class
 */
var Counter = function (value) {
    this.counter = value;
};

/* Countdown method */
Counter.prototype.countDown = function () {
    this.counter--;
};

/* getcount method */
Counter.prototype.getCount = function () {
    return this.counter;
};

/******
*CountDown method includes setInterval
*to separate each new count by 1000 ms or
*one second
*****/
Counter.prototype.timer = function () {
    //setInterval(function () {
        counter.countDown();
        //when counter = 0, game over
        if (counter.getCount() === 0){
            alert('Time is up!');
            window.location.reload();
        }
    //}, 1000);    
};

Counter.prototype.displayCount = function () {
      var text = "Time left:"+" "+this.getCount();
      if (text !== null){
        ctx.fillText(text, 400, 100);
        ctx.strokeText(text, 400, 100);
      }
};

/** Lives class**/
var Lives = function (value) {
    this.num = value;
};

/**Lives methods**/
/*decrement number of lives whenever player
 *collides with enemy*/
Lives.prototype.numDown = function () {
    this.num--;
};

/**
 * get number lives
 */
Lives.prototype.getNum = function () {
    return this.num;
};

/**
 * display lives 
 */
Lives.prototype.displayLives = function () {

    ctx.drawImage(Resources.get('images/char-boy.png'), 50, -20);
    var text = this.getNum()+" "+"x";
    if (text !== null){
      ctx.fillText(text, 50, 100);
      ctx.strokeText(text, 50, 100);
    }
    
};

/*****************INSTANTIATION**************************/

/*instantiate enemies*/
var allEnemies = [];
/*add a new enemy every 3 seconds*/
setInterval(function () {allEnemies.push(new Enemy());},
            3000 );

/*instantiate a player*/
var player = new Player();

/*create an array of collectibles*/
var gems = [];
/*instantiate collectibles*/
gems.push( new Collectible('images/Gem Orange.png',300,50) );
gems.push( new Collectible('images/Gem Green.png',100,200) );
gems.push( new Collectible('images/Gem Blue.png',100,50) );
gems.push( new Collectible('images/Key.png',400,200) );

/*instantiate a counter variable and initialize it. 
 *Here we initilize to 60*/
var counter = new Counter(60);
//TODO review
setInterval(counter.timer, 1000);

/*player hs 3 lives*/
var life = new Lives(3);

/*******************FUNCTIONS********************************/

/** 
 * This listens for key presses and sends the keys to your
 * player.handleInput() method. You don't need to modify this.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});