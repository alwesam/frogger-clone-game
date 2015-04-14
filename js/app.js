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
var Enemy = function() {
    /* initial x-position (same) */
    this.x = -200;
    /*initial y-position randomised across the three stone tiles*/
    var yPos = function() {
        var y = [65, 145, 225];
        return y[Math.floor(Math.random() * y.length)];
    };
    this.y = yPos();
    /*generate a random speed between 80 inclusive and 240 exclusive*/
    this.speed = 80 + Math.floor(Math.random() * 200);
    /* The image/sprite for our enemies, this uses
      a helper we've provided to easily load images*/
    this.sprite = 'images/enemy-bug.png';
};

/**
 * Enemy methods
 */

/* Update the enemy's position, required method for game*/
/* Parameter: dt, a time delta between ticks*/
Enemy.prototype.update = function(dt) {
    //console.log(dt);    
    this.x += this.speed * dt;
};

/*Draw the enemy on the screen, required method for game*/
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
var Player = function() {
    /*initial position*/
    this.x = 200;
    this.y = 400;
    /*direction*/
    this.moveX = 0;
    this.moveY = 0;
    /*update speed so player can move in blocks*/
    this.speedX = 100;
    this.speedY = 85;
    /*number of player lives*/
    this.numLives = 3;
    /*player image*/
    this.sprite = 'images/char-boy.png';
};

/* update player position based on movement key input
 * Player movement is limited within the game screen
 */
Player.prototype.update = function() {
    /*move palyer code*/
    var changeX = this.x + this.moveX * this.speedX;

    if ((changeX < 450 && this.moveX === 1) ||
        (changeX > -50 && this.moveX === -1)) {
        this.x += this.moveX * this.speedX;
    }

    var changeY = this.y + this.moveY * this.speedY;

    if ((changeY < 450 && this.moveY === 1) ||
        (changeY > 0 && this.moveY === -1)) {
        this.y += this.moveY * this.speedY;
    }

    /* reset after pressing, otherwise, it will keep moving*/
    this.moveX = 0;
    this.moveY = 0;
};

/* Draw player on the screen*/
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 *key input code
 **/
Player.prototype.handleInput = function(hd) {

    if (hd === 'right') {
        this.moveX = 1;
        this.moveY = 0;
    } else if (hd === 'left') {
        this.moveX = -1;
        this.moveY = 0;
    } else if (hd === 'up') {
        this.moveX = 0;
        this.moveY = -1;
    } else if (hd === 'down') {
        this.moveX = 0;
        this.moveY = 1;
    }
};

/**
 * Collision Detection function
 * collision occurs when player is within 50px x-axis and/or 50px y-axis from
 * enemy
 */
Player.prototype.checkCollisions = function() {

    var playerPosX = this.x;
    var playerPosY = this.y;
    /* save this in a variable to refer to calling the player*/
    var p = this;
    allEnemies.forEach(function(enemy) {
        var enemyPosX = enemy.x;
        var enemyPosY = enemy.y;
        if (Math.abs(enemyPosX - playerPosX) < 50 &&
            Math.abs(enemyPosY - playerPosY) < 50) {
            /*if collision happened with enemey, 
              reset player position to x=200,y=400*/
            p.x = 200;
            p.y = 400;
            /*lives reduced by one*/
            p.numLivesDown();
            /*restart game if number of player lives is zero*/
            if (p.numLives === 0) {
                alert("Game Over!");
                /*reset function*/
                reset();

            }
        }
    });
};

/* decrement number of lives whenever player
 * collides with enemy*/
Player.prototype.numLivesDown = function() {
    this.numLives--;
};

/**
 * display number of player lives in the upper left corner of screen
 */
Player.prototype.displayLives = function() {
    ctx.drawImage(Resources.get('images/char-boy.png'), 50, -20);
    var text = this.numLives + " " + "x";
    if (text !== null) {
        ctx.fillText(text, 50, 100);
        ctx.strokeText(text, 50, 100);
    }
};

Player.prototype.reset = function (){
    this.x = 200;
    this.y = 400;
    this.numLives = 3;
};

/**
 * Collectibles class and methods
 * each collectible is defined by
 * its x position and y-position
 * and image
 */
var Collectible = function(image, x, y) {
    //position
    this.x = x;
    this.y = y;
    this.sprite = image;
};

/** 
 * Collectibles are rendered after tiles
 */
Collectible.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Gem collection function
 * collection occurs when player is within 20px and 40px  (x and y directions)
 * from any of the collections
 */
Collectible.prototype.getCollections = function() {
    //here detect collection
    var playerPosX = player.x;
    var playerPosY = player.y;
    var itemPosX = this.x;
    var itemPosY = this.y;
    if (Math.abs(itemPosX - playerPosX) < 50 &&
        Math.abs(itemPosY - playerPosY) < 50) {
        /*if collection happened, take item off the list*/        
        collections.splice(collections.indexOf(this), 1);
        if (collections.length === 0) {
            alert('All collections are picked up. Great success!');           
            /*reset game*/
            reset();
        }
    }
};

/**
 * Counter class
 * inspired by this blog post http://encodo.com/en/blogs.php?entry_id=88
 */
var Counter = function(value) {
    this.seconds = value;
    /* launch counter */
    this.countDown();
};

/**
 * CountDown method includes setInterval to separate each new count by 1000ms
 * or one second
 */
Counter.prototype.countDown = function() {
    /*save 'this' in a new variable in order to be used in the following
     *anonymous function*/
    var c = this;
    setInterval(function() {
            if (c.seconds === 0) {
                alert('Time is up!');
                /*reset game*/
                reset();
            } else {
                c.seconds--;
            }
        },
        1000
    );
};

/* display time left on upper right corner of screen*/
Counter.prototype.displayCount = function() {
    var text = "Time left:" + " " + this.seconds;
    if (text !== null) {
        ctx.fillText(text, 400, 100);
        ctx.strokeText(text, 400, 100);
    }
};

Counter.prototype.reset = function (resetValue) {
    this.seconds = resetValue;
};

/*****************INSTANTIATIONS**************************/

/*instantiate enemies*/
var allEnemies = [];
/*add a new enemy every 3 seconds*/
setInterval(function() {
        allEnemies.push(new Enemy());
    },
    3000);

/*instantiate a player*/
var player = new Player();

/*instantiate collectibles*/
var collections = [];
/*create an array of collectibles*/
var fillCollectionsArray = function () {
    collections.push(new Collectible('images/Gem Orange.png', 300, 50));
    collections.push(new Collectible('images/Gem Green.png', 100, 200));
    collections.push(new Collectible('images/Gem Blue.png', 100, 50));
    collections.push(new Collectible('images/Key.png', 400, 200));
};
fillCollectionsArray();

/** 
 * instantiate and start a counter count down of 60 seconds
 */
var counter = new Counter(60);

/*************************RESET***************************/

var reset = function() {
    /*set player position to original*/
    player.reset();
    counter.reset(60);
    /*empty collections array*/
    collections = [];
    fillCollectionsArray();
};

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