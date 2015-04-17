(function(exports) {



/**
 * Making use of HTML5 Audio as best as possible, as simply as possible.
 * @param src {String} URL to the sound we wish to play.
 */
var Sound = function(src) {
    var self = this;

    /**
     * The URL to this sound.
     * @type {String}
     */
    this.src = src;

    /**
     * Reference to the Audio object that we'll use to play this audio.
     * @type {Audio}
     */
    this._audio = new Audio();
    // Allows us to listen to when the audio is done and maybe do
    // something.
    this._audio.addEventListener("ended", function() {
        if (typeof self.done == "function") {
            self.done();
        }
    });
};
/**
 * Play the noise, and cross fingers that the noise will play.
 */
Sound.prototype.play = function() {
    // The currentTime property seems to be read only.
    // This seems to be the only way to play audio repeatedly.
    this._audio.src = this.src;
    this._audio.play();
};
/**
 * Should we do anything when this audio is done?
 * @type {Function}
 */
Sound.prototype.done = null;



exports.Sound = Sound;



// Assume and enforce either attachment to the Game object or this.
// (Global/exports style of export allows easier testing.)
})(typeof window != "undefined" && window.$g ? window.$g : this);
