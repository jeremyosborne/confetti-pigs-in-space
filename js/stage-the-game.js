/* jshint unused:true, undef:true */
/* global $g:false */

(function(exports) {



/**
 * For our purposes, call to generate a target instance randomized to one
 * of the four sides of the map.
 * @return {Target} Target correctly positioned and ready to go, but not
 * under control of any collection.
 */
var targetFactory = function() {
    // Which side will the target enter from?
    var side = Math.floor(Math.random() * 4);
    // Randomize the direction of travel.
    var headingDeltaSign = Math.random() > 0.5 ? +1 : -1;
    var headingDelta = headingDeltaSign * Math.floor(Math.random() * 20);
    // How many pixels a second?
    var speed = Math.floor(Math.random() * 100 + 50);
    // The target we're going to create and return.
    var target;
    // What are the display dimensions?
    var displayDims = $g.display.getSize();

    var Target = $g.local.Target;

    switch (side) {
        case 0:
            // top, heading down
            target = new Target({
                x: displayDims[0]/2+(Math.random() > 0.5 ? +1 : -1)*Math.floor(Math.random() * (displayDims[0]/4-Target.prototype.width)),
                // Just touching the edge so the target doesn't get
                // removed before it is even visible.
                y: -Target.prototype.height/2,
                heading: 270 + headingDelta,
                speed: speed
            });
            break;
        case 1:
            // right, heading left
            target = new Target({
                // Just touching the edge so the target doesn't get
                // removed before it is even visible.
                x: displayDims[0]+Target.prototype.width/2,
                y: displayDims[1]/2+(Math.random() > 0.5 ? +1 : -1)*Math.floor(Math.random() * (displayDims[1]/4-Target.prototype.height)),
                heading: 180 + headingDelta,
                speed: speed
            });
            break;
        case 2:
            // bottom, heading up
            target = new Target({
                x: displayDims[0]/2+(Math.random() > 0.5 ? +1 : -1)*Math.floor(Math.random() * (displayDims[0]/4-Target.prototype.width)),
                // Just touching the edge so the target doesn't get
                // removed before it is even visible.
                y: displayDims[1]-Target.prototype.height/2,
                heading: 90 + headingDelta,
                speed: speed
            });
            break;
        case 3:
            // left, heading right
            target = new Target({
                // Just touching the edge so the target doesn't get
                // removed before it is even visible.
                x: -Target.prototype.width/2,
                y: displayDims[1]/2+(Math.random() > 0.5 ? +1 : -1)*Math.floor(Math.random() * (displayDims[1]/4-Target.prototype.height)),
                heading: 0 + headingDelta,
                speed: speed
            });
            break;
    }

    return target;
};



/**
 * Generates debris for the exploded targets.
 * @param x {Number} x pixel where to generate the debris.
 * @param y {Number} y pixel where to generate the debris.
 */
var targetDebrisFactory = function(x, y) {
    var r1 = Math.random();
    var r2 = Math.random();
    var r3 = Math.random();

    var surface = new $g.gamejs.Surface(5, 5);
    surface.fill("rgb("+Math.floor(r1*256)+","+Math.floor(r2*256)+","+Math.floor(r3*256)+")");

    return new $g.Particle({
        x: x,
        y: y,
        dx: (10 + r1 * 40) * (r2 > 0.5 ? -1 : 1),
        dy: (10 + r2 * 40) * (r1 > 0.5 ? -1 : 1),
        // Only gravity change.
        ddy: 100,
        alpha: r3,
        maxAge: 2000 + r3*2000,
        surface: surface
    });
};



// Manages the game until the game is over.
exports.stageTheGame = {
    id: "thegame",
    enter: function() {
        // Initialize our crosshair.
        this.crosshair = new $g.local.Crosshair();
        this.stageObjects.push(this.crosshair);

        // In case this is the nth time playing, reset the scores.
        $g.local.score.fromJSON({});
        // Initialize the score of the game.
        this.scoreKeeperView = new $g.local.ScoreKeeperView();
        this.stageObjects.push(this.scoreKeeperView);

        // The countdown timer. (not an object directly managed by the game).
        this.countdown = new $g.local.Countdown(this.gameDuration).reset();
        // The view is managed as a game object.
        this.countdownView = new $g.local.CountdownView(this.countdown);
        this.stageObjects.push(this.countdownView);
    },
    heartbeat: function(msDuration) {
        var stage = this;
        var game = this.game;
        var display = game.display;
        var event = game.gamejs.event;
        var MOUSE_DOWN = event.MOUSE_DOWN;
        var MOUSE_MOTION = event.MOUSE_MOTION;
        var stageObjects = this.stageObjects;
        // Manage some objects separately.
        var flakObjects = this.flakObjects;
        var particles = this.particles;
        var crosshair = this.crosshair;
        var collisions = game.collisions;

        // Endgame conditions.
        if (!this.countdown.remaining()) {
            this.game.stageActivate("end");
            // Do not run the rest of the function, duh.
            return;
        }

        // Check to make new targets.
        // The randomness might affect some game scores, but given this
        // will get called between 40 and 60 times a second, the chances
        // will be low that the screen is not filled with targets.
        // At 50% chance, allowing for non-optimal framerate:
        // 50 calls / sec * .3 targets/calls = 15 targets/sec
        if (this.numTargets < this.maxTargets && Math.random() > 0.7) {
            this.numTargets += 1;
            this.stageObjects.push(targetFactory());
        }

        // Handle events.
        event.get().forEach(function(e) {
            if (e.type == MOUSE_MOTION) {
                // Crosshair follows the mouse.
                crosshair.x = e.pos[0];
                crosshair.y = e.pos[1];
            }
            else if (e.type === MOUSE_DOWN) {
                // Mouse down triggers a flak launch and lowers score.
                flakObjects.push(new $g.local.Flak(e.pos[0], e.pos[1]));
                game.local.score.mod("shotsFired", -1);
                // Flak has a regular sound.
                $g.local.flaksound.play();
            }
        });

        // Update and draw.
        display.fill('#000000');
        this.stageObjects = stageObjects.filter(function(obj) {
            var isAlive = obj.update(msDuration);

            // One definition of alive is whether it can be drawn or not.
            if (isAlive) {
                obj.draw(display);
            }

            // Additional tests for targets, as they need additional help.
            if (obj instanceof $g.local.Target) {

                // In bounds or out of bounds? If out, the target will mark
                // itself as "outofbounds" and it will be removed next frame.
                collisions.notRects([obj], [game]);

                // Test targets against flak objects.
                // This will queue up an explosion next frame if they hit.
                collisions.rects([obj], flakObjects);

                if (!isAlive) {
                    // More targets can now appear.
                    stage.numTargets -= 1;
                    if (obj.state == "outofbounds") {
                        // Decrease score for missing a target.
                        game.local.score.mod("targetsEscaped", -1);
                    }
                    else if (obj.state == "exploding") {
                        // Increase score.
                        game.local.score.mod("targetsDestroyed", 3);
                        // And launch another, free explosion.
                        flakObjects.push(new $g.local.Flak(obj.x, obj.y));
                        // Explosions sound different and varied.
                        $g.local.explosions.playRandom();
                        // With accompanying confeti.
                        particles.push(targetDebrisFactory(obj.x, obj.y));
                        particles.push(targetDebrisFactory(obj.x, obj.y));
                        particles.push(targetDebrisFactory(obj.x, obj.y));
                        particles.push(targetDebrisFactory(obj.x, obj.y));
                        particles.push(targetDebrisFactory(obj.x, obj.y));
                        particles.push(targetDebrisFactory(obj.x, obj.y));
                    }
                }
            }
            return isAlive;
        });

        this.particles = particles.filter(function(obj) {
            var isAlive = obj.update(msDuration);
            if (isAlive) {
                obj.draw(display);
            }
            return isAlive;
        });

        // Need to update flakObjects separately so we have access to the
        // objects separately to test for collisions.
        this.flakObjects = flakObjects = flakObjects.filter(function(obj) {
            var isAlive = obj.update(msDuration);
            // One definition of alive is whether it can be drawn or not.
            if (isAlive) {
                obj.draw(display);
            }
            return isAlive;
        });

    },
    // Clean up so we can come back to a clean game.
    exit: function(config) {
        this.stageObjects = [];
        this.flakObjects = [];
        this.particles = [];
        this.crosshair = null;
        this.scoreKeeperView = null;
        this.countdown = null;
        this.numTargets = 0;

        config.done();
    },
    // All of the objects managed during an update loop.
    // All objects promise to have an update function.
    stageObjects: [],
    flakObjects: [],
    particles: [],
    // These more important objects created during initialization and
    // referenced here.
    crosshair: null,
    scoreKeeperView: null,
    countdown: null,
    // Total number of targets on screen now, and the max allowed.
    numTargets: 0,
    // These should be constant.
    maxTargets: 15,
    gameDuration: 60000,
};



})($g.local);
