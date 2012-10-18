(function(exports) {
    


    // Use a crosshair to track the mouse around the game.
    var Crosshair = SimpleClass(function() {
        // Only when we mouse over show the crosshair.
        // Coordinates are always relative to the canvas.
        this.x = undefined;
        this.y = undefined;
        // Radial distance of each hand of the crosshair (in pixels).
        this.radius = 10;
    }, {
        // Called every frame to grab the coordinates of the cross hair.
        update: function() {
            // Last mouse position within the game field.
            var pos = game.pointerPosition;
            this.x = pos[0];
            this.y = pos[1];
        },
        // Called every frame to redraw the crosshair on the game field.
        draw: function(c) {
            var x = this.x,
                y = this.y,
                radius = this.radius;
            // Use canvas methods directly to draw.
            c.strokeStyle = 'rgba(255, 255, 255, 1.0)';
            
            c.beginPath();
            // Vertical line.
            c.moveTo(x, y-radius);
            c.lineTo(x, y+radius);
            // Horizontal line.
            c.moveTo(x-radius, y);
            c.lineTo(x+radius, y);
            c.stroke();
        }        
    });



    // Export.
    exports.Crosshair = Crosshair;

})(window);
