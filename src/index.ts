//
// Code making use of Phase 3.70.0
// This code must be transpiled before being run.
//

import { Game, Scene, GameObjects } from "phaser";

class Title extends Scene {
    marqueeText: GameObjects.Text;
    titleText: GameObjects.Text;
    background: GameObjects.TileSprite;

    constructor() {
        super({ key: "Title" });
    }

    preload() {
        this.load.image("bg-space", "assets/images/starfield.png");
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

        this.titleText = this.add
            .text(
                this.sys.game.canvas.width / 2,
                this.sys.game.canvas.height / 2,
                "shootdown\n(the pigs in space)",
                {
                    color: "#ffffff",
                    font: "bold 42px Arial",
                    align: "center",
                },
            )
            .setOrigin(0.5);

        // Every game needs an (inane) story.
        // Scroll from right to left.
        this.marqueeText = this.add.text(
            this.sys.game.canvas.width + 20,
            this.sys.game.canvas.height - 48,
            [
                "What a night.",
                "Trapped in the mascot costume.",
                "Too much junk food.",
                "Jettisoned out the airlock into space.",
                "Confetti filled pigs in pursuit.",
                "Today your flatulence might save your life.",
                "Don't get caught in your own gas.",
                "Yes this is the plot.",
            ].join(" "),
            {
                color: "#ffffff",
                font: "bold 28px Arial",
            },
        );

        this.input.once(
            "pointerdown",
            function (this: Phaser.Scene) {
                this.scene.start("Play");
            },
            this,
        );
    }

    update() {
        this.marqueeText.x -= 3;

        this.background.tilePositionY += 0.5;
    }
}

class Play extends Scene {
    background: GameObjects.TileSprite;

    constructor() {
        super({ key: "Play" });
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

        this.input.once(
            "pointerdown",
            function (this: Phaser.Scene) {
                this.scene.start("Title");
            },
            this,
        );
    }

    update() {
        // var backgroundScroll = Point.normalize(
        //     this.purpleDino.body.velocity,
        // );
        // this.background.tilePosition.x += backgroundScroll.x / 3;
        // this.background.tilePosition.y += backgroundScroll.y / 3;
    }
}

const game = new Game({
    backgroundColor: "#000000",

    // Idiomatic "full browser" sizing in Phaser3.
    // TODO: this will window resize listener to reset when the window changes.
    width: window.innerWidth,
    height: window.innerHeight,

    // Selects by element `id`.
    parent: "game-container",
    scene: [Title, Play],
    type: Phaser.AUTO,
});
