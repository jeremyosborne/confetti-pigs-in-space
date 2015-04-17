/* jshint unused:true, undef:true, browser:true */
/* global $g:false */



(function(exports) {




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

exports.Countdown = Countdown;






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
    var secondsRemaining = Math.floor(this.countdown.remaining() / 1000);
    new $g.TextOverlay({
        alignx: "right",
        paddingx: 10,
        aligny: "top",
        paddingy: 10,
        // At time of writing, we need some non-falsey value.
        // Don't pass a simple 0 into text.
        text: "Time remaining: " + secondsRemaining,
        font: $g.local.defaultFont,
    }).draw(target);
};

exports.CountdownView = CountdownView;



})($g.local);
