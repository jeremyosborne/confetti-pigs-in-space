import { GameObjects, Scene } from "phaser";

/**
 * Manages the numbers of the game.
 */
export class ScoreKeeper extends GameObjects.Text {
    /** What is the current high score? */
    highScore: number;
    /** How many live the player should have. */
    lives: number;
    /** Current score of the current game. */
    score: number;
    /** How many points are needed to progress to the next level. */
    scorePerLevel: number;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "", { color: "#ffffff", font: "bold 16px Arial" });
        scene.add.existing(this);

        this.lives = 3;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem("highScore"), 10) || 0;
        this.scorePerLevel = 4;
    }

    /** Compute the current level of the game. */
    currentLevel() {
        return Math.floor(this.score / this.scorePerLevel) + 1;
    }

    addScore(n: number) {
        this.score += n;
    }

    decreaseLives() {
        this.lives -= 1;
    }

    save() {
        localStorage.setItem("score", this.score.toString());
        localStorage.setItem(
            "highScore",
            Math.max(this.score, this.highScore).toString(),
        );
    }

    update() {
        this.setText(
            `Lives: ${this.lives}\nScore: ${this.score}\nHigh Score: ${this.highScore}`,
        );
    }

    static savedScoreIsHigh() {
        let score = parseInt(localStorage.getItem("score"), 10);
        let highScore = parseInt(localStorage.getItem("highScore"), 10);
        return score >= highScore;
    }
}
