import { Display, GameObjects, Scene } from "phaser";

export class ConfettiEmitter extends GameObjects.Particles.ParticleEmitter {
    constructor(scene: Scene) {
        const quantity = 10;
        super(scene, 0, 0, "confetti", {
            blendMode: "ADD",
            emitting: true,
            gravityY: 200,
            lifespan: 2000,
            quantity,
            speed: 100,
            tint: Array.apply(null, new Array(quantity)).map(() => {
                return Display.Color.RandomRGB().color;
            }),
        });
        scene.add.existing(this);
    }

    spawn(x: number, y: number) {
        this.setPosition(x, y);
        this.setVisible(true);
        this.emitting = true;
        this.explode();
    }
}
