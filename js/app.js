/* jshint unused:true, undef:true, browser:true */
/* global Phaser:false */



var Flak = function(x, y) {
    // Trying out cache.
    Phaser.Sprite.call(this, this.game, x, y, this.game.cache.getBitmapData("flak"));

    // Center flak over pointer.
    this.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enable(this);
    this.game.add.existing(this);
};
Flak.prototype = Object.create(Phaser.Sprite.prototype);
// Expanding outward unless this is true.
Flak.prototype.imploding = false;
// Pixels per frame.
Flak.prototype.sizeChangeVelocity = 5;
// How many pixels big before we implode.
Flak.prototype.maxSize = 60;
Flak.prototype.update = function() {
    // Increase the size of the sprite.
    if (!this.imploding) {
        this.width += this.sizeChangeVelocity;
        this.height += this.sizeChangeVelocity;
        if (this.width > this.maxSize) {
            this.imploding = true;
        }
    } else {
        this.width -= this.sizeChangeVelocity;
        this.height -= this.sizeChangeVelocity;
        if (this.width <= 0) {
            // Kill doesn't opt for gc, just rmeoves it from render and update.
            //this.kill();
            // Destroy removes the object from the game.
            this.destroy();
        }
    }
};
// Reference to sprite shared by all Flak instances. Initialized during init.
Flak.prototype.spriteImage = null;
// Reference to game instance using flak. Initialized during init.
Flak.prototype.game = null;
// Call before using flak instances.
Flak.init = function(game) {
    // width, height, key
    var spriteImage = game.add.bitmapData(14, 14);
    spriteImage.circle(7, 7, 7, "#ff0000");

    // try out cache for bit map data.
    game.cache.addBitmapData("flak", spriteImage);

    this.prototype.game = game;
};



var Pig = function(position) {
    position = position || {};
    Phaser.Sprite.call(this, this.game, position.x || 0, position.y || 0, 'pig');
    this.anchor.setTo(0.5, 0.5);
    // For collisions.
    this.game.physics.arcade.enable(this);
    this.game.add.existing(this);

    this.randomCorner();
};
Pig.prototype = Object.create(Phaser.Sprite.prototype);
Pig.prototype.randomCorner = function() {
    // Put the pig in one of the corners of the game and start again.
    this.x = Phaser.Utils.chanceRoll() ? 0 : this.game.world.width;
    this.y = Phaser.Utils.chanceRoll() ? 0 : this.game.world.height;
};
// Set during init, reference to game.
Pig.prototype.game = null;
// What are these pigs chasing?
Pig.prototype.target = null;
Pig.prototype.update = function() {
    var g = this.game;

    //if (g.physics.arcade.distanceToPointer(this, g.input.activePointer) > 5) {
    if (this.target && g.physics.arcade.distanceBetween(this, this.target) > 5) {
        // Head toward pointer.
        //this.rotation = Phaser.Math.angleBetween(this.x, this.y, g.input.activePointer.x, g.input.activePointer.y);
        // Head toward dino.
        this.rotation = Phaser.Math.angleBetween(this.x, this.y, this.target.x, this.target.y);

        // Make the object seek to the active pointer (mouse or touch).
        //g.physics.arcade.moveToPointer(this, 150);
        // Seek the dino.
        g.physics.arcade.moveToObject(this, this.target, 150);
    } else {
        this.body.velocity.set(0);
    }
};
Pig.init = function(game) {
    // WebGL doesn't like file:// protocol, need a server.
    game.load.image('pig', 'assets/sprites/pig.png');
    this.prototype.game = game;
};
// Sets the target for all the pigs.
Pig.targetForAll = function(target) {
    this.prototype.target = target;
};



