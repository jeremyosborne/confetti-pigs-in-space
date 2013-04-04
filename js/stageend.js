(function(exports) {



// The end.
exports.end = {
    id: "end",
    enter: function() {
        var game = this.game;
        var defaultFont = game.local("defaultFont");
        var TextOverlay = game.TextOverlay;

        this.theEndText = new TextOverlay({
            alignx: "center",
            aligny: "center",
            text: "this is the end.",
            font: defaultFont,
        });
        this.theEndText2 = new TextOverlay({
            alignx: "center",
            aligny: "center",
            paddingy: 25,
            text: "thank you for playing shootdown.",
            font: defaultFont,
        });
        this.finalScoreText = new TextOverlay({
            alignx: "center",
            aligny: "center",
            paddingy: 50,
            text: "Your final score is: " + game.local.score.sum(),
            font: defaultFont,
        });
    },
    heartbeat: function(msDuration) {
        var display = this.game.display;
        display.fill('#000000');
        this.theEndText.draw(display);
        this.theEndText2.draw(display);
        this.finalScoreText.draw(display);
    },
    // Text Overlays, created during enter initialization.
    theEndText: null,
    theEndTest2: null,
    finalScoreText: null,
};



})(Game.local.Stages);
