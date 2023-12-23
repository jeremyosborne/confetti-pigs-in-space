import { GameObjects, Scene } from "phaser";

/**
 * The purple dino is the main player.
 */
export class PurpleDino extends GameObjects.Sprite {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "purple-dino");

        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    update() {
        const { activePointer } = this.scene.input;
        const spriteToPointerDistance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            activePointer.x,
            activePointer.y,
        );
        // Dino wants to follow the pointer.
        this.rotation = this.scene.physics.moveToObject(
            this,
            activePointer,
            // The pointer needs to be a certain distance from the dino
            // for it to move, otherwise it will just rotate and face
            // the pointer.
            spriteToPointerDistance > 30 ? 150 : 0,
        );
    }
}
