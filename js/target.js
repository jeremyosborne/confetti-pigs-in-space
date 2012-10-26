(function(exports) {
    


    // Targets will fly from left to right across the playing field.
    // Targets start at a random height.
    var Target = klass({
        init: function(y) {
            // Initial offset is off the screen.
            this.x = -(this.width);
            this.y = y;
            // How fast does the target move (random).
            // Between 1 and 10 pixels per frame.
            this.speed = Math.floor(Math.random() * 10 + 1);
            // Increase targets that have appeared.
            score.increment("targetsAppeared");
        }, 
        mixin: {
            // How wide and tall is the target (in pixels)?
            height: 20,
            width: 20,
            // Relative shape of the target drawn as traveling east.
            poly: [
                [0, 0],
                [20, 10],
                [0, 20]
            ],
            // Are we currently exploding?
            exploding: false,
            // Move the target from left to right across the game field.
            update: function(g) {
                this.x += this.speed;
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
                var i;
                var poly = this.poly;
                
                c.save();

                c.fillStyle = "rgba(255, 255, 255, 1.0)";
                c.strokeStyle = "rgba(255, 255, 255, 1.0)";
                c.beginPath();
                c.translate(this.x, this.y);
                c.moveTo(poly[0][0], poly[0][1]);
                for (i = 1; i < poly.length; i++) {
                    c.lineTo(poly[i][0], poly[i][1]);
                }
                c.fill();
                c.stroke();
                
                c.restore();
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
        }
    });
    


    // Export.
    exports.Target = Target;

})(window);
