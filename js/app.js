/* jshint unused:true, undef:true, browser:true */
/* global Phaser:false */



var Flak = function(x, y) {
    // Trying out cache.
    Phaser.Sprite.call(this, this.game, x || 0, y || 0, this.game.cache.getBitmapData("flak"));

    // Center flak over pointer.
    this.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enable(this);
    this.game.add.existing(this);
    // Start off dead, expect to be added to a group.
    this.kill();
};
Flak.prototype = Object.create(Phaser.Sprite.prototype);
// What's our max lifespan?
Flak.prototype.maxLifespan = 2000;
Flak.prototype.halflife = Flak.prototype.maxLifespan / 2;
Flak.prototype.lifespan = Flak.prototype.maxLifespan;
// How many pixels big before we implode.
Flak.prototype.maxSize = 60;
Flak.prototype.launch = function(x, y) {
    this.lifespan = this.maxLifespan;
    this.reset(x, y);
};
Flak.prototype.update = function() {

    // TODO: Start here and fix this using the lifespan.

    // Increase the size of the sprite.
    var sizeRatio;
    // Whether we are imploding or exploding.
    if (this.lifespan > this.halflife) {
        // Exploding.
        sizeRatio = 1 - ((this.lifespan - this.halflife) / this.halflife);
    } else {
        // Imploding.
        sizeRatio = this.lifespan / this.halflife;
    }
    this.width = sizeRatio * this.maxSize;
    this.height = sizeRatio * this.maxSize;

    // Now handled by lifespan.
    // if (this.width < 0) {
    //     // Kill doesn't opt for gc, just rmeoves it from render and update.
    //     this.kill();
    //     // Destroy removes the object from the game.
    //     //this.destroy();
    // }
};
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
    // Make collisions a bit more forgiving.
    this.body.setSize(this.width - 8, this.height - 8, 1, 1);
    this.game.add.existing(this);

    //this.randomCorner();

    // Managed by the group, starts off dead.
    this.kill();
};
Pig.prototype = Object.create(Phaser.Sprite.prototype);
Pig.prototype.randomCorner = function() {
    // Put the pig in one of the corners of the game and start again.
    this.x = Phaser.Utils.chanceRoll() ? 0 : this.game.world.width;
    this.y = Phaser.Utils.chanceRoll() ? 0 : this.game.world.height;
    // Don't think this is needed.
    //this.body.reset(this.x, this.y);
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
        g.physics.arcade.moveToObject(this, this.target, 125);
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



var ConfettiEmitter = function() {
    Phaser.Particles.Arcade.Emitter.call(this, this.game, 0, 0, 100);
    this.makeParticles(this.game.cache.getBitmapData("confetti"));
    this.gravity = 200;
};
ConfettiEmitter.prototype = Object.create(Phaser.Particles.Arcade.Emitter.prototype);
ConfettiEmitter.prototype.boom = function(x, y) {
    // Position emitter to distribute particles.
    this.x = x;
    this.y = y;
    // The first parameter sets the effect to "explode" which means all particles are emitted at once
    // The second gives each particle a 2000ms lifespan
    // The third is ignored when using burst/explode mode
    // The final parameter (10) is how many particles will be emitted in this single burst
    this.start(true, 2000, null, 10);
};
// Provide a set color or a random color.
ConfettiEmitter.prototype.colorize = function(color) {
    this.forEach(function(p) {
        // Give each piece of confetti a random tint.
        p.tint = color || Phaser.Color.getRandomColor();
    });
};
// Set during init, reference to game.
ConfettiEmitter.prototype.game = null;
// This pattern is okay, I'm sticking with it because I tried it out earlier.
ConfettiEmitter.init = function(game) {
    var confetti = game.add.bitmapData(10, 10, "confetti", true);
    confetti.fill(255, 255, 255, 1);

    this.prototype.game = game;
};



var PurpleDino = function(x, y) {
    this.startX = x || 0;
    this.startY = y || 0;

    Phaser.Sprite.call(this, this.game, this.startX, this.startY, "purple-dino");
    this.anchor.setTo(0.5, 0.5);
    // For collisions.
    this.game.physics.arcade.enable(this);
    // Shrink the body size.
    this.body.setSize(this.width - 6, this.height - 6, 1, 1);
    this.game.add.existing(this);
};
PurpleDino.prototype = Object.create(Phaser.Sprite.prototype);
PurpleDino.prototype.game = null;
PurpleDino.prototype.toStartLocation = function() {
    this.x = this.startX;
    this.y = this.startY;
    // Don't think this is needed.
    //this.body.reset(this.x, this.y);
};
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



// var Countdown = function(x, y) {
//     Phaser.Text.call(this, this.game, x, y, "", {
//         fill: "#ffffff",
// 		font: "bold 16px Arial",
// 	});
//     this.game.add.existing(this);
//     this.timer = this.game.time.create();
//     this.timer.add(this.timeLimit, function() {
//         this.isDone = true;
//     }.bind(this));
//     this.timer.start();
// };
// Countdown.prototype = Object.create(Phaser.Text.prototype);
// // Milliseconds.
// Countdown.prototype.timeLimit = 15000;
// Countdown.prototype.isDone = false;
// // Generated once live.
// Countdown.prototype.prefix = "Time Left: ";
// Countdown.prototype.update = function() {
//     this.text = this.prefix + Math.ceil(this.timer.duration / 1000);
// };
// Countdown.prototype.game = null;
// Countdown.init = function(game) {
//     this.prototype.game = game;
// };



// Also tracks lives.
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
ScoreKeeper.prototype.lives = 3;
ScoreKeeper.prototype.score = 0;
ScoreKeeper.prototype.highScore = 0;
ScoreKeeper.prototype.add = function(n) {
    this.score += n;
};
ScoreKeeper.prototype.decreaseLives = function() {
    this.lives -= 1;
};
ScoreKeeper.prototype.save = function() {
    localStorage.score = this.score;
    localStorage.highScore = Math.max(this.score, this.highScore);
};
// Checks localstorage, useful across states.
ScoreKeeper.savedScoreIsHigh = function() {
    return localStorage.score >= localStorage.highScore;
};
ScoreKeeper.prototype.update = function() {
    this.text = "Lives: " + this.lives + "\nScore: " + this.score + "\nHigh Score: " + this.highScore;
};
ScoreKeeper.init = function(game) {
    this.prototype.game = game;
};



// Excuse to have more than one screen.
var Title = function() {};
Title.prototype = Object.create(Phaser.State);
Title.prototype.preload = function() {
    // Treating this as the asset loading screen.
    this.game.load.audio("bgmusic", "assets/music/vamps_-_Borderline_(Fantastic_Vamps_8-Bit_Mix)_shortened.mp3");
    this.game.load.audio("flak-explosion", "assets/sounds/laser-shot.wav");
    this.game.load.audio("pig-splosion", "assets/sounds/explosion.wav");
    this.game.load.image('bg-space', 'assets/images/starfield.png');
};
Title.prototype.create = function() {
    // The background isn't meant to be tiled, but good enough for this.
    this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'bg-space');

    this.titleText = this.game.add.text(this.game.world.centerX, this.game.world.centerY,
        "shootdown\n(the pigs in space)", {
        fill: "#ffffff",
		font: "bold 42px Arial",
        align: "center",
	});
    this.titleText.anchor.set(0.5);

    // Every game needs an (inane) story.
    // Scroll from right to left.
    this.marqueeText = this.game.add.text(this.game.world.width + 20, this.game.world.height - 48,
        [
            "What a night.",
            "Trapped in the mascot costume.",
            "Too much junk food.",
            "Jettisoned out the airlock into space.",
            "Confetti filled pigs in pursuit.",
            "Today your flatulence might save your life.",
            "Don't get caught in your own gas.",
            "Yes this is the plot.",
        ].join(" "), {
        fill: "#ffffff",
		font: "bold 28px Arial",
	});

    this.game.input.onDown.add(function() {
        // This event listener gets purged when we transition to "play" state.
        this.game.state.start("play");
    }.bind(this));
};
Title.prototype.update = function() {
    this.marqueeText.x -= 3;
};



