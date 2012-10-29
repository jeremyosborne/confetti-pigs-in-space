/*global klass:false, game:false*/
(function(exports) {
    
    

    // Our mouse tracker is not shown as part of the canvas, but we take
    // advantage of the update method to update our mouse coords.
    var MouseCoords = klass({
        init: function() {
            this.domX = document.querySelector("#pointer-coords .x");
            this.domY = document.querySelector("#pointer-coords .y");
        }, 
        mixin: {
            // The update method "draws" the coordinates into the DOM.
            update: function() {
                // Last mouse position within the game field.
                var pos = game.pointerPosition;
                this.domX.innerHTML = pos[0];
                this.domY.innerHTML = pos[1];
            }
        }
    });



    // Export.
    exports.MouseCoords = MouseCoords;
    
})(window);
