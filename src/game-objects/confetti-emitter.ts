import { Display, GameObjects, Scene } from "phaser";

export class ConfettiEmitter extends GameObjects.Particles.ParticleEmitter {
    constructor(scene: Scene) {
        const quantity = 10;
        // FIXME: the confetti does _not_ work with the particle emitter. We are using the pig asset as a stand in.
        super(scene, 400, 400, "pig", {
            blendMode: "ADD",
            emitting: true,
            gravityY: 200,
            lifespan: 2000,
            quantity,
            speed: 100,
            // FIXME: the tint does not work with the textures, at least the way I've coded it.
            // tint: new Array(quantity).map(
            //     () => Display.Color.RandomRGB().color,
            // ),
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
