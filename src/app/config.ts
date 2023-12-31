/**
 * A typed version of acceptable configuration values passed into our app,
 * presumably via process.env.
 *
 * To keep things simple, in most cases we keep most things as a string
 * value (as all env vars are strings by nature) and in cases where the
 * string value is not provided, we use an empty string to denote as
 * not set. Any flag that acts as a boolean must be passed with some
 * actual value (like `PHASER_PHYSICS_ARCADE_DEBUG=1`) for it to be converted to a boolean.
 *
 * Only application appropriate env vars are included here. Build/compile
 * time env vars are not.
 */
export type Configuration = {
    /** (Optional) Manages the debug setting for Phaser's arcade physics. */
    PHASER_PHYSICS_ARCADE_DEBUG: boolean;
};

// This application goes through a build process and will not ever receive
// an update to the process.env object. Cache the object on first call.
let configuration: Configuration | undefined = undefined;

/**
 * Generate and return a typed configuration object (helps with refactoring env vars wne we need to).
 */
export const config = (): Configuration => {
    if (!configuration) {
        configuration = {
            PHASER_PHYSICS_ARCADE_DEBUG:
                !!process.env.PHASER_PHYSICS_ARCADE_DEBUG || false,
        };
    }
    return configuration;
};
