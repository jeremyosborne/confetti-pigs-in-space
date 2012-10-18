(function(exports) {
    


    // Targets will fly from left to right across the playing field.
    // Targets start at a random height.
    var Target = SimpleClass(function(y) {
        // Initial offset is off the screen.
        var x = this.x = -(this.width);
        this.y = y;
        // How fast does the target move (random).
        // Between 1 and 10 pixels per frame.
        this.speed = Math.floor(Math.random() * 10 + 1);
        // The relative shape of the polygon.
        this.poly = [
            [0, 0],
            [20, 10],
            [0, 20]
        ];
        // Set the initial location of the polygon.
        for (var i = 0; i < this.poly.length; i++) {
            this.poly[i][0] += x;
            this.poly[i][1] += y;            
        }
        
        // Increase targets that have appeared.
        score.increment("targetsAppeared");
    }, {
        // How wide and tall is the target (in pixels)?
        height: 20,
        width: 20,
        // Are we currently exploding?
        exploding: false,
        // Move the target from left to right across the game field.
        update: function(g) {
            this.x += this.speed;
            // The target only moves from left to right.
            for (var i = 0; i < this.poly.length; i++) {
                this.poly[i][0] += this.speed;
            }
            if (this.x > world.width) {
                // No longer a target, delete from the playfield.
                g.delEntity(this);
            }
            else if (this.exploding) {
                g.delEntity(this);
                // When the target explodes, add flak where the target was.
                g.addEntity(new Flak(this.x + this.width/2,
                    this.y + this.height/2));
            }
        },
        draw: function(c, g) {
            c.strokeStyle = "rgba(255, 255, 255, 1.0)";
            c.fillStyle = "rgba(255, 255, 255, 1.0)";
            // The polygon method will draw and fill the polygon according to
            // whatever style has been set on the canvas context.
            g.polygon(this.poly);
        },
        // Use a rectangular collision for the target.
        get_collision_aabb: function() {
            return [this.x, this.y, this.width, this.height];
        },
        // Targets respond to collisions.
        collide_aabb: function() {
            this.exploding = true;
            
            // Trigger an explosion sound.
            audio.playExplosion();
            
            // Increase targets we have shot down.
            score.increment("targetsDestroyed");
        }
    });
    


    // Export.
    exports.Target = Target;

})(window);
