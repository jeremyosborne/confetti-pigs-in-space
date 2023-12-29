import { Display, GameObjects, Scene } from "phaser";

/**
 * A reusable, general particle emitter we use for explosions the pigs and the dinos.
 */
export class ConfettiEmitter extends GameObjects.Particles.ParticleEmitter {
    /** Default number of particles. */
    quantity: number;

    constructor(scene: Scene, quantity = 15) {
        super(scene, 0, 0, "confetti", {
            // blendMode: "ADD",
            // Whether this emitter constantly emits or not.
            emitting: false,
            gravityX: 0,
            gravityY: 0,
            lifespan: 2000,
            // maxParticles: quantity,
            quantity,
            rotate: { start: 0, end: 720 },
            // Prefer fade out, but I can't figure that DSL out at the moment (probably a tween).
            scale: { start: 1.0, end: 0 },
            speed: 90,
            // stopAfter: quantity,
            // `color` and `tint` are mutually exclusive.
            // According to docs, tint should not include alpha channel, just
            // hex color, like `0xff0000`.
            tint: Array.apply(null, new Array(quantity)).map(() => {
                return Display.Color.RandomRGB().color;
            }),
            // (true) override the color vs. (false) additive blended tinting
            tintFill: true,
        });
        // Inversion of control, since the scene needs to know about this for it to work
        // and this cannot work outside of a single scene.
        scene.add.existing(this);

        // Store for later.
        this.quantity = 15;
    }

    spawn(x: number, y: number) {
        // This seems better than explode or anything else.
        this.emitParticleAt(x, y, this.quantity);
    }
}