var PigSplosion = function() {
    Phaser.Particles.Arcade.Emitter.call(this, this.game, 0, 0, 100);
    this.makeParticles(this.game.cache.getBitmapData("confetti"));
    this.forEach(function(p) {
        // Give each piece of confetti a random tint.
        p.tint = Phaser.Color.getRandomColor();
    });
    this.gravity = 200;
};
PigSplosion.prototype = Object.create(Phaser.Particles.Arcade.Emitter.prototype);
PigSplosion.prototype.boom = function(x, y) {
    // Position emitter to distribute particles.
    this.x = x;
    this.y = y;
    // The first parameter sets the effect to "explode" which means all particles are emitted at once
    // The second gives each particle a 2000ms lifespan
    // The third is ignored when using burst/explode mode
    // The final parameter (10) is how many particles will be emitted in this single burst
    this.start(true, 2000, null, 10);
};
// Set during init, reference to game.
PigSplosion.prototype.game = null;
// This pattern is okay, I'm sticking with it because I tried it out earlier.
PigSplosion.init = function(game) {
    var confetti = game.add.bitmapData(10, 10, "confetti", true);
    confetti.fill(255, 255, 255, 1);

    this.prototype.game = game;
};



var PurpleDino = function(x, y) {
    Phaser.Sprite.call(this, this.game, x || 0, y || 0, 'purple-dino');
    this.anchor.setTo(0.5, 0.5);
    // For collisions.
    this.game.physics.arcade.enable(this);
    this.game.add.existing(this);
};
PurpleDino.prototype = Object.create(Phaser.Sprite.prototype);
PurpleDino.prototype.game = null;
PurpleDino.prototype.update = function() {
    var g = this.game;
    this.rotation = Phaser.Math.angleBetween(this.x, this.y, g.input.activePointer.x, g.input.activePointer.y);
    if (g.physics.arcade.distanceToPointer(this, g.input.activePointer) > 8) {
        // Dino wants to follow the mouse or finger.
        g.physics.arcade.moveToPointer(this, 150);
    } else {
        this.body.velocity.set(0);
    }
};
PurpleDino.init = function(game) {
    game.load.image('purple-dino', 'assets/sprites/purple-dino.png');

    this.prototype.game = game;
};



var Countdown = function(x, y) {
    Phaser.Text.call(this, this.game, x, y, "", {
        fill: "#ffffff",
		font: "bold 16px Arial",
	});
    this.game.add.existing(this);
    this.timer = this.game.time.create();
    this.timer.add(this.timeLimit, function() {
        this.isDone = true;
    }.bind(this));
    this.timer.start();
};
Countdown.prototype = Object.create(Phaser.Text.prototype);
// Milliseconds.
Countdown.prototype.timeLimit = 15000;
Countdown.prototype.isDone = false;
// Generated once live.
Countdown.prototype.prefix = "Time Left: ";
Countdown.prototype.update = function() {
    this.text = this.prefix + Math.ceil(this.timer.duration / 1000);
};
Countdown.prototype.game = null;
Countdown.init = function(game) {
    this.prototype.game = game;
};



var ScoreKeeper = function(x, y) {
    Phaser.Text.call(this, this.game, x, y, "", {
        fill: "#ffffff",
		font: "bold 16px Arial",
	});

    this.game.add.existing(this);

    if (localStorage.highScore) {
        this.highScore = localStorage.highScore;
    }
};
ScoreKeeper.prototype = Object.create(Phaser.Text.prototype);
ScoreKeeper.prototype.game = null;
ScoreKeeper.prototype.score = 0;
ScoreKeeper.prototype.highScore = 0;
ScoreKeeper.prototype.add = function(n) {
    this.score += n;
};
ScoreKeeper.prototype.update = function() {
    this.text = "Score: " + this.score + "\nHigh Score: " + this.highScore;
};
ScoreKeeper.prototype.save = function() {
    localStorage.score = this.score;
    localStorage.highScore = this.highScore;
};
ScoreKeeper.init = function(game) {
    this.prototype.game = game;
};



// Excuse to have more than one screen.
var Title = function() {};
Title.prototype = Object.create(Phaser.State);
Title.prototype.preload = function() {
    game.load.audio("bgmusic", "assets/music/vamps_-_Borderline_(Fantastic_Vamps_8-Bit_Mix)_shortened.mp3");
};
Title.prototype.create = function() {
    this.titleText = this.game.add.text(this.game.world.centerX, this.game.world.centerY,
        "shootdown\n(pigs in space)", {
        fill: "#ffffff",
		font: "bold 42px Arial",
        align: "center",
	});
    this.titleText.anchor.set(0.5);

    this.game.input.onDown.add(function() {
        // This event listener gets purged when we transition to "play" state.
        this.game.state.start("play");
    }.bind(this));
};



