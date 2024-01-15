import { ClientCacheLocalStorage } from "./common";

/**
 * Client side cache used in our game.
 */
export const clientCache = new ClientCacheLocalStorage(
    "confetti-pigs-in-space",
    {
        /**
         * Score of the current game, or most recently completed game.
         *
         * Cached to allow passing of data between scenes.
         */
        score: 0,
        /**
         * Currently recorded high score.
         */
        highScore: 0,
    },
);
