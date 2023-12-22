//
// Code making use of Phase 3.70.0
// This code must be transpiled before being run.
//

import { Game } from "phaser";

var game = new Game({
    backgroundColor: "#000000",
    // Idiomatic "full browser" sizing in Phaser3.
    // TODO: this will window resize listener to reset when the window changes.
    width: window.innerWidth,
    height: window.innerHeight,
    // What element do we want to use as the parent.
    // document.querySelector(".game-container"),
    parent: "game-container",
    // Let Phaser choose the renderer.
    type: Phaser.AUTO,
});
