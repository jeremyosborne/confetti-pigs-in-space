/*global JSGameSoup:false, World:false, AudioManager:false, Score:false, Crosshair:false, Target:false */

// Nomenclature and style
// g -> if used, refers to a local reference to the JSGameSoup class.
// c -> if used, refers to a local reference to the Canvas drawing context.
window.onload = function() {

    //------------------------------------------------------------------- MAIN
    // Initialize the game objects and run the game.
    // The "game" object will be the main global object, an instance of
    // JSGameSoup, and mixed in with other objects that I want to be
    // global.
    window.game = new JSGameSoup(document.querySelector("#game"), 40);

    // We will need the dimensions provided by world.
    game.world = new World();

    // Load the explosion audio.
    game.audio = new AudioManager();
    game.audio.load("audio/explosion1.wav", "explosion1");
    game.audio.load("audio/explosion2.wav", "explosion2");
    game.audio.load("audio/explosion3.wav", "explosion3");
    game.audio.load("audio/explosion4.wav", "explosion4");
    // Add a method to our audio instance that will play
    // a random explosion.
    game.audio.playExplosion = function() {
        var i = Math.floor(Math.random() * 4 + 1);
        this.play("explosion"+i);
    };

    // We will need access to the score.
    game.score = new Score();
    game.addEntity(game.world);
    game.addEntity(game.score);
    game.addEntity(new Crosshair());
    game.launch();

    // Repeatedly add targets to the game field.
    setInterval(function() {
        // Which side will the target enter from?
        var side = Math.floor(Math.random() * 4);
        // Randomize the direction of travel.
        var headingDeltaSign = Math.random() > 0.5 ? +1 : -1;
        var headingDelta = headingDeltaSign * Math.floor(Math.random() * 20);
        // The speed of the target, between 1 and 10 frames a second.
        var speed = Math.floor(Math.random() * 10 + 1);
        // The target we're going to add to the game.
        var target;
        
        switch (side) {
            case 0:
                // top, heading down
                target = new Target({
                    x: Math.floor(Math.random() * (game.world.width-Target.prototype.width)),
                    // Just touching the edge so the target doesn't get
                    // removed before it is even visible.
                    y: -Target.prototype.height+1,
                    heading: 270 + headingDelta,
                    speed: speed
                });
                break;
            case 1:
                // right, heading left
                target = new Target({
                    // Just touching the edge so the target doesn't get
                    // removed before it is even visible.
                    x: game.world.width-1,
                    y: Math.floor(Math.random() * (game.world.height-Target.prototype.height)),
                    heading: 180 + headingDelta,
                    speed: speed
                });
                break;
            case 2:
                // bottom, heading up
                target = new Target({
                    x: Math.floor(Math.random() * (game.world.width-Target.prototype.width)),
                    // Just touching the edge so the target doesn't get
                    // removed before it is even visible.
                    y: game.world.width-1,
                    heading: 90 + headingDelta,
                    speed: speed
                });
                break;
            case 3:
                // left, heading right
                target = new Target({
                    // Just touching the edge so the target doesn't get
                    // removed before it is even visible.
                    x: -Target.prototype.width+1,
                    y: Math.floor(Math.random() * (game.world.height-Target.prototype.height)),
                    heading: 0 + headingDelta,
                    speed: speed
                });
                break;
        }
        game.addEntity(target);
    }, 650);
};
