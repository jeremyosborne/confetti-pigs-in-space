import { AssetNames } from "../assets";
import { GameObjects, Math as PhaserMath, Scene } from "phaser";
import {
    ConfettiEmitter,
    Flaktulence,
    LevelDisplay,
    Pig,
    PurpleDino,
    ScoreKeeper,
    Starfield,
} from "../game-objects";
import { sceneNames } from "./scene-names";

/**
 * The main, playable portion fo the game.
 */
export class Play extends Scene {
    /** Background moves with the player, need to hold a reference to it. */
    background: Starfield;

    /** Handle all of the explosions. */
    confettiEmitter: ConfettiEmitter;

    /** Used to shoot down the pigs, a la missile command. */
    flaktulence: GameObjects.Group;
    flaktulenceSpawnNext: number = 0;

    levelDisplay: LevelDisplay;

    /** The bad guys. */
    pigs: GameObjects.Group;
    pigSpawnNext: number = 0;

    /** The protagonist. */
    purpleDino: PurpleDino;

    scoreKeeper: ScoreKeeper;

    /** Scene specific events handled within the update cycle of the scene. */
    updateEventQueue: Array<UpdateEventDataLevelChange> = [];

    constructor() {
        super({ key: sceneNames.play });
    }

    /** Handle the updateEvents. */
    updateEventCallback(eventData: UpdateEventDataLevelChange) {
        if (eventData.type === "levelChange") {
            this.updateEventQueue.push(eventData);
        } else {
            console.warn(
                "unknown event data passed to updateEventCallback:",
                eventData,
            );
        }
    }

    create() {
        /** Game objects can push events into the update event queue via this listener. */
        this.events.addListener("updateEvent", this.updateEventCallback, this);

        this.background = new Starfield(this);

        this.scoreKeeper = new ScoreKeeper(this, 32, 32);
        this.levelDisplay = new LevelDisplay(this);

        // Start background music.
        this.sound.stopAll();
        this.sound.play(AssetNames.bgMusic, { volume: 0.25, loop: true });

        this.confettiEmitter = new ConfettiEmitter(this);

        this.purpleDino = new PurpleDino(this);

        this.pigs = this.add.group({
            classType: Pig,
            maxSize: 10,
            runChildUpdate: true,
        });

        this.flaktulence = this.add.group({
            classType: Flaktulence,
            maxSize: 10,
            runChildUpdate: true,
        });

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
        if (!this.purpleDino.invincible) {
            this.confettiEmitter.spawn(purpleDino.x, purpleDino.y);
            this.sound.play(AssetNames.explosionDino);
            this.purpleDino.kill();
            this.scoreKeeper.livesDecrease();
        }
    }

    /**
     * Handles the death of a pig within the context of this stage, including
     * sound effects, sprite clean up, explosion effect, and scoring.
     */
    killPig(pig: Pig) {
        this.confettiEmitter.spawn(pig.x, pig.y);
        this.sound.play(AssetNames.explosionPig);
        pig.kill();
        // Destroyed pigs provide a point.
        this.scoreKeeper.scoreIncrease(1);
    }

    update(gameTime: number, delta: number) {
        // If the player has lost all of their lives, transition to the end state
        // and prevent anything else from happening.
        if (this.scoreKeeper.lives <= 0) {
            this.scoreKeeper.save();
            this.scene.start(sceneNames.end);
            return;
        }

        // If we still have lives, and the purple dino is "dead", respawn.
        if (this.purpleDino.active === false) {
            this.purpleDino.spawn();
        }

        // The event queue should be short.
        do {
            const event = this.updateEventQueue.shift();
            if (!event) {
                continue;
            }
            if (event.type === "levelChange") {
                this.levelDisplay.spawn(event.level);
            }
        } while (this.updateEventQueue.length);

        // Perform normal sprite updates, either directly or via group.
        this.background.update();
        this.purpleDino.update();
        this.scoreKeeper.update();
        this.pigs.preUpdate(gameTime, delta);
        this.flaktulence.preUpdate(gameTime, delta);

        // Handle spawning of pigs relative to the level of the game
        // and the total number of pigs we allow on screen.
        if (this.pigSpawnNext === 0) {
            // Initialize on first update.
            this.pigSpawnNext = gameTime + 800;
        } else if (
            this.pigSpawnNext < gameTime &&
            Math.min(this.pigs.countActive(), 10) <
                this.scoreKeeper.levelCurrent
        ) {
            var pig: Pig = this.pigs.get() as Pig;
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
                    this.flaktulence.get() as Flaktulence;
                if (flaktulence) {
                    // Spawn behind the dino.
                    flaktulence.spawn(
                        this.purpleDino.x - direction.x * 40,
                        this.purpleDino.y - direction.y * 40,
                    );
                    this.sound.play(AssetNames.explosionFlaktulence);
                    this.flaktulenceSpawnNext = gameTime + 750;
                }
            }
        }
    }
}
