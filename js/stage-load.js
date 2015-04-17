/* jshint unused:true, undef:true */
/* global $g:false */

(function(exports) {


// Welcome screen. Assumes a transition to the game.
exports.load = {
    id: "load",
    enter: function() {
        var pigImgSrc = "img/confetti_pig.png";
        var self = this;
        var game = this.game;
        var defaultFont = game.local("defaultFont");
        var TextOverlay = game.TextOverlay;

        // Initialize.
        this.loadingText = new TextOverlay({
            alignx: "center",
            aligny: "center",
            text: "loading assets....",
            font: defaultFont,
        });

        // Setup asset load listeners.
        game.assets.onloadsuccess = function(/*data*/) {
            self.loadingText = new TextOverlay({
                alignx: "center",
                aligny: "center",
                text: "assets loaded. click to continue...",
                font: defaultFont,
            });
        };
        game.assets.onloadfail = function(/*data*/) {
            self.loadingText = new TextOverlay({
                alignx: "center",
                aligny: "center",
                text: "error loading assets....",
                font: defaultFont,
            });
        };
        game.assets.imgLoad(pigImgSrc);
    },
    heartbeat: function(/*msDuration*/) {
        var game = this.game;
        var display = game.display;
        var event = game.gamejs.event;
        var MOUSE_DOWN = event.MOUSE_DOWN;
        var assetsLoaded = !game.assets.isLoading();

        event.get().forEach(function(e) {
            if (e.type === MOUSE_DOWN && assetsLoaded) {
                // Transition.
                game.stageActivate("start");
            }
        });

        display.fill('#000000');
        this.loadingText.draw(display);
    },
    // Initialized when this stage is entered.
    loadingText: null,
};



})($g.local.Stages);
