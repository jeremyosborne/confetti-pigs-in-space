//
// Code making use of Phase 3.70.0
// This code must be transpiled before being run.
//

import { config } from "./config";
import { Game } from "phaser";
import { End, Play, Title } from "./scenes";

new Game({
    // Idiomatic "full browser" sizing in Phaser3.
    width: window.innerWidth,
    height: window.innerHeight,

    backgroundColor: "#000000",

    // Selects by element `id`.
    parent: "game-container",
    physics: {
        default: "arcade",
        arcade: {
            debug: config().PHASER_PHYSICS_ARCADE_DEBUG,
        },
    },
    scene: [Title, Play, End],
    type: Phaser.AUTO,
});
