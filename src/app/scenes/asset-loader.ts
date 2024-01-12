import { Scene } from "phaser";
import { sceneNames } from "./scene-names";

/**
 * Handle loading of assets.
 *
 * Designed with idea that all assets will be loaded up front before the
 * game itself loads, and assets will not be lazy loaded in other
 * spots of the game.
 */
export class AssetLoader extends Scene {
    /** The key of the next scene we will transition to after loading. */
    nextScene: string = sceneNames.title;
    /** Message prefixed to the loading percentage. */
    loadingMessage: string = "Loading game assets...";

    constructor() {
        super({ key: sceneNames.assetLoader });
    }

    preload() {
        // Display loading text in the middle of the screen.
        let loadingText = this.add.text(
            this.cameras.main.worldView.x + this.cameras.main.width / 2,
            this.cameras.main.worldView.y + this.cameras.main.height / 2,
            this.loadingMessage,
            {
                font: "20px Arial",
                color: "#ffffff",
            },
        );
        loadingText.setOrigin(0.5, 0.5);

        // Update loading progress
        this.load.on("progress", (value: number) => {
            loadingText.setText(
                `${this.loadingMessage} ${Math.floor(value * 100)}%`,
            );
        });

        // When everything is loaded, remove the loading text and start the main scene
        this.load.on("complete", () => {
            loadingText.destroy();
            this.scene.start(this.nextScene);
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
}
