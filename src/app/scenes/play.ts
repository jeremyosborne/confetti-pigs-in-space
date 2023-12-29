import { GameObjects, Math as PhaserMath, Scene } from "phaser";
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
 * The main, playable portion fo the game.
 */
export class Play extends Scene {
    /** Background moves with the player, need to hold a reference to it. */
    background: GameObjects.TileSprite;

    /** Handle all of the explosions. */
    confettiEmitter: ConfettiEmitter;

    flaktulence: GameObjects.Group;
    flaktulenceSpawnNext: number = 0;

    /** XXX: We hold onto a local reference to the current level since the score keeper doesn't (yet) emit an event on level change. */
    level: number = 0;
    levelDisplay: LevelDisplay;

    pigs: GameObjects.Group;
    pigSpawnNext: number = 0;
    purpleDino: PurpleDino;

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
        this.load.image("confetti", "assets/images/confetti.png");
        this.load.image("flaktulence", "assets/images/flaktulence.png");
        this.load.image("pig", "assets/images/pig.png");
        this.load.image("purple-dino", "assets/images/purple-dino.png");
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

        this.confettiEmitter = new ConfettiEmitter(this);

        this.purpleDino = new PurpleDino(
            this,
            this.sys.game.canvas.width / 2,
            this.sys.game.canvas.height / 2,
        );

        this.pigs = this.add.group();
        // Enforce a maximum of pigs on the screen.
        for (let i = 0; i < 10; i++) {
            this.pigs.add(new Pig(this));
        }
        this.pigs.runChildUpdate = true;

        // Groups for watching flak.
        this.flaktulence = this.add.group();
        // Enforce a maximum of flatulence on the screen.
        for (var i = 0; i < 10; i++) {
            this.flaktulence.add(new Flaktulence(this));
        }
        this.flaktulence.runChildUpdate = true;

        //
        // Collision detection (begin).
        //
        // Detect when pigs run into the the flaktulence.
        this.physics.add.overlap(
            this.pigs,
            this.flaktulence,
            this.collidePigAndFlaktulence,
            null,
            this,
        );
        // Detect when the pig hits a player.
        this.physics.add.overlap(
            this.purpleDino,
            this.pigs,
            this.collidePurpleDinoAndPig,
            null,
            this,
        );
        // Detect when a careless player runs into the the flaktulence.
        this.physics.add.overlap(
            this.purpleDino,
            this.flaktulence,
            this.collidePurpleDinoAndFlaktulence,
            null,
            this,
        );
        //
        // Collision detection (end).
        //
    }

    collidePurpleDinoAndPig(purpleDino: PurpleDino, pig: Pig) {
        this.killPig(pig);
        this.killPurpleDino(purpleDino);
    }

    collidePurpleDinoAndFlaktulence(
        purpleDino: PurpleDino,
        flaktulence: Flaktulence,
    ) {
        this.killPurpleDino(purpleDino);
    }

    /** Handle pigs running into flaktulence. */
    collidePigAndFlaktulence(pig: Pig, flaktulence: Flaktulence) {
        this.killPig(pig);
    }

    /**
     * Handles the death of the player within the context of this stage, including
     * sound effects, explosion effect, and scoring.
     */
    killPurpleDino(purpleDino: PurpleDino) {
        // Kill the player and reset on death.
        // TODO: provide moment of invincibility, or enemy detection, or some level of forgiveness to prevent a death chain.
        this.scoreKeeper.decreaseLives();
        this.confettiEmitter.spawn(purpleDino.x, purpleDino.y);
        this.sound.play("explosion-dino");
        purpleDino.setPosition(
            this.sys.game.canvas.width / 2,
            this.sys.game.canvas.height / 2,
        );
    }

    /**
     * Handles the death of a pig within the context of this stage, including
     * sound effects, sprite clean up, explosion effect, and scoring.
     */
    killPig(pig: Pig) {
        this.confettiEmitter.spawn(pig.x, pig.y);
        this.sound.play("explosion-pig");
        pig.kill();
        // Destroyed pigs provide a point.
        this.scoreKeeper.addScore(1);
    }

    update(gameTime: number, delta: number) {
        // If the player has lost all of their lives, transition to the end state
        // and prevent anything else from happening.
        if (this.scoreKeeper.lives <= 0) {
            this.scoreKeeper.save();
            this.scene.start(sceneNames.end);
        }

        // Perform normal sprite updates, either directly or via group.
        this.purpleDino.update();
        this.scoreKeeper.update();
        this.pigs.preUpdate(gameTime, delta);
        this.flaktulence.preUpdate(gameTime, delta);

        // Move the background tiles relative to the player movement.
        let backgroundScroll = new PhaserMath.Vector2(
            this.purpleDino.body.velocity.x,
            this.purpleDino.body.velocity.y,
        ).normalize();
        this.background.tilePositionX += backgroundScroll.x / 3;
        this.background.tilePositionY += backgroundScroll.y / 3;

        // XXX: scorekeeper should probably emit the level change as an event.
        const currentLevel = this.scoreKeeper.currentLevel();
        if (currentLevel > this.level) {
            this.level = currentLevel;
            this.levelDisplay.spawn(this.level);
        }

        // Handle spawning of pigs relative to the level of the game
        // and the total number of pigs we allow on screen.
        if (this.pigSpawnNext === 0) {
            // Initialize on first update.
            this.pigSpawnNext = gameTime + 800;
        } else if (
            this.pigSpawnNext < gameTime &&
            Math.min(this.pigs.countActive(), 10) < this.level
        ) {
            var pig: Pig = this.pigs.getFirstDead() as Pig;
            if (pig) {
                pig.spawn(this.purpleDino);
            }
            this.pigSpawnNext = gameTime + 800;
        }

        // Handle the spawning of flaktulence behind the dino.
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
