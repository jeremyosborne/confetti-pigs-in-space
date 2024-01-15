import { GameObjects, Scene } from "phaser";
import { clientCache } from "../client-cache";

/**
 * Manages the numbers of the game.
 */
export class ScoreKeeper extends GameObjects.Text implements IGameObjectUpdate {
    /** What is the current high score? */
    highScore: number;
    /** The current level of the game. */
    levelCurrent: number;
    /** How many live the player should have. */
    lives: number;
    /** Current score of the current game. */
    score: number;
    /** How many points are needed to progress to the next level. */
    scorePerLevel: number;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "", { color: "#ffffff", font: "bold 16px Arial" });
        scene.add.existing(this);

        /**
         * We initialize the game at level 0 to allow for an update event to
         * level 1 on game start, which will cause a display update.
         */
        this.levelCurrent = 0;
        this.lives = 3;
        this.score = 0;
        this.highScore = clientCache.get("highScore");
        this.scorePerLevel = 4;
    }

    /** Compute the current level of the game. */
    levelCalculate() {
        return Math.floor(this.score / this.scorePerLevel) + 1;
    }

    livesDecrease(n = 1) {
        this.lives -= n;
    }

    save() {
        clientCache.set("score", this.score);
        clientCache.set("highScore", Math.max(this.score, this.highScore));
    }

    scoreIncrease(n = 1) {
        this.score += n;
    }

    static scoreIsHigh() {
        const score = clientCache.get("score");
        const highScore = clientCache.get("highScore");
        return score >= highScore;
    }

    update() {
        const levelCalculated = this.levelCalculate();
        if (levelCalculated !== this.levelCurrent) {
            this.levelCurrent = levelCalculated;
            const updateEvent: UpdateEventDataLevelChange = {
                level: this.levelCurrent,
                type: "levelChange",
            };
            this.scene.events.emit("updateEvent", updateEvent);
        }

        this.setText(
            `Lives: ${this.lives}\nScore: ${this.score}\nHigh Score: ${this.highScore}`,
        );
    }
}
