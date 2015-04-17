(function() {
    /*
     * Check for features that we need in the browser, and fail
     * out if we fail these checks.
     */
    try {
        if (!document.querySelector) {
            throw new Error();
        }
        if (!document.createElement("canvas").getContext) {
            throw new Error();
        }
        if (!Array.prototype.filter) {
            throw new Error();
        }
    }
    catch(err) {
        alert("This game will likely not work on your browser. Please consider upgrading to a newer browser.");
    }
})();
