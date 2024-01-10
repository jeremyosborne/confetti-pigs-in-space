import { Starfield } from "../game-objects";
import { Scene, GameObjects } from "phaser";
import { sceneNames } from "./scene-names";

/**
 * The initial scene of the game.
 */
export class Title extends Scene {
    background: Starfield;
    marqueeText: GameObjects.Text;
    titleText: GameObjects.Text;

    constructor() {
        super({ key: sceneNames.title });
    }

    preload() {
        // Display loading text or a loading bar
        let loadingText = this.add.text(40, 40, "Loading...", {
            font: "20px Arial",
            color: "#ffffff",
        });

        // Update loading progress
        this.load.on("progress", (value: number) => {
            loadingText.setText(
                `Loading assets... ${Math.floor(value * 100)}%`,
            );
        });

        // When everything is loaded, remove the loading text and start the main scene
        this.load.on("complete", () => {
            loadingText.destroy();
        });

        // Load all assets up front.
        this.load.audio(
            "bg-music",
            "assets/music/vamps_-_Borderline_(Fantastic_Vamps_8-Bit_Mix)_shortened.mp3",
        );
        this.load.audio(
            "explosion-flaktulence",
            "assets/sounds/flaktulence.wav",
        );
        this.load.audio("explosion-pig", "assets/sounds/explosion.wav");
        this.load.audio("explosion-dino", "assets/sounds/explosion2.wav");

        this.load.image("bg-space", "assets/images/starfield.png");
        this.load.image("confetti", "assets/images/confetti.png");
        this.load.image("flaktulence", "assets/images/flaktulence.png");
        this.load.image("pig", "assets/images/pig.png");
        this.load.image("purple-dino", "assets/images/purple-dino.png");
    }

    create() {
        this.background = new Starfield(this);

        this.titleText = this.add
            .text(
                this.sys.game.canvas.width / 2,
                this.sys.game.canvas.height / 2,
                "confetti pigs in space",
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

        this.background.update();
    }
}
