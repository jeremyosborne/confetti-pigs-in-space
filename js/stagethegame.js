(function(exports) {



/**
 * @class Crosshair used to track the mouse targeting in the game.
 */
var Crosshair = function() {
    // Start outside of the canvas.
    this.x = -100;
    this.y = -100;
    
    // remember, gamejs is assbackwards with alpha.
    //this.alpha = 0;
    
    // Crosshair needs access to the Surface object.
    this.surface = new this.game.engine.Surface(20, 20);
    // surface, color, startPos, endPos, width
    this.game.engine.draw.line(this.surface, "#ffffff", [9, 0], [9, 3], 1);
    this.game.engine.draw.line(this.surface, "#ffffff", [9, 16], [9, 19], 1);
    this.game.engine.draw.line(this.surface, "#ffffff", [0, 9], [3, 9], 1);
    this.game.engine.draw.line(this.surface, "#ffffff", [16, 9], [19, 9], 1);
    
    this.isAlive = function() {
        // We're always alive.
        return true;
    };
    this.size = function() {
        return !this.surface ? null : this.surface.getSize();
    };
    this.upperLeft = function() {
        var size = this.size();
        if (size) {
            return [this.x-size[0]/2, this.y-size[1]/2];
        }
        else {
            return [this.x, this.y];
        }
    };
    /**
     * Called to update the data.
     * @param msDuration {Number} How many ms since our last update.
     * @return {Boolean} Whether we should be included in future updates
     * or garbage collected.
     */
    this.update = function(msDuration) {
        return this.isAlive();
    };
    /**
     * Called during the draw stage.
     * @param target {Surface} Where we draw ourselves onto.
     */
    this.draw = function(target) {
        if (this.surface) {
            //this.surface.setAlpha(this.alpha);
            target.blit(this.surface, this.upperLeft());
        }
    };
};
/**
 * Pointer to our Game object.
 * @type {Game}
 */
Crosshair.prototype.game = Game;


/**
 * @class An expanding, collidable particle.
 * 
 * @param x {Number} Center of explosion x pixel.
 * @param y {Number} Center of explosion y pixel.
 */
var Flak = function(x, y) {
    /**
     * Center of explosion x pixel.
     * @type {Number}
     */
    this.x = x;
    /**
     * Center of explosion y pixel.
     * @type {Number}
     */
    this.y = y;
    
    /**
     * Current radius in pixels.
     * @type {Number}
     */
    this.radius = 1;
    /**
     * Delta radius per second.
     * @type {Number}
     */
    this.dradius = 25;
    /**
     * Maximum radius in pixels.
     * @type {Number}
     */
    this.maxRadius = 25;

    // Increase shots fired (negative score).
    this.game.local.score.mod("shotsFired", -1);
};
/**
 * Pointer to our Game object.
 * @type {Game}
 */
Flak.prototype.game = Game;
/**
 * Called to update the data.
 * @param msDuration {Number} How many ms since our last update.
 * @return {Boolean} Whether we should be included in future updates
 * or garbage collected.
 */
Flak.prototype.update = function(msDuration) {
    // Time ratio.
    var dt = msDuration/1000;
    
    // Flak explosions expand and then contract.
    if (this.radius >= this.maxRadius && this.dradius > 0) {
        this.dradius = -1*this.dradius;
    }
    this.radius += this.dradius*dt;
    
    // Determine when we get removed from the list of objects.
    // We want to return true if we are _not_ dead.
    return (this.dradius == -1 ? this.radius > 0 : true);
};
/**
 * Called during the draw stage.
 * @param target {Surface} Where we draw ourselves onto.
 */
Flak.prototype.draw = function(target) {
    // Modify the color based on radius.
    var rng = this.game.engine.utils.prng;
    var red = rng.integer(0, 255);
    var green = rng.integer(0, 255);
    var blue = rng.integer(0,255);
    
    // The greater than zero has to do with a silliness in gamejs.
    if (this.radius > 0) {
        this.game.engine.draw.circle(
            target,
            "rgb("+red+","+green+","+blue+")",
            [this.x, this.y], 
            this.radius
        );
    }
};
// Collision boundaries for a flak explosion (rectangular boundaries).
// collision_rect_boundaries: function() {
    // // If our radius describes the circle, grab a collision bounding box 
    // // that fits within our circle.
    // // Bounding box returned is described from the upper left corner as
    // // [x, y, w, h].
    // var radius = this.radius;
    // var radiusSquared = radius * radius;
    // var diameter = radius*2;
    // var offset = Math.sqrt(radiusSquared + radiusSquared);
    // return [this.x-offset, this.y-offset, diameter, diameter];
// }



/**
 * A target to shoot down.
 * @param [config] {Object} Associative array of arguments.
 * @param [config.x=0] {Number} Starting x-pixel coordinate.
 * @param [config.y=0] {Number} Starting y-pixel coordinate.
 * @param [config.heading=0] {Number} Degrees heading the target
 * is going to travel in. 0 degrees is a heading of right across the playing 
 * field, 90 is up the playing field.
 * @param [config.speed=100] {Number} Speed in pixels/sec.
 * @constructs
 */
var Target = function(config) {
    config = config || {};
    
    // The center of the target.
    this.x = config.x || 0;
    this.y = config.y || 0;
    // The rate of change of the target.
    // Convert heading into proportional x and y units, multiply by speed.
    config.heading = config.heading || 0;
    config.speed = config.speed || 100;
    this.dx = Math.cos(config.heading*Math.PI/180)*config.speed;
    // Need to reverse the sign for our coordinate system (+1 is down, not up).
    this.dy = -1*Math.sin(config.heading*Math.PI/180)*config.speed;
                
    // TODO: Increment the game score when targets appear, but not here.
    // Do the scoring out of the object creation.
    //game.score.increment("targetsAppeared");

    // Target needs access to the Surface object.
    this.surface = new this.game.engine.Surface(this.width, this.height);
    // surface, color, points, width (0 means fill)
    this.game.engine.draw.polygon(this.surface, "#ffffff", [[0, 0], [20, 10], [0, 20]], 0);
};
/**
 * Pointer to our Game object.
 * @type {Game}
 */
Target.prototype.game = Game;
/**
 * How wide is the target?
 * @type {Number}
 */
Target.prototype.width = 20;
/**
 * How tall is the target?
 * @type {Number}
 */
Target.prototype.height = 20;
/**
 * Will reveal whether this target is alive or dead.
 * @return {Boolean} Returns a status of whether this particle is considered
 * alive (true) or dead (false).
 */
Target.prototype.isAlive = function() {
    // TODO: Test to see if particle is outside of its container.
    return true;
};
/**
 * Gets the size of the target. 
 * @return {Number[]} the size of the target as [width, height] pixel array.
 */
Target.prototype.size = function() {
    return !this.surface ? null : this.surface.getSize();
};
/**
 * Where is the upper left of our target?
 * @return {Number[]} What should be considered the upperleft of our target
 * as an array made up of [x, y] coordinates.
 */
Target.prototype.upperLeft = function() {
    var size = this.size();
    
    return [this.x-size[0]/2, this.y-size[1]/2];
};
/**
 * Update function.
 * @param ms {Number} The number of milliseconds elapsed since the
 * last call to this function.
 * @return {Boolean} Returns a status of whether this target is considered
 * alive (true) or dead (false).
 */
Target.prototype.update = function(ms) {
    var msRatio = ms / 1000;
    this.x += this.dx * msRatio;
    this.y += this.dy * msRatio;
    return this.isAlive();
};
/**
 * Blits our target onto whatever surface we pass in.
 * @param target {Surface} Our target surface.
 */
Target.prototype.draw = function(target) {
    target.blit(this.surface, this.upperLeft());
};
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
    var displayDims = Game.display.getSize();
    
    switch (side) {
        case 0:
            // top, heading down
            target = new Target({
                x: displayDims[0]/2+(Math.random() > 0.5 ? +1 : -1)*Math.floor(Math.random() * (displayDims[0]/4-Target.prototype.width)),
                // Just touching the edge so the target doesn't get
                // removed before it is even visible.
                y: -Target.prototype.height+1,
                heading: 270 + headingDelta,
                speed: speed
            });
            break;
        case 1:
            // right, heading left
            target = new Target({
                // Just touching the edge so the target doesn't get
                // removed before it is even visible.
                x: displayDims[0]-1,
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
                y: displayDims[1]-1,
                heading: 90 + headingDelta,
                speed: speed
            });
            break;
        case 3:
            // left, heading right
            target = new Target({
                // Just touching the edge so the target doesn't get
                // removed before it is even visible.
                x: -Target.prototype.width+1,
                y: displayDims[1]/2+(Math.random() > 0.5 ? +1 : -1)*Math.floor(Math.random() * (displayDims[1]/4-Target.prototype.height)),
                heading: 0 + headingDelta,
                speed: speed
            });
            break;
    }
    
    return target;
};



/**
 * @class Display of the points.
 */
var ScoreView = function() {};
/**
 * Shared reference to our Game object.
 * @type {Game}
 */
ScoreView.prototype.game = Game;
ScoreView.prototype.update = function() {
    return true;
};
/**
 * Called during the draw stage.
 * @param target {Surface} Where we draw ourselves onto.
 */
ScoreView.prototype.draw = function(target) {
    var local = this.game.local;
    new this.game.TextOverlay({
        alignx: "left",
        paddingx: 10,
        aligny: "top",
        paddingy: 10,
        // At time of writing, we need some non-falsey value.
        // Don't pass a simple 0 into text.
        text: "Score: " + local.score.sum(),
        font: local.defaultFont,
    }).draw(target);
};



/**
 * @class How long the game will last.
 * @param ms {Number} How many milliseconds will the countdown last?
 */
var Countdown = function(ms) {
    /**
     * The time when this countdown was started (ms since the epoch).
     * @param {Number}
     */
    this._start = null;
    /**
     * The time when this countdown will be done (ms since the epoch).
     * @param {Number}
     */
    this._end = null;
    /**
     * The total duration of the countdown in milliseconds.
     * @param {Number}
     */
    this.duration = ms;
};
/**
 * Call when you wish to begin/reset the countdown timer.
 * @return {Countdown} Our self reference.
 */
Countdown.prototype.reset = function() {
    this._start = Date.now();
    this._end = this._start + this.duration;
    
    return this;
};
/**
 * How much time is remaining relative to real time?
 * @return {Number} of milliseconds remaining. This number will normalize
 * at zero and will never return less than zero (where zero indicates the
 * time is over).
 */
Countdown.prototype.remaining = function() {
    var remaining = this._end - Date.now();
    return remaining > 0 ? remaining : 0;
};



/**
 * @class Display of the game timer.
 * @param countdown {Countdown} The countdown managing this view.
 */
var CountdownView = function(countdown) {
    /**
     * The countdown managing this view.
     * @type {Countdown}
     */
    this.countdown = countdown;
};
/**
 * Shared reference to our Game object.
 * @type {Game}
 */
CountdownView.prototype.game = Game;
/**
 * We always run, never remove.
 */
CountdownView.prototype.update = function() {
    return true;
};
/**
 * Called during the draw stage.
 * @param target {Surface} Where we draw ourselves onto.
 */
CountdownView.prototype.draw = function(target) {
    var secondsRemaining = Math.floor(this.countdown.remaining()/1000);
    new this.game.TextOverlay({
        alignx: "right",
        paddingx: 10,
        aligny: "top",
        paddingy: 10,
        // At time of writing, we need some non-falsey value.
        // Don't pass a simple 0 into text.
        text: "Time remaining: " + secondsRemaining,
        font: this.game.local.defaultFont,
    }).draw(target);
};



// Manages the game until the game is over.
exports.thegame = {
    "id": "thegame",
    "enter": function() {
        var game = this.game;
        var defaultFont = game.local("defaultFont");
        var TextOverlay = game.TextOverlay;

        // Initialize our crosshair.       
        this.crosshair = new Crosshair(game);
        this.stageObjects.push(this.crosshair);
        
        // Initialize the score of the game.
        this.scoreView = new ScoreView();
        this.stageObjects.push(this.scoreView);
        
        // The countdown timer. (not an object directly managed by the game).
        this.countdown = new Countdown(7000).reset();
        // The view is managed as a game object.
        this.countdownView = new CountdownView(this.countdown);
        this.stageObjects.push(this.countdownView);
        
        
        // DEBUG
        // Single test target.
        this.stageObjects.push(targetFactory());
    },
    "heartbeat": function(msDuration) {
        var game = this.game;
        var display = game.display;
        var event = game.engine.event;
        var MOUSE_DOWN = event.MOUSE_DOWN;
        var MOUSE_MOTION = event.MOUSE_MOTION;
        var stageObjects = this.stageObjects;
        var crosshair = this.crosshair;
        
        // First and foremost check our timer. If done, leave.
        if (!this.countdown.remaining()) {
            this.game.activateStage("end");
        }

        event.get().forEach(function(e) {
            if (e.type == MOUSE_MOTION) {
                // Special treatment for the crosshair.
                crosshair.x = e.pos[0];
                crosshair.y = e.pos[1];
            }
            else if (e.type === MOUSE_DOWN) {
                stageObjects.push(new Flak(e.pos[0], e.pos[1]));
            }
        });
        
        
        display.fill('#000000');
        stageObjects = stageObjects.filter(function(obj) {
            var isAlive = obj.update(msDuration);
            if (isAlive) {
                obj.draw(display);
            }
            return isAlive;
        });

    },
    // All of the objects managed during an update loop.
    // All objects promise to have an update function.
    stageObjects: [],
    // These more important objects created during initialization and
    // referenced here.
    crossHair: null,
    scoreView: null,
    countdown: null,
};



})(Stages);
