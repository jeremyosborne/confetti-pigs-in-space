import { AssetNames } from "../assets";
import { GameObjects, Physics, Scene, Tweens } from "phaser";

/**
 * The purple dino is the main player.
 */
export class PurpleDino
    extends GameObjects.Sprite
    implements
        IGameObjectInvincibility,
        IGameObjectLiveKill,
        IGameObjectSpawn,
        IGameObjectUpdate
{
    body: Physics.Arcade.Body;

    invincible = false;
    invincibleTween: Tweens.Tween;

    constructor(scene: Scene, x = 0, y = 0) {
        // Inversion of control since the sprites and the scenes need each other,
        // and so we isolate set some scene specific things within the sprite
        // since the sprite also needs to be configured with the scene.
        // Not sure whether I actually like this method or not, but time will tell.
        super(scene, x, y, AssetNames.purpleDino);
        scene.add.existing(this);
        // For collision detection.
        scene.physics.add.existing(this);

        this.invincibleTween = this.scene.tweens.add({
            targets: this,
            alpha: { from: 0.3, to: 1 },
            ease: "Linear",
            duration: 1000,
            yoyo: true,
            repeat: -1,
        });
        this.invincibleTween.pause();

        // Shrink the body size to make collisions a bit more forgiving.
        this.body.setSize(this.width - 6, this.height - 6);
        // Like most sprites, the player also starts off dead.
        this.kill();
    }

    /** Turn off invincibility. */
    invincibilityOff() {
        this.invincible = false;
        // Depending on where the tween ends, we need to reset our transparency.
        this.alpha = 1;
        this.invincibleTween.pause();
    }

    live() {
        this.setActive(true);
        this.setVisible(true);
        this.body.enable = true;
    }

    kill() {
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
    }

    spawn() {
        this.live();
        // A moment of invincibility when we spawn.
        this.invincible = true;
        this.invincibleTween.resume();
        this.scene.time.addEvent({
            delay: 3000,
            callback: this.invincibilityOff,
            callbackScope: this,
        });

        // We always spawn in the middle of the screen, which might
        // be filled with flaktulence, hence the invincibility.
        this.setPosition(
            this.scene.sys.game.canvas.width / 2,
            this.scene.sys.game.canvas.height / 2,
        );
    }

    update() {
        const { activePointer } = this.scene.input;
        const spriteToPointerDistance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            activePointer.x,
            activePointer.y,
        );
        // Dino wants to follow the pointer.
        this.rotation = this.scene.physics.moveToObject(
            this,
            activePointer,
            // The pointer needs to be a certain distance from the dino
            // for it to move, otherwise it will just rotate and face
            // the pointer.
            spriteToPointerDistance > 30 ? 150 : 0,
        );
    }
}