// Play state.
var Play = function() {};
Play.prototype = Object.create(Phaser.State);
Play.prototype.preload = function() {
    game.load.audio("flak-explosion", "assets/sounds/laser-shot.wav");
    game.load.audio("pig-splosion", "assets/sounds/explosion.wav");

    // Groups for watching flak.
    this.flak = this.game.add.group();
    // Some things need initialization. This isn't Phaser's fault, just something
    // I'm trying out.
    Flak.init(this.game);
    Pig.init(this.game);
    PigSplosion.init(this.game);
    Countdown.init(this.game);
    ScoreKeeper.init(this.game);
    PurpleDino.init(this.game);
};
Play.prototype.create = function() {
    var g = this.game;

    // Start background music.
    g.sound.stopAll();
    g.sound.play("bgmusic", 0.25, true);

    // To make the sprite move we need to enable Arcade Physics
    g.physics.startSystem(Phaser.Physics.ARCADE);

    this.countdown = new Countdown(32, this.game.height - 32);

    this.scoreKeeper = new ScoreKeeper(32, 32);

    this.purpleDino = new PurpleDino(this.game.world.centerX, this.game.world.centerY);

    this.purpleDinoFlaktulenceTimer = this.game.time.create();
    // This seems to clear itself after the state is over.
    this.purpleDinoFlaktulenceTimer.loop(600, function() {
        // Can have multiple flak on the screen, keep track of them
        // for colliding with the pigs.
        this.flak.add(new Flak(this.purpleDino.x, this.purpleDino.y));
        // Play a sound along with the flak.
        this.game.sound.play("flak-explosion");
    }.bind(this));
    this.purpleDinoFlaktulenceTimer.start();

    this.pig = new Pig();
    Pig.targetForAll(this.purpleDino);

    this.pigSplosion = new PigSplosion();

    // g.input.onDown.add(function(pointer) {
    //     // Can have multiple flak on the screen, keep track of them
    //     // for colliding with the pigs.
    //     this.flak.add(new Flak(pointer.x, pointer.y));
    //     // Play a sound along with the flak.
    //     this.game.sound.play("flak-explosion");
    // }.bind(this));
};
Play.prototype.update = function() {
    // We don't need to exchange any velocities or motion we can the 'overlap'
    // check instead of 'collide'.
    game.physics.arcade.overlap(this.flak, this.pig, function(pig) {
        // Remove and reset the pig to another location.
        this.pigSplosion.boom(pig.x, pig.y);
        pig.randomCorner();
        this.game.sound.play("pig-splosion", true);

        // And get a point.
        this.scoreKeeper.add(1);
    }.bind(this));

    if (this.countdown.isDone) {
        // It's done, we're done.
        game.state.start("end");
        this.scoreKeeper.save();
    }
};




var End = function() {};
End.prototype = Object.create(Phaser.State);
End.prototype.create = function() {
    var text = "The End.\nClick to play again";
    if (localStorage.score > localStorage.highScore) {
        text = "You got the high score!\n" + text;
        localStorage.highScore = localStorage.score;
    }
    this.titleText = this.game.add.text(this.game.world.centerX, this.game.world.centerY,
        text, {
        fill: "#ffffff",
		font: "bold 42px Arial",
        align: "center",
	});
    this.titleText.anchor.set(0.5);

    this.game.input.onDown.add(function() {
        this.game.state.start("play", true);
    }.bind(this));
};



var game = new Phaser.Game(
    // String dimensions are considered percentages of parent container.
    "100", "100",
    // Let Phaser choose the renderer.
    Phaser.AUTO,
    // What element do we want to use as the parent.
    document.querySelector(".game-container")
);



game.state.add("title", Title);
game.state.add("play", Play);
game.state.add("end", End);
game.state.start("title");
