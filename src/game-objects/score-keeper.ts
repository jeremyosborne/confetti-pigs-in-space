import { GameObjects, Scene } from "phaser";

export class ScoreKeeper extends GameObjects.Text {
    lives: number;
    score: number;
    highScore: number;
    scorePerLevel: number;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "", { color: "#ffffff", font: "bold 16px Arial" });
        scene.add.existing(this);

        this.lives = 3;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem("highScore"), 10) || 0;
        this.scorePerLevel = 4;
    }

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
