Game.ready(function() {
    // Points to the dasspiel Game object.
    var game = this;
    var TextOverlay = game.TextOverlay;
    var Noise = game.Noise;

    game.defaultFont = new game.engine.font.Font('22px monospace');

    game.explosions = [
        new Noise("audio/explosion1.wav"),
        new Noise("audio/explosion2.wav"),
        new Noise("audio/explosion3.wav"),
        new Noise("audio/explosion4.wav"),
    ];
    game.explosions.playRandom = function() {
        this[Math.floor(Math.random()*this.length)].play();
    };



    game
        .createDisplay(600, 600)
        .addStage(Stages.start)
        .addStage(Stages.thegame)
        .addStage({
            id: "end",
            enter: function() {
                // TODO calculate the final score here for display.
                this.finalScoreText = new TextOverlay({
                    alignx: "center",
                    aligny: "center",
                    paddingy: 25,
                    text: "Your final score is: " + "N/A",
                    font: game.defaultFont,
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
                font: game.defaultFont,
            }),
            finalScoreText: null,
        })
        .activateStage("start")
        .run();
    
});
