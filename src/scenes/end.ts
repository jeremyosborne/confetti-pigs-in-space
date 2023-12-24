import { ScoreKeeper } from "../game-objects";
import { Scene, GameObjects } from "phaser";
import { sceneNames } from "./scene-names";

/**
 * The game over and high score scene.
 */
export class End extends Scene {
    background: GameObjects.TileSprite;
    titleText: GameObjects.Text;

    constructor() {
        super({ key: sceneNames.end });
    }

    preload() {
        this.load.image("bg-space", "assets/images/starfield.png");
    }

    create() {
        this.background = this.add
            .tileSprite(
                0,
                0,
                this.sys.game.canvas.width,
                this.sys.game.canvas.height,
                "bg-space",
            )
            // This works because normal origin is 0.5, not the upper left of the screen.
            .setOrigin(0, 0);

        let text = "The End.\nClick to play again";
        if (ScoreKeeper.savedScoreIsHigh()) {
            text = "You got the high score!\n" + text;
        }
        this.titleText = this.add
            .text(
                this.sys.game.canvas.width / 2,
                this.sys.game.canvas.height / 2,
                text,
                {
                    color: "#ffffff",
                    font: "bold 42px Arial",
                    align: "center",
                },
            )
            .setOrigin(0.5);

        this.input.once(
            "pointerdown",
            function (this: Phaser.Scene) {
                this.scene.start(sceneNames.play);
            },
            this,
        );
    }

    update() {
        this.background.tilePositionY += 0.5;
    }
}
