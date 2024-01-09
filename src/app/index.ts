document.addEventListener("DOMContentLoaded", () => {
    const loadingContainer = document.getElementById("loading");
    const gameContainer = document.getElementById("game-container");

    // Dynamic import of your Phaser game
    import("./game").then((game) => {
        loadingContainer.classList.add("hidden");
        gameContainer.classList.remove("hidden");
        game.main(); // Function to initialize and start your game
    });
});
