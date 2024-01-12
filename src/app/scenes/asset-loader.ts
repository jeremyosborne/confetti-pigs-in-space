import { assetConfigs } from "../assets";
import { Scene } from "phaser";
import { sceneNames } from "./scene-names";

/**
 * Handle loading of assets.
 *
 * Designed with idea that all assets will be loaded up front before the
 * game itself loads, and assets will not be lazy loaded in other
 * spots of the game.
 *
 * @see assetConfigs
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
        for (const [key, config] of Object.entries(assetConfigs)) {
            if (config.type === "audio") {
                this.load.audio(key, config.url);
            } else if (config.type === "image") {
                this.load.image(key, config.url);
            } else {
                throw new Error(
                    `${key} has unknown config of ${JSON.stringify(config)}`,
                );
            }
        }
    }
}
