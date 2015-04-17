/* jshint unused:true, undef:true */
/* global $g:false */

$g.ready(function() {
    // Game specific settings.
    $g.local("defaultFont", new $g.gamejs.font.Font('22px monospace'));
    $g.local("score", new $g.local.ScoreKeeper());

    $g.local("explosions", [
        new $g.Sound("audio/explosion1.wav"),
        new $g.Sound("audio/explosion2.wav"),
        new $g.Sound("audio/explosion3.wav"),
        new $g.Sound("audio/explosion4.wav"),
    ]);
    $g.local.explosions.playRandom = function() {
        this[Math.floor(Math.random() * this.length)].play();
    };
    $g.local("flaksound", new $g.Sound("audio/flak.wav"));


    // For testing for collisions within the game boundaries.
    $g.collisionRectBoundaries = function() {
        return [0, 0].concat(this.display.getSize());
    };



    $g.displayCreate(600, 600)
        .stageAdd($g.local.stageLoad)
        .stageAdd($g.local.stageStart)
        .stageAdd($g.local.stageTheGame)
        .stageAdd($g.local.stageEnd)
        .stageActivate("load")
        .run();

});
