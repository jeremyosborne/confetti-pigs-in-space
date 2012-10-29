/*global klass:false, game:false*/
(function(exports) {



    // Animates an explosion on the game field.
    var Flak = klass({
        init: function(x, y) {
            // The center point of the flak explosion.
            this.x = x;
            this.y = y;
            
            // Increase shots fired.
            game.score.increment("shotsFired");
        }, 
        mixin: {
            // The current (and initial) radius in pixels of the explosion.
            radius: 1,
            // The maximum radius in pixels of the explosion.
            maxRadius: 25,
            // Are we expanding or contracting?
            expanding: true,
            // Every frame, increase, or decrease, the size of the flak radius.
            update: function(g) {
                if (this.expanding) {
                    this.radius += 1;
                    if (this.radius >= this.maxRadius) {
                        this.expanding = false;
                    }
                }
                else {
                    // Expanding, and might disappear.
                    this.radius -= 1;
                    if (this.radius < 1) {
                        // Remove the spent flak
                        g.delEntity(this);
                    }
                }
            },
            // Draw our flak circle.
            draw: function(c, g) {
                // Modify the color based on radius.
                var green = 5 * this.radius;
                green = green < 255 ? green : 255;
                
                c.fillStyle = "rgba(255, "+ green+", 0, 0.7)";
                // Use default canvas drawing methods.
                c.beginPath();
                c.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
                c.fill();
            },
            // Use a rectangular collision for the explosion.
            get_collision_aabb: function() {
                // If our radius describes the circle, grab a collision bounding box 
                // that fits within our circle.
                // Bounding box returned is described from the upper left corner as
                // [x, y, w, h].
                var radius = this.radius;
                var radiusSquared = radius * radius;
                var diameter = radius*2;
                var offset = Math.sqrt(radiusSquared + radiusSquared);
                return [this.x-offset, this.y-offset, diameter, diameter];
            }
        }
    });
    
    
    // Export.
    exports.Flak = Flak;
    
})(window);
