// Nomenclature and style
// g -> if used, refers to a local reference to the JSGameSoup class.
// c -> if used, refers to a local reference to the Canvas drawing context.
window.onload = function() {

    //------------------------------------------------------------------- MAIN
    // Early warning if in an old browser that doesn't support certain things.
    if (!document.querySelector || !Array.prototype.filter) {
        alert("This example needs a newer browser. Please get a newer browser.");
    }

    // Initialize the game objects and run the game.
    window.game = new JSGameSoup(document.querySelector("#game"), 40);
    // We will need the dimensions provided by world.
    window.world = new World();
    // Load the explosion audio.
    window.audio = new AudioManager();
    audio.load("audio/explosion1.wav", "explosion1");
    audio.load("audio/explosion2.wav", "explosion2");
    audio.load("audio/explosion3.wav", "explosion3");
    audio.load("audio/explosion4.wav", "explosion4");
    // Add a method to our audio instance that will play
    // a random explosion.
    audio.playExplosion = function() {
        var i = Math.floor(Math.random() * 4 + 1);
        this.play("explosion"+i);
    };
    // We will need access to the score.
    window.score = new Score();
    game.addEntity(world);
    game.addEntity(score);
    game.addEntity(new MouseCoords());
    game.addEntity(new Crosshair());
    game.launch();

    // Repeatedly add targets to the game field.
    setInterval(function() {
        // Choose a random height for the target
        var targetY = Math.floor(Math.random() * (world.height-Target.prototype.height) + 1);
        game.addEntity(new Target(targetY));
    }, 1000);
};
