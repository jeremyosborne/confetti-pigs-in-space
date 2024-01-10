import { ScoreKeeper, Starfield } from "../game-objects";
import { Scene, GameObjects } from "phaser";
import { sceneNames } from "./scene-names";

/**
 * The game over and high score scene.
 */
export class End extends Scene {
    background: Starfield;
    titleText: GameObjects.Text;

    constructor() {
        super({ key: sceneNames.end });
    }

    preload() {
        // All assets should be loaded in the title scene.
    }

    create() {
        this.background = new Starfield(this);

        let text = "The End.\nClick to play again";
        if (ScoreKeeper.scoreSavedIsHigh()) {
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
        this.background.update();
    }
}
