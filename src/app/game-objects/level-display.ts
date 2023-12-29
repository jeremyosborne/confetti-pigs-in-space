import { GameObjects, Scene } from "phaser";

export class LevelDisplay extends GameObjects.Text {
    constructor(scene: Scene) {
        // No initial text.
        super(scene, 0, 0, "", {
            color: "#ffffff",
            font: "bold 36px Arial",
            align: "center",
        });
        scene.add.existing(this);

        this.setOrigin(0.5);
        this.setActive(false);
        this.setVisible(false);
    }

    spawn(level: number = 1) {
        this.setText("Level " + level);
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(this.scene.cameras.main.centerX, -50);
        this.setRotation(0);
        this.setScale(1);

        this.scene.tweens.chain({
            targets: this,
            tweens: [
                {
                    // Drop down to the center of the screen from the top of the screen.
                    y: this.scene.cameras.main.centerY,
                    rotation: 2 * Math.PI,
                    duration: 1000,
                    ease: "Linear",
                },
                {
                    // Shrink out of view.
                    scaleX: 0,
                    scaleY: 0,
                    duration: 2000,
                    ease: "Linear",
                },
            ],
        });
    }
}
