//
// We rely on these types being included via tsconfig.js.
//

declare global {
    /** Indicates a level change in the game. */
    interface UpdateEventDataLevelChange {
        type: "levelChange";
        level: number;
    }
}

export {};
