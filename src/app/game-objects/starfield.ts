import { GameObjects, Scene, Math as PhaserMath } from "phaser";

/**
 * Visual backdrop of the game.
 */
export class Starfield
    extends GameObjects.TileSprite
    implements IGameObjectUpdate
{
    constructor(scene: Scene) {
        super(
            scene,
            0,
            0,
            scene.sys.game.canvas.width,
            scene.sys.game.canvas.height,
            "bg-space",
        );
        // This works because normal origin is 0.5, not the upper left of the screen.
        this.setOrigin(0, 0);
        scene.add.existing(this);
    }

    update() {
        // Move the background tiles relative to the pointer position
        // from the center of the screen.
        // This should work in all phases of our game because the
        // puprle dino chases the pointer.
        const pointer = this.scene.input.activePointer;

        const backgroundScroll = new PhaserMath.Vector2(
            pointer.x - this.scene.cameras.main.width / 2,
            pointer.y - this.scene.cameras.main.height / 2,
        ).normalize();

        // The starfield itself should move away from the pointer.
        this.tilePositionX += backgroundScroll.x / 3;
        this.tilePositionY += backgroundScroll.y / 3;
    }
}
