/** Asset identifiers, passed to phaser to reference pre-loaded assets. */
export enum AssetNames {
    "bgMusic" = "bgMusic",
    "explosionFlaktulence" = "explosionFlaktulence",
    "explosionPig" = "explosionPig",
    "explosionDino" = "explosionDino",

    "bgSpace" = "bgSpace",
    "confetti" = "confetti",
    "flaktulence" = "flaktulence",
    "pig" = "pig",
    "purpleDino" = "purpleDino",
}

/**
 * Assets that will be preloaded before the game begins.
 *
 * @see AssetLoader
 */
export const assetConfigs: Record<AssetNames, AssetLoaderConfig> = {
    //
    // Audio
    //
    bgMusic: {
        type: "audio",
        url: "assets/music/vamps_-_Borderline_(Fantastic_Vamps_8-Bit_Mix)_shortened.mp3",
    },
    explosionFlaktulence: {
        type: "audio",
        url: "assets/sounds/flaktulence.wav",
    },
    explosionPig: { type: "audio", url: "assets/sounds/explosion.wav" },
    explosionDino: { type: "audio", url: "assets/sounds/explosion2.wav" },

    //
    // Images
    //
    bgSpace: { type: "image", url: "assets/images/starfield.png" },
    confetti: { type: "image", url: "assets/images/confetti.png" },
    flaktulence: { type: "image", url: "assets/images/flaktulence.png" },
    pig: { type: "image", url: "assets/images/pig.png" },
    purpleDino: { type: "image", url: "assets/images/purple-dino.png" },
} as const;
