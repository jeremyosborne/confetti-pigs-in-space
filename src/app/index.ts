//
// Script loading
//
// Control loading screen, which we assume is present in the HTML,
// and turn off when our (quite large) game script has loaded.
//
document.addEventListener("DOMContentLoaded", () => {
    const loadingContainer = document.getElementById("pk-bios-loading");
    const gameContainer = document.getElementById("game-container");

    import("./game").then((game) => {
        loadingContainer.classList.add("loaded");
        gameContainer.classList.remove("hidden");
        game.main(); // Function to initialize and start your game
    });
});
