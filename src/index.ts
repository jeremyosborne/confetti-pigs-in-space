import Phaser from "phaser";

var game = new Phaser.Game({
    // Let Phaser choose the renderer.
    type: Phaser.AUTO,
    // String dimensions are considered percentages of parent container.
    width: "100",
    height: "100",
    // What element do we want to use as the parent.
    // document.querySelector(".game-container"),
});
