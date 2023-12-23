//
// Code making use of Phase 3.70.0
// This code must be transpiled before being run.
//

import { Game } from "phaser";
import { Title } from "./scenes/title";
import { Play } from "./scenes/play";

const game = new Game({
    backgroundColor: "#000000",

    // Idiomatic "full browser" sizing in Phaser3.
    // TODO: this will need a window resize listener to reset on window size change.
    width: window.innerWidth,
    height: window.innerHeight,

    // Selects by element `id`.
    parent: "game-container",
    scene: [Title, Play],
    type: Phaser.AUTO,
});
