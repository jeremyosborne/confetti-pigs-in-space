import { Display, GameObjects, Scene, Physics } from "phaser";

/**
 * The deadly flatulence emitted by the purple dino, used to blow up the confetti pigs,
 * and careless dinos.
 */
export class Flaktulence extends GameObjects.Sprite {
    body: Physics.Arcade.Body;

    mask: Display.Masks.GeometryMask;
    /** Set when launched from the dinosaur, measured against current time to control how long this explosion is visible. */
    birth: number | null;
    /** Total time in ms an explosion is on screen. */
    lifespanMax = 2000;
    /** Half of the explosion life is expanding, half is contracting. */
    lifespanHalf = this.lifespanMax / 2;
    /** How many pixels big before we implode. */
    maxSize = 60;

    constructor(scene: Scene, x: number = 0, y: number = 0) {
        // Inversion of control since the sprites and the scenes need each other,
        // and so we isolate set some scene specific things within the sprite
        // since the sprite also needs to be configured with the scene.
        // Not sure whether I actually like this method or not, but time will tell.
        // super(scene, x, y, scene.textures.get("flaktulence"));
        super(scene, x, y, "flaktulence");
        scene.add.existing(this);
        // For collision detection.
        scene.physics.add.existing(this);

        // Circular cut out of the image.
        this.mask = this.scene.make
            .graphics({
                x,
                y,
            })
            .beginPath()
            .arc(0, 0, 28, 0, 2 * Math.PI)
            .closePath()
            .fillPath()
            .createGeometryMask();
        this.setMask(this.mask);
        // Start off "dead" and are managed by the group.
        this.kill();
    }

    live() {
        this.setActive(true);
        this.setVisible(true);
        this.body.enable = true;
    }

    kill() {
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
    }

    spawn(x: number, y: number) {
        this.birth = this.scene.time.now;
        // Circular cut out of the image.
        // As noted, masks are not relative to a sprite, but are positioned
        // in global space.
        this.mask.geometryMask.setPosition(x, y);
        this.setPosition(x, y);
        this.live();
    }

    update(time: number) {
        const lifespan = time - this.birth;
        // Increase the size of the sprite.
        let sizeRatio: number;
        // Whether we are imploding or exploding.
        if (lifespan > this.lifespanMax) {
            this.kill();
        } else if (lifespan > this.lifespanHalf) {
            // Exploding.
            sizeRatio = 1 - (lifespan - this.lifespanHalf) / this.lifespanHalf;
        } else {
            // Imploding.
            sizeRatio = lifespan / this.lifespanHalf;
        }
        // Have to resize the mask along with the image itself.
        this.mask.geometryMask.scale = sizeRatio;
        this.scale = sizeRatio;
    }
}
