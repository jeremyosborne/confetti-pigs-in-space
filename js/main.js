$g.ready(function() {
    // Points to the dasspiel $g object.
    var game = this;
    var Noise = game.Noise;

    // Game specific settings.
    game.local("defaultFont", new game.gamejs.font.Font('22px monospace'));
    game.local("score", new game.ScoreKeeper());

    // What flak and explosions sound like in this game.
    game.local.explosions = [
        new Noise("audio/explosion1.wav"),
        new Noise("audio/explosion2.wav"),
        new Noise("audio/explosion3.wav"),
        new Noise("audio/explosion4.wav"),
    ];
    game.local.explosions.playRandom = function() {
        this[Math.floor(Math.random()*this.length)].play();
    };

    // For testing for collisions within the game boundaries.
    game.collision_rect_boundaries = function() {
        return [0, 0].concat(this.display.getSize());
    };

    game.displayCreate(600, 600)
        .stageAdd(game.local.Stages.start)
        .stageAdd(game.local.Stages.thegame)
        .stageAdd(game.local.Stages.end)
        .stageActivate("start")
        .run();
    
});
