/* jshint unused:true, undef:true */
/* global $g:false, APP_CONFIG:false */

(function(exports) {


// Welcome screen. Assumes a transition to the game.
exports.stageStart = {
    id: "start",
    enter: function() {
        var game = this.game;
        var defaultFont = game.local("defaultFont");
        var TextOverlay = game.TextOverlay;


        this.titleText = [
            new TextOverlay({
                alignx: "center",
                aligny: "center",
                text: "shootdown",
                font: defaultFont,
            }),
            new TextOverlay({
                alignx: "center",
                aligny: "center",
                paddingy: 27,
                text: "click to start. click to shoot things.",
                font: defaultFont,
            }),
            new TextOverlay({
                alignx: "center",
                aligny: "center",
                paddingy: 120,
                text: "build date: " + APP_CONFIG.BUILD_DATE,
                font: defaultFont,
            }),
        ];
    },
    heartbeat: function(/*msDuration*/) {
        var game = this.game;
        var display = game.display;
        var event = game.gamejs.event;
        var MOUSE_DOWN = event.MOUSE_DOWN;

        event.get().forEach(function(e) {
            if (e.type === MOUSE_DOWN) {
                // Transition.
                game.stageActivate("thegame");
            }
        });

        display.fill('#000000');
        for (var i = 0; i < this.titleText.length; i++) {
            this.titleText[i].draw(display);
        }
    },
    // Initialized when this stage is entered. Array of text objects.
    titleText: null,
};



})($g.local);
