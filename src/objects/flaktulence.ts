import { GameObjects, Scene, Physics } from "phaser";

/**
 * The deadly flatulence emitted by the purple dino, used to
 * blow up the confetti pigs.
 */
export class Flaktulence extends GameObjects.Sprite {
    body: Physics.Arcade.Body;

    /** Set when launched from the dinosaur, measured against current time to control how long this explosion is visible. */
    birth: number | null;
    /** Total time in ms an explosion is on screen. */
    lifespanMax = 2000;
    /** Half of the explosion life is expanding, half is contracting. */
    lifespanHalf = this.lifespanMax / 2;
    /** How many pixels big before we implode. */
    maxSize = 60;

    constructor(scene: Scene, x: number = 0, y: number = 0) {
        super(scene, x, y, scene.textures.get("flaktulence"));

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Starts off dead and are managed by the group.
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
    }

    spawn(x: number, y: number) {
        this.birth = this.scene.time.now;
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.body.enable = true;
    }

    update(time: number) {
        const lifespan = time - this.birth;
        // Increase the size of the sprite.
        let sizeRatio: number;
        // Whether we are imploding or exploding.
        if (lifespan > this.lifespanMax) {
            this.setActive(false);
            this.setVisible(false);
            this.body.enable = false;
        } else if (lifespan > this.lifespanHalf) {
            // Exploding.
            sizeRatio = 1 - (lifespan - this.lifespanHalf) / this.lifespanHalf;
        } else {
            // Imploding.
            sizeRatio = lifespan / this.lifespanHalf;
        }
        // Height === width === circle :)
        this.displayWidth = this.displayHeight = sizeRatio * this.maxSize;
    }
}
