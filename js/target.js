/*global klass:false, game:false, Flak:false, Surface:false*/
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
            game.score.increment("targetsAppeared");
        }, 
        mixin: {
            // Relative shape of the object.
            surface: new Surface({
                height: 20,
                width: 20,
                shapes: [
                    {
                        "type": "polygon",
                        "conf": {
                            "strokeStyle": "rgba(255, 255, 255, 1.0)",
                            "fillStyle": "rgba(255, 255, 255, 1.0)",
                        },
                        "path": [
                            {"x": 0, "y": 0},
                            {"x": 20, "y": 10},
                            {"x": 0, "y": 20},
                            {"x": 0, "y": 0},
                        ]
                    }
                ],
            }),
            // How wide and tall is the target (in pixels)?
            height: 20,
            width: 20,
            // Are we currently exploding?
            exploding: false,
            // Move the target from left to right across the game field.
            update: function(g) {
                this.x += this.speed;
                if (this.x > game.world.width) {
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

                c.save();
                
                c.drawImage(this.surface.canvas, this.x, this.y);
                
                c.restore();
            },
            // Use a rectangular collision for the target.
            get_collision_aabb: function() {
                return [this.x, this.y, this.width, this.height];
            },
            /**
             * Called when the target collides with something (bounding box
             * intersects with another bounding box).
             * @param collided {Object} The object this bounding box has
             * collided with.
             */
            collide_aabb: function(collided) {
                if (collided instanceof Flak) {
                    this.exploding = true;
                    
                    // Trigger an explosion sound.
                    game.audio.playExplosion();
                    
                    // Increase targets we have shot down.
                    game.score.increment("targetsDestroyed");
                }
            }
        }
    });
    


    // Export.
    exports.Target = Target;

})(window);
