/* jshint unused:true, undef:true, browser:true */
/* global $g:false */



(function(exports) {



/**
 * @class Used for tracking stats.
 */
var ScoreKeeper = function() {
    /**
     * Internal hash of scores.
     * @type {Object}
     */
    // Prototypeless object prevents need for hasOwnProperty checking.
    this._scores = Object.create(null);
};
/**
 * Rebuilds the internal JSON cache of scores from that which is passed in.
 * Calling this method will replace any and all previous scores.
 * @param json {Object} An object to convert JSON from.
 * @return {ScoreKeeper} Chainable command.
 */
ScoreKeeper.prototype.fromJSON = function(json) {
    var scores = Object.create(null);
    var score;

    for (score in json) {
        // We'll be a bit more careful about things being passed in.
        if (json.hasOwnProperty(score)) {
            scores[score] = json[score];
        }
    }

    // reset
    this._scores = scores;

    return this;
};
/**
 * Modifies the current value of a score.
 * Will also initialize a score to zero that did not previously exist, and
 * then modify it with the value.
 * @param score {String} Which score to modify.
 * @param [val=1] {Number} How much to modify the score by (positive or
 * negative). If for whatever reason you wish to not modify the score, make
 * sure to set val=0 during your call, but it's better practice to just use
 * set.
 * @return {ScoreKeeper} Chainable command.
 */
ScoreKeeper.prototype.mod = function(score, val) {
    if (val === undefined) {
        val = 1;
    }
    if (!this._scores[score]) {
        this._scores[score] = 0;
    }
    this._scores[score] += val;

    return this;
};
/**
 * Set the value of a specific score.
 * Also functions as an init method.
 * @param score {String} Which score to modify.
 * @param [val=0] {Number} What to set the score to, deleting any previous
 * score values.
 * @return {ScoreKeeper} Chainable command.
 */
ScoreKeeper.prototype.set = function(score, val) {
    // Here this is safe, as 0 will still be set to 0, no false reset.
    val = val || 0;
    this._scores[score] = val;

    return this;
};
/**
 * What is the value of a particular score?
 * @param score {String} Which score to return.
 * @return {Number} Returns either the score value, or 0 for any
 * non-initialized score.
 */
ScoreKeeper.prototype.val = function(score) {
    return this._scores[score] || 0;
};
/**
 * Add all existing scores together in a single value.
 * @return {Number} Returns the total value of all existing scores, added
 * together. If no scores, 0 will still be returned.
 */
ScoreKeeper.prototype.sum = function() {
    var scores = this._scores;
    var score;
    var total = 0;

    for (score in scores) {
        // Assumes prototypeless object.
        total += scores[score];
    }

    return total;
};
/**
 * Returns a copy of the internal JSON structure.
 * Does not return a reference.
 * @return {Object} The scores as a simple JSON object.
 */
ScoreKeeper.prototype.toJSON = function() {
    // Prevent the need for hasOwnProperty checking.
    var out = Object.create(null);
    var scores = this._scores;
    var score;

    for (score in scores) {
        out[score] = scores[score];
    }

    return out;
};

exports.ScoreKeeper = ScoreKeeper;



/**
 * @class Display of the points.
 */
var ScoreKeeperView = function() {};
ScoreKeeperView.prototype.update = function() {
    return true;
};
/**
 * Called during the draw stage.
 * @param target {Surface} Where we draw ourselves onto.
 */
 ScoreKeeperView.prototype.draw = function(target) {
    var local = $g.local;
    new $g.TextOverlay({
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


exports.ScoreKeeperView = ScoreKeeperView;



})($g.local);