// Play state.
var Play = function() {};
Play.prototype = Object.create(Phaser.State);
Play.prototype.preload = function() {
    // Some things need initialization. This isn't Phaser's fault, just something
    // I'm trying out.
    Flak.init(this.game);
    Pig.init(this.game);
    ConfettiEmitter.init(this.game);
    //Countdown.init(this.game);
    ScoreKeeper.init(this.game);
    PurpleDino.init(this.game);
};
Play.prototype.create = function() {
    var g = this.game;

    // The background isn't meant to be tiled, but good enough for this.
    g.add.tileSprite(0, 0, g.width, g.height, 'bg-space');

    // Start background music.
    g.sound.stopAll();
    g.sound.play("bgmusic", 0.25, true);

    // To make the sprite move we need to enable Arcade Physics
    g.physics.startSystem(Phaser.Physics.ARCADE);

    //this.countdown = new Countdown(32, this.game.height - 32);

    // Groups for watching flak.
    // Ordering of adding affects the z-level. When this was in preload, the
    // tilesprite was hiding the flak.
    this.flak = this.game.add.group();
    // This enforces a maximum on flatulence on the screen.
    for (var i = 0; i < 10; i++) {
        this.flak.add(new Flak());
    }

    this.purpleDino = new PurpleDino(this.game.world.centerX, this.game.world.centerY);

    this.purpleDinoSplosion = new ConfettiEmitter();
    this.purpleDinoSplosion.colorize(0x942fcd);

    this.purpleDinoFlaktulenceTimer = this.game.time.create();
    // This seems to clear itself after the state is over.
    this.purpleDinoFlaktulenceTimer.loop(750, function() {
        // Can have multiple flak on the screen, keep track of them
        // for colliding with the pigs.
        //this.flak.add(new Flak(this.purpleDino.x, this.purpleDino.y));
        var flak = this.flak.getFirstExists(false);
        flak.launch(this.purpleDino.x, this.purpleDino.y);
        // Play a sound along with the flak.
        this.game.sound.play("flak-explosion");
    }.bind(this));
    this.purpleDinoFlaktulenceTimer.start();

    Pig.targetForAll(this.purpleDino);
    this.pigs = this.game.add.group();
    for (i = 0; i < 10; i++) {
        this.pigs.add(new Pig());
    }
    var nextPig = this.pigs.getFirstExists(false);
    nextPig.revive(0, 0);
    nextPig.randomCorner();
    //this.pig = new Pig();

    this.pigSplosion = new ConfettiEmitter();
    // Random colors by default.
    this.pigSplosion.colorize();

    this.scoreKeeper = new ScoreKeeper(32, 32);
};
Play.prototype.update = function() {
    // We don't need to exchange any velocities or motion we can the 'overlap'
    // check instead of 'collide'.
    game.physics.arcade.overlap(this.pigs, this.flak, function(pig) {
        // Bring in the replacement pig.
        var nextPig = this.pigs.getFirstExists(false);
        nextPig.revive(0, 0);
        nextPig.randomCorner();

        // Remove the dead pig.
        this.pigSplosion.boom(pig.x, pig.y);
        pig.kill();
        this.game.sound.play("pig-splosion", true);

        // And get a point.
        this.scoreKeeper.add(1);
    }.bind(this));

    //this.purpleDinoSplosion.boom(pig.x, pig.y);
    game.physics.arcade.overlap(this.purpleDino, this.pigs, function(purpleDino, pig) {
        // Allow for greater overlap to compensate for simple collision checking.
        // Was trying overlapX and overlapY for awhile, but it seems inconsistent.
        // I'd sometimes get an overlap, but then othertimes just get 0. Looking into
        // the code, I think a better thing to do is to modify the size of the physics
        // body to decrease the collision area (and require pigs and dinos to have more
        // overlap.)
        // if (Math.abs(purpleDino.body.overlapX) > 5 || Math.abs(purpleDino.body.overlapY) > 5) {
        //     // Remove and reset all to other locations.
        //     this.pigSplosion.boom(pig.x, pig.y);
        //     this.purpleDinoSplosion.boom(purpleDino.x, purpleDino.y);
        //     pig.randomCorner();
        //     purpleDino.toStartLocation();
        //
        //     // TODO: Different sound for dinosaur.
        //     this.game.sound.play("pig-splosion", true);
        //     this.scoreKeeper.decreaseLives();
        //     if (this.scoreKeeper.lives <= 0) {
        //         this.scoreKeeper.save();
        //         game.state.start("end");
        //     }
        // }

        // Remove and reset all to other locations.
        this.pigSplosion.boom(pig.x, pig.y);
        this.purpleDinoSplosion.boom(purpleDino.x, purpleDino.y);
        pig.randomCorner();
        purpleDino.toStartLocation();

        // TODO: Different sound for dinosaur.
        this.game.sound.play("pig-splosion", true);
        this.scoreKeeper.decreaseLives();
        if (this.scoreKeeper.lives <= 0) {
            this.scoreKeeper.save();
            game.state.start("end");
        }
    }.bind(this));


    // if (this.countdown.isDone) {
    //     // It's done, we're done.
    //     game.state.start("end");
    //     this.scoreKeeper.save();
    // }
};
Play.prototype.render = function() {
    // Info about input params are positioning offset.
	//this.game.debug.inputInfo(32, 32);
    //this.game.debug.pointer();
    // Info about sprites.
    // this.game.debug.bodyInfo(this.purpleDino, 32, this.game.world.height - 100);
    //this.game.debug.body(this.purpleDino);
    //this.game.debug.body(this.pigs.getFirstExists());
    // Other debug helpers.
    //-----
    // Num entities registered in the game.
    //console.log(game.world.children.length);
};



var End = function() {};
End.prototype = Object.create(Phaser.State);
End.prototype.create = function() {
    // The background isn't meant to be tiled, but good enough for this.
    this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'bg-space');

    var text = "The End.\nClick to play again";
    if (ScoreKeeper.savedScoreIsHigh()) {
        text = "You got the high score!\n" + text;
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
