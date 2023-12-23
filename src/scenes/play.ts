import { Scene, GameObjects } from "phaser";

export class Play extends Scene {
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
