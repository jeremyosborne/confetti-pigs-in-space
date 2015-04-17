/* jshint unused:true, undef:true */
/* global $g:false */



(function(exports) {



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
};
/**
 * Pointer to our $g object.
 * @type {$g}
 */
Flak.prototype.game = $g;
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
    var rng = this.game.gamejs.utils.prng;
    var red = rng.integer(0, 255);
    var green = rng.integer(0, 255);
    var blue = rng.integer(0,255);

    // The greater than zero has to do with a silliness in gamejs.
    if (this.radius > 0) {
        this.game.gamejs.draw.circle(
            target,
            "rgb("+red+","+green+","+blue+")",
            [this.x, this.y],
            this.radius
        );
    }
};
/**
 * Allows for rectangular collision tests.
 * @return {Number[]} Rectangular collision area as an array conforming to
 * [left, top, width, height].
 */
Flak.prototype.collisionRectBoundaries = function() {
    // If our radius describes the circle, grab a collision bounding box
    // that fits within our circle.
    // Bounding box returned is described from the upper left corner as
    // [x, y, w, h].
    var radius = this.radius;
    var radiusSquared = radius * radius;
    var diameter = radius*2;
    var offset = Math.sqrt(radiusSquared + radiusSquared);
    return [this.x-offset, this.y-offset, diameter, diameter];
};



exports.Flak = Flak;



})($g.local.entities);
