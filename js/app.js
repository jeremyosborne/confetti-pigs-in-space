/* jshint unused:true, undef:true, browser:true */
/* global Phaser:false */

// Look for TODO items in the code.
// General TODO items
// * Create levels, max ten pigs, increasing number of pigs 1 per level.
// * Have the level number appear and disappear at the start of each level.



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



var Flaktulence = function(x, y) {
    // Trying out cache.
    Phaser.Sprite.call(this, this.game, x || 0, y || 0, this.game.cache.getBitmapData("flak"));

    // Center flak over pointer.
    this.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enable(this);
    this.game.add.existing(this);
    // Start off dead, expect to be added to a group.
    this.kill();
};
Flaktulence.prototype = Object.create(Phaser.Sprite.prototype);
// What's our max lifespan?
Flaktulence.prototype.maxLifespan = 2000;
Flaktulence.prototype.halflife = Flaktulence.prototype.maxLifespan / 2;
Flaktulence.prototype.lifespan = Flaktulence.prototype.maxLifespan;
// How many pixels big before we implode.
Flaktulence.prototype.maxSize = 60;
Flaktulence.prototype.launch = function(x, y) {
    this.lifespan = this.maxLifespan;
    this.reset(x, y);
};
Flaktulence.prototype.update = function() {
    // TODO: Make the collision box at most the radius of the circle.
    // TODO: Try tweens instead of the math below.

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
};
// Reference to game instance using Flaktulence. Initialized during init.
Flaktulence.prototype.game = null;
// Call before using flak instances.
Flaktulence.init = function(game) {
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
    this.body.setSize(this.width - 8, this.height - 8);
    this.game.add.existing(this);

    // Managed by the group, starts off dead.
    this.kill();
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

    if (this.target && g.physics.arcade.distanceBetween(this, this.target) > 5) {
        // Head toward dino.
        this.rotation = Phaser.Math.angleBetween(this.x, this.y, this.target.x, this.target.y);

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



var PurpleDino = function(x, y) {
    this.startX = x || 0;
    this.startY = y || 0;

    Phaser.Sprite.call(this, this.game, this.startX, this.startY, "purple-dino");
    this.anchor.setTo(0.5, 0.5);
    // For collisions.
    this.game.physics.arcade.enable(this);
    // Shrink the body size.
    this.body.setSize(this.width - 6, this.height - 6);
    this.game.add.existing(this);
};
PurpleDino.prototype = Object.create(Phaser.Sprite.prototype);
PurpleDino.prototype.game = null;
PurpleDino.prototype.toStartLocation = function() {
    this.x = this.startX;
    this.y = this.startY;
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



// Keeps score, tracks lives, and handles what level we're on.
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
// Default number of lives.
ScoreKeeper.prototype.lives = 3;
ScoreKeeper.prototype.score = 0;
// Default high score.
ScoreKeeper.prototype.highScore = 0;
// What increment in score is needed to progress through the levels.
ScoreKeeper.prototype.scorePerLevel = 4;
ScoreKeeper.prototype.currentLevel = function() {
    return Math.floor(this.score / this.scorePerLevel) + 1;
};
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
// Reference to game set during init.
ScoreKeeper.prototype.game = null;
ScoreKeeper.init = function(game) {
    this.prototype.game = game;
};



// Excuse to have more than one screen.
var Title = function() {};
Title.prototype = Object.create(Phaser.State);
Title.prototype.preload = function() {
    // Treating this as the asset loading screen.
    this.game.load.audio("bgmusic", "assets/music/vamps_-_Borderline_(Fantastic_Vamps_8-Bit_Mix)_shortened.mp3");
    this.game.load.audio("explosion-flaktulence", "assets/sounds/flaktulence.wav");
    this.game.load.audio("explosion-pig", "assets/sounds/explosion.wav");
    this.game.load.audio("explosion-dino", "assets/sounds/explosion2.wav");
    this.game.load.image("bg-space", "assets/images/starfield.png");
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
    Flaktulence.init(this.game);
    Pig.init(this.game);
    ConfettiEmitter.init(this.game);
    //Countdown.init(this.game);
    ScoreKeeper.init(this.game);
    PurpleDino.init(this.game);
};
// Handle the exploding purple dino.
// There's only one purple dino.
// Causes a transition to the end state if we've run out of lives.
Play.prototype.explodePurpleDino = function(purpleDino) {
    this.purpleDinoSplosion.boom(purpleDino.x, purpleDino.y);
    this.game.sound.play("explosion-dino", true);
    purpleDino.toStartLocation();

    this.scoreKeeper.decreaseLives();
    if (this.scoreKeeper.lives <= 0) {
        this.scoreKeeper.save();
        game.state.start("end");
    }
};
Play.prototype.explodePig = function(pig) {
    // Bring in the replacement pig.
    var nextPig = this.pigs.getFirstExists(false);
    nextPig.revive(0, 0);
    nextPig.randomCorner();

    // Remove the dead pig.
    this.pigSplosion.boom(pig.x, pig.y);
    this.game.sound.play("explosion-pig", true);
    pig.kill();

    // And get a point.
    this.scoreKeeper.add(1);
};
Play.prototype.create = function() {
    var g = this.game;

    // The background isn't meant to be tiled, but good enough for this.
    g.add.tileSprite(0, 0, g.width, g.height, 'bg-space');

    this.scoreKeeper = new ScoreKeeper(32, 32);

    // Start background music.
    g.sound.stopAll();
    g.sound.play("bgmusic", 0.25, true);

    // To make the sprite move we need to enable Arcade Physics
    g.physics.startSystem(Phaser.Physics.ARCADE);

    //this.levelText = this.game.add.text(this.game.world.centerX, this.game.world.centerY,
    this.levelText = this.game.add.text(this.game.world.centerX, -50,
        "Level " + this.scoreKeeper.currentLevel(), {
        fill: "#ffffff",
		font: "bold 36px Arial",
        align: "center",
	});
    this.levelText.anchor.set(0.5);
    // propertiesToTween, durationInMs, easing, autostart, delay, repeat, yoyo
    // game.add.tween(this.levelText).to({
    //     width: 0,
    //     height: 0,
    //     rotation: 2 * Math.PI,
    // }, 1000, Phaser.Easing.Linear.None, true);
    // This seems the proper way to chain tweens together (don't pass autostart
    // when chaining).
    game.add.tween(this.levelText)
        .to({
            y: this.game.world.centerY
        }, 1000, Phaser.Easing.Linear.None)
        .to({
            width: 0,
            height: 0,
            rotation: 2 * Math.PI,
        }, 2000, Phaser.Easing.Linear.None)
        .start();

    // Groups for watching flak.
    // Ordering of adding affects the z-level. When this was in preload, the
    // tilesprite was hiding the flak.
    this.flaktulence = this.game.add.group();
    // This enforces a maximum on flatulence on the screen.
    for (var i = 0; i < 10; i++) {
        this.flaktulence.add(new Flaktulence());
    }

    this.purpleDino = new PurpleDino(this.game.world.centerX, this.game.world.centerY);

    this.purpleDinoSplosion = new ConfettiEmitter();
    this.purpleDinoSplosion.colorize(0x942fcd);

    this.purpleDinoFlaktulenceTimer = this.game.time.create();
    this.purpleDinoFlaktulenceTimer.loop(750, function() {
        var direction = Phaser.Point.normalize(this.purpleDino.body.velocity);
        // One of them is not zero === we're moving.
        if (direction.x || direction.y) {
            // Can have multiple flak on the screen, keep track of them
            // for colliding with the pigs.
            var flaktulence = this.flaktulence.getFirstExists(false);
            // Usability fix: Place flak far enough away from the dinosaur
            // so that the flax isn't placed in front of the dinosaur while
            // the dinosaur is spinning in place.
            flaktulence.launch(this.purpleDino.x - (direction.x * 40), this.purpleDino.y - (direction.y * 40));
            this.game.sound.play("explosion-flaktulence");
        }
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

    this.pigSplosion = new ConfettiEmitter();
    // Random colors by default.
    this.pigSplosion.colorize();
};
Play.prototype.update = function() {
    // Flaktulence blows up pigs.
    game.physics.arcade.overlap(this.pigs, this.flaktulence, this.explodePig.bind(this));

    // Flaktulence blows up dino.
    game.physics.arcade.overlap(this.purpleDino, this.flaktulence, this.explodePurpleDino.bind(this));

    // Pigs blow up dino.
    game.physics.arcade.overlap(this.purpleDino, this.pigs, function(purpleDino, pig) {
        this.explodePig(pig);

        this.explodePurpleDino(purpleDino);
    }.bind(this));

};
Play.prototype.render = function() {
    // Info about input params are positioning offset.
	//this.game.debug.inputInfo(32, 32);
    //this.game.debug.pointer();
    //-----
    // Info about sprites.
    //this.game.debug.bodyInfo(this.purpleDino, 32, this.game.world.height - 100);
    // this.game.debug.body(this.purpleDino);
    // var p = this.pigs.getFirstExists();
    // if (p) {
    //     this.game.debug.body(p);
    // }
    // var f = this.flaktulence.getFirstExists();
    // if (f) {
    //     this.game.debug.body(f);
    // }
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
