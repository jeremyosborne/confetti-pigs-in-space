import { GameObjects, Scene, Physics } from "phaser";

/**
 * The main antagonists. They chase the purple dino.
 */
export class Pig extends GameObjects.Sprite {
    body: Physics.Arcade.Body;
    /** Pigs follow the purple dino. */
    target?: GameObjects.Sprite;

    constructor(scene: Scene, x: number = 0, y: number = 0) {
        super(scene, x, y, "pig");

        scene.add.existing(this);
        scene.physics.add.existing(this);
        // Shrink the body size to make collisions a bit more forgiving.
        this.body.setSize(this.width - 8, this.height - 8);

        // Pigs start off dead and are managed by the group.
        this.setActive(false);
        this.setVisible(false);
    }

    spawn(scene: Scene, target: GameObjects.Sprite) {
        this.target = target;
        // Put the pig in one of the corners of the game and start again.
        this.setPosition(
            Math.random() > 0.5 ? 0 : scene.sys.game.canvas.width,
            Math.random() > 0.5 ? 0 : scene.sys.game.canvas.height,
        );
        this.setActive(true);
        this.setVisible(true);
    }

    update() {
        if (this.target) {
            const distanceToTarget = Phaser.Math.Distance.Between(
                this.x,
                this.y,
                this.target.x,
                this.target.y,
            );
            // Conveniently returns the angle between the pig and the dino so
            // we can face the pig towards the dino.
            this.rotation = this.scene.physics.moveToObject(
                this,
                this.target,
                distanceToTarget > 5 ? 125 : 0,
            );
        }
    }
}
