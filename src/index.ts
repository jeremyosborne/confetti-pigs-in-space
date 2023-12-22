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

    // Selects by element `id`.
    parent: "game-container",
    type: Phaser.AUTO,
});
