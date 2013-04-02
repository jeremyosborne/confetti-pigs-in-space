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
// Use a rectangular collision for the explosion.
// get_collision_aabb: function() {
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
    },
    "heartbeat": function(msDuration) {
        var game = this.game;
        var display = game.display;
        var event = game.engine.event;
        var MOUSE_DOWN = event.MOUSE_DOWN;
        var MOUSE_MOTION = event.MOUSE_MOTION;
        var stageObjects = this.stageObjects;
        var crosshair = this.crosshair;

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
    // Special treatment for the crosshairs. Created during initialization.
    crossHair: null,
    // Special treatment for the scores.
    scoreView: null,
};



})(Stages);
