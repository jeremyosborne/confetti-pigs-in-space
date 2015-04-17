/* jshint unused:true, undef:true */
/* global $g:false */



(function(exports) {



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

    // For tracking a minimum age of a target, allows us to start outside
    // of the boundary area.
    this.age = 0;

    // OLD TARGET.
    // Target needs access to the Surface object.
    //this.surface = new this.game.gamejs.Surface(this.width, this.height);
    // surface, color, points, width (0 means fill)
    //this.game.gamejs.draw.polygon(this.surface, "#ffffff", [[0, 0], [20, 10], [0, 20]], 0);

    // CONFETTI PIG!!!!
    this.surface = $g.imgToSurface($g.assets.get("img/confetti_pig.png"));

    // The gamejs rotation works by clockwise rotation only.
    this.surface = this.game.gamejs.transform.rotate(this.surface, -config.heading);

    // Targets have three states: moving, exploding, outofbounds.
    // Moving is the only "living" state.
    this.state = "moving";
};
/**
 * Pointer to our $g object.
 * @type {$g}
 */
Target.prototype.game = $g;
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
    return this.state == "moving";
};
/**
 * Gets the size of the target.
 * @return {Number[]} the size of the target as [width, height] pixel array.
 */
Target.prototype.size = function() {
    return this.surface.getSize();
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
    this.age += ms;
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
 * Allows for rectangular collision tests.
 * @return {Number[]} Rectangular collision area as an array conforming to
 * [left, top, width, height].
 */
Target.prototype.collisionRectBoundaries = function() {
    // We use size, not width and height, because a rotated target takes
    // up more space.
    return this.upperLeft().concat(this.size());
};
/**
 * Responds to a "not rect" anti-collision test.
 * @param target {Object} What we did _not_ collide with.
 */
Target.prototype.collisionNotRect = function(/*target*/) {
    // We're trusting that the only thing we are anti-colliding with
    // is the game.
    if (this.age > 1000) {
        // Only targets more than 1 second old can be marked out of bounds.
        this.state = "outofbounds";
    }
};
/**
 * Responds to a rectangular collision test.
 * @param target {Object} What we collided with.
 */
Target.prototype.collisionRect = function(target) {
    if (target instanceof $g.local.entities.Flak) {
        // We are dead.
        this.state = "exploding";
    }
};



exports.Target = Target;



})($g.local.entities);
