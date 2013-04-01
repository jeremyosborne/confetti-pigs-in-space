Game.ready(function() {
    var game = this;
    var TextOverlay = game.TextOverlay;
    var labelFont = new game.engine.font.Font('22px monospace');
    
    game
        .createDisplay(600, 600)
        .addStage({
            "id": "start",
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
            // This is not part of the stage interface.
            "welcomeText": new TextOverlay({
                alignx: "center",
                aligny: "center",
                text: "shootdown",
                font: labelFont,
            }),
            "helpText": new TextOverlay({
                alignx: "center",
                aligny: "center",
                paddingy: 25,
                text: "click to start. click to shoot things.",
                font: labelFont,
            }),
        })
        .addStage({
            "id": "thegame",
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
            // Text Overlays
            gameText: new TextOverlay({
                alignx: "center",
                aligny: "center",
                text: "[placeholder for the game. click to end.]",
                font: labelFont,
            }),
        })
        .addStage({
            id: "end",
            enter: function() {
                // TODO calculate the final score here for display.
                this.finalScoreText = new TextOverlay({
                    alignx: "center",
                    aligny: "center",
                    paddingy: 25,
                    text: "Your final score is: " + "N/A",
                    font: labelFont,
                });
            },
            heartbeat: function(msDuration) {
                var display = this.game.display;
                display.fill('#000000');
                this.theEndText.draw(display);
                this.finalScoreText.draw(display);
            },
            // Text Overlays
            theEndText: new TextOverlay({
                alignx: "center",
                aligny: "center",
                text: "the end. thank you for playing.",
                font: labelFont,
            }),
            finalScoreText: null,
        })
        .activateStage("start")
        .run();
    
});
