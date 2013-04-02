Game.ready(function() {
    // Points to the dasspiel Game object.
    var game = this;
    var Noise = game.Noise;

    game.defaultFont = new game.engine.font.Font('22px monospace');

    game.score = new game.ScoreKeeper();

    game.explosions = [
        new Noise("audio/explosion1.wav"),
        new Noise("audio/explosion2.wav"),
        new Noise("audio/explosion3.wav"),
        new Noise("audio/explosion4.wav"),
    ];
    game.explosions.playRandom = function() {
        this[Math.floor(Math.random()*this.length)].play();
    };



    game.createDisplay(600, 600)
        .addStage(Stages.start)
        .addStage(Stages.thegame)
        .addStage(Stages.end)
        .activateStage("start")
        .run();
    
});
