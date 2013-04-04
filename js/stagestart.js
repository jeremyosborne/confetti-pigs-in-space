(function(exports) {


// Welcome screen. Assumes a transition to the game.
exports.start = {
    "id": "start",
    "enter": function() {
        var game = this.game;
        var defaultFont = game.local("defaultFont");
        var TextOverlay = game.TextOverlay;
        
        // Initialize.
        this.welcomeText = new TextOverlay({
            alignx: "center",
            aligny: "center",
            text: "shootdown",
            font: defaultFont,
        });
        this.helpText = new TextOverlay({
            alignx: "center",
            aligny: "center",
            paddingy: 25,
            text: "click to start. click to shoot things.",
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
                game.activateStage("thegame");
            }
        });
        
        display.fill('#000000');
        this.welcomeText.draw(display);
        this.helpText.draw(display);
    },
    // Initialized when this stage is entered.
    "welcomeText": null,
    "helpText": null,
};



})(Game.local.Stages);
