(function(exports) {



// Manages the game until the game is over.
exports.thegame = {
    "id": "thegame",
    "enter": function() {
        var game = this.game;
        var defaultFont = game.defaultFont;
        var TextOverlay = game.TextOverlay;
        
        // Initialize.
        this.gameText = new TextOverlay({
            alignx: "center",
            aligny: "center",
            text: "[placeholder for the game. click to end.]",
            font: defaultFont,
        });
    },
    "heartbeat": function(msDuration) {
        var game = this.game;
        var display = game.display;
        var event = game.engine.event;
        var MOUSE_DOWN = event.MOUSE_DOWN;

        event.get().forEach(function(e) {
            if (e.type === MOUSE_DOWN) {
                // Transition.
                game.activateStage("end");
            }
        });
        display.fill('#000000');
        this.gameText.draw(display);
    },
    // Created during initialization.
    gameText: null,
};



})(Stages);
