//
// Code making use of Phase 3.70.0
// This code must be transpiled before being run.
//

import { Game } from "phaser";
import { End, Play, Title } from "./scenes";

new Game({
    // Idiomatic "full browser" sizing in Phaser3.
    // TODO: this will need a window resize listener to reset on window size change.
    width: window.innerWidth,
    height: window.innerHeight,

    backgroundColor: "#000000",

    // Selects by element `id`.
    parent: "game-container",
    physics: {
        default: "arcade",
        arcade: {
            // TODO: support with dot-env-webpack
            debug: false,
        },
    },
    scene: [Title, Play, End],
    type: Phaser.AUTO,
});
