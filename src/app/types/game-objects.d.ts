//
// We rely on these types being included via tsconfig.js.
//

declare global {
    /**
     * Game object provides an `invincible` flag that will
     * remove the object from collision detection.
     */
    interface IGameObjectInvincibility {
        /** If true, ignore collision detection. */
        invincible: boolean;
    }

    /**
     * Game object implements the `.live()` and `.kill()` methods.
     */
    interface IGameObjectLiveKill {
        /**
         * Idiomatic way to allow add the game object into the management cycle
         * of the game engine.
         *
         * @see spawn for a wrapper that provides setup logic for newly created
         * objects.
         */
        live(): void;
        /**
         * Idiomatic way to remove a game object from the management cycle of the game engine.
         */
        kill(): void;
    }

    /**
     * Game object implements the `.spawn()` metehod.
     *
     * `.spawn()` is used idiomatically to create an object within the game world and
     * add it to the life cycle of the game, as well as reset an object that may have
     * died (a la using up a life).
     */
    interface IGameObjectSpawn {
        /**
         * Spawn this particular object in the game.
         *
         * Idiomatically makes the object "live" if it is not currently live.
         *
         * Game objects are allowed to declare arguments specific for their needs.
         */
        spawn(...args: Array<any>): void;
    }

    /**
     * Game object implements `.update()` method.
     *
     * `.update()` is called per frame, or per update cycle, in the event loop, and
     * when we implement it, we use it to allow the game object to perform self
     * updates outside of the physics engine or other systems in the game.
     */
    interface IGameObjectUpdate {
        /**
         * Phaser 3 does not require an update method on game objects, but
         * does optionally allow it and provides support (via the Scene) for
         * objects that implement their own update.
         *
         * Different objects have different updates. This helps enforce which
         * type we expect.
         */
        update(gameTime: number, delta: number): void;
    }
}

export {};
