import { Scene, GameObjects } from "phaser";
import { sceneNames } from "./scene-names";

/**
 * The initial scene of the game.
 */
export class Title extends Scene {
    marqueeText: GameObjects.Text;
    titleText: GameObjects.Text;
    background: GameObjects.TileSprite;

    constructor() {
        super({ key: sceneNames.title });
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

        this.titleText = this.add
            .text(
                this.sys.game.canvas.width / 2,
                this.sys.game.canvas.height / 2,
                "shootdown\n(the pigs in space)",
                {
                    color: "#ffffff",
                    font: "bold 42px Arial",
                    align: "center",
                },
            )
            .setOrigin(0.5);

        // Every game needs an (inane) story.
        // Scroll from right to left.
        this.marqueeText = this.add.text(
            this.sys.game.canvas.width + 20,
            this.sys.game.canvas.height - 48,
            [
                "What a night.",
                "Trapped in the mascot costume.",
                "Too much junk food.",
                "Jettisoned out the airlock into space.",
                "Confetti filled pigs in pursuit.",
                "Today your flatulence might save your life.",
                "Don't get caught in your own gas.",
                "Yes this is the plot.",
            ].join(" "),
            {
                color: "#ffffff",
                font: "bold 28px Arial",
            },
        );

        this.input.once(
            "pointerdown",
            function (this: Phaser.Scene) {
                this.scene.start(sceneNames.play);
            },
            this,
        );
    }

    update() {
        this.marqueeText.x -= 3;

        this.background.tilePositionY += 0.5;
    }
}
