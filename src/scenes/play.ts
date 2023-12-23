import { Display, GameObjects, Math as PhaserMath, Scene } from "phaser";
import {
    ConfettiEmitter,
    Flaktulence,
    LevelDisplay,
    Pig,
    PurpleDino,
    ScoreKeeper,
} from "../game-objects";
import { sceneNames } from "./scene-names";

/**
 * The main game.
 */
export class Play extends Scene {
    background: GameObjects.TileSprite;

    flaktulence: GameObjects.Group;
    flaktulenceSpawnNext: number = 0;

    level: number = 0;
    levelDisplay: LevelDisplay;

    pigs: GameObjects.Group;
    pigSpawnNext: number = 0;
    purpleDino: PurpleDino;
    // Pushing this into it's own class seems not to work....
    // purpleDinoSplosion: GameObjects.Particles.ParticleEmitter;
    purpleDinoSplosion: ConfettiEmitter;

    scoreKeeper: ScoreKeeper;

    constructor() {
        super({ key: sceneNames.play });
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

        this.make
            .graphics({ x: 0, y: 0 })
            .fillStyle(0xff0000, 1)
            .fillCircle(7, 7, 7)
            .generateTexture("flaktulence", 14, 14)
            .destroy();

        // FIXME: this is not working in the ConfettiEmitter.
        this.make
            .graphics({ x: 0, y: 0 })
            .fillStyle(0xffffff, 1)
            .generateTexture("confetti", 10, 10)
            .destroy();
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

        this.scoreKeeper = new ScoreKeeper(this, 32, 32);
        this.levelDisplay = new LevelDisplay(this);

        // Start background music.
        this.sound.stopAll();
        this.sound.play("bg-music", { volume: 0.25, loop: true });

        this.purpleDinoSplosion = new ConfettiEmitter(this);
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

        // Groups for watching flak.
        this.flaktulence = this.add.group();
        // This enforces a maximum on flatulence on the screen.
        for (var i = 0; i < 10; i++) {
            this.flaktulence.add(new Flaktulence(this));
        }
        this.flaktulence.runChildUpdate = true;
    }

    // DEBUG
    particleDebug = false;

    update(gameTime: number, delta: number) {
        // Before anything else, is the game still going?
        // if (this.scoreKeeper.lives <= 0) {
        //     this.scoreKeeper.save();
        //     this.scene.start(sceneNames.end);
        // }

        // DEBUG
        if (this.particleDebug === false) {
            // this.purpleDinoSplosion.setPosition(
            //     this.purpleDino.x,
            //     this.purpleDino.y,
            // );
            // this.purpleDinoSplosion.setVisible(true);
            // this.emitting = true;
            this.purpleDinoSplosion.spawn(this.purpleDino.x, this.purpleDino.y);
            this.particleDebug = true;
        }

        this.purpleDino.update();
        this.pigs.preUpdate(gameTime, delta);
        this.flaktulence.preUpdate(gameTime, delta);
        this.scoreKeeper.update();

        let backgroundScroll = new PhaserMath.Vector2(
            this.purpleDino.body.velocity.x,
            this.purpleDino.body.velocity.y,
        ).normalize();

        this.background.tilePositionX += backgroundScroll.x / 3;
        this.background.tilePositionY += backgroundScroll.y / 3;

        const currentLevel =
            Math.floor(
                this.scoreKeeper.score / this.scoreKeeper.scorePerLevel,
            ) + 1;
        if (currentLevel > this.level) {
            this.level = currentLevel;
            this.levelDisplay.spawn(this.level);
        }

        if (this.pigSpawnNext === 0) {
            // Initialize on first update.
            this.pigSpawnNext = gameTime + 800;
        } else if (
            this.pigSpawnNext < gameTime &&
            // Math.min(this.pigs.countLiving(), 10) < this.level
            Math.min(this.pigs.countActive(), 10) < 1
        ) {
            var nextPig: Pig = this.pigs.getFirstDead() as Pig;
            if (nextPig) {
                nextPig.spawn(this.purpleDino);
            }
            this.pigSpawnNext = gameTime + 800;
        }

        if (this.flaktulenceSpawnNext === 0) {
            // Initialize on first update.
            this.flaktulenceSpawnNext = gameTime + 750;
        } else if (
            this.flaktulenceSpawnNext < gameTime &&
            Math.min(this.flaktulence.countActive(), 10) < 10
        ) {
            let { velocity } = this.purpleDino.body;
            let direction = new PhaserMath.Vector2(
                velocity.x,
                velocity.y,
            ).normalize();

            if (direction.x || direction.y) {
                let flaktulence: Flaktulence =
                    this.flaktulence.getFirstDead(false);
                if (flaktulence) {
                    // Spawn behind the dino.
                    flaktulence.spawn(
                        this.purpleDino.x - direction.x * 40,
                        this.purpleDino.y - direction.y * 40,
                    );
                    this.sound.play("explosion-flaktulence");
                    this.flaktulenceSpawnNext = gameTime + 750;
                }
            }
        }
    }
}
