import { GameObjects, Math as PhaserMath, Scene } from "phaser";
import { PurpleDino } from "../sprites/purple-dino";
import { Pig } from "../sprites/pig";
import { sceneNames } from "./scene-names";

/**
 * The main game.
 */
export class Play extends Scene {
    background: GameObjects.TileSprite;
    pigs: GameObjects.Group;
    pigSpawnNext: number;
    purpleDino: GameObjects.Sprite;

    constructor() {
        super({ key: sceneNames.play });
        this.pigSpawnNext = 0;
    }

    preload() {
        this.load.audio(
            "bg-music",
            "assets/music/vamps_-_Borderline_(Fantastic_Vamps_8-Bit_Mix)_shortened.mp3",
        );
        this.load.audio(
            "explosion-flaktulence",
            "assets/sounds/flaktulence.wav",
        );
        this.load.audio("explosion-pig", "assets/sounds/explosion.wav");
        this.load.audio("explosion-dino", "assets/sounds/explosion2.wav");

        this.load.image("bg-space", "assets/images/starfield.png");

        this.load.image("purple-dino", "assets/sprites/purple-dino.png");
        this.load.image("pig", "assets/sprites/pig.png");
    }

    create() {
        this.background = this.add
            .tileSprite(
                0,
                0,
                this.sys.game.canvas.width,
                this.sys.game.canvas.height,
                "bg-space",
            )
            // This works because normal origin is 0.5, not the upper left of the screen.
            .setOrigin(0, 0);

        this.purpleDino = new PurpleDino(
            this,
            this.sys.game.canvas.width / 2,
            this.sys.game.canvas.height / 2,
        );

        this.pigs = this.add.group();
        for (let i = 0; i < 10; i++) {
            this.pigs.add(new Pig(this));
        }
        this.pigs.runChildUpdate = true;
    }

    pigAdd() {
        // Bring in the replacement pig.
        var nextPig: Pig = this.pigs.getFirstDead() as Pig;
        if (nextPig) {
            nextPig.spawn(this, this.purpleDino);
        }
    }

    update(gameTime: number, delta: number) {
        this.purpleDino.update();
        this.pigs.preUpdate(gameTime, delta);

        let backgroundScroll = new PhaserMath.Vector2(
            this.purpleDino.body.velocity.x,
            this.purpleDino.body.velocity.y,
        ).normalize();

        this.background.tilePositionX += backgroundScroll.x / 3;
        this.background.tilePositionY += backgroundScroll.y / 3;

        // Note: This check caused some bizarre condition when placed before the
        // collision/overlap.
        if (this.pigSpawnNext === 0) {
            // Initialize on first update.
            this.pigSpawnNext = gameTime + 800;
        } else if (
            this.pigSpawnNext < gameTime &&
            // Math.min(this.pigs.countLiving(), 10) < this.level
            Math.min(this.pigs.countActive(), 10) < 1
        ) {
            this.pigAdd();
            this.pigSpawnNext = gameTime + 800;
        }
    }
}
