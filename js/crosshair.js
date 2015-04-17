/* jshint unused:true, undef:true */
/* global $g:false */



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
    this.surface = new $g.gamejs.Surface(20, 20);
    // surface, color, startPos, endPos, width
    $g.gamejs.draw.line(this.surface, "#ffffff", [9, 0], [9, 3], 1);
    $g.gamejs.draw.line(this.surface, "#ffffff", [9, 16], [9, 19], 1);
    $g.gamejs.draw.line(this.surface, "#ffffff", [0, 9], [3, 9], 1);
    $g.gamejs.draw.line(this.surface, "#ffffff", [16, 9], [19, 9], 1);
};
Crosshair.prototype.isAlive = function() {
    // We're always alive.
    return true;
};
Crosshair.prototype.size = function() {
    return !this.surface ? null : this.surface.getSize();
};
Crosshair.prototype.upperLeft = function() {
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
Crosshair.prototype.update = function(/*msDuration*/) {
    return this.isAlive();
};
/**
 * Called during the draw stage.
 * @param target {Surface} Where we draw ourselves onto.
 */
Crosshair.prototype.draw = function(target) {
    if (this.surface) {
        //this.surface.setAlpha(this.alpha);
        target.blit(this.surface, this.upperLeft());
    }
};

exports.Crosshair = Crosshair;



})($g.local);
