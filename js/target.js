/*global Flak:false, Surface:false*/
(function(exports) {
    
    
    
    var Target = klass({
        /**
         * Build a target to shoot down.
         * @constructs
         */
        init: function(y) {
            
            // Initial offset is not quite off screen.
            this.x = -(this.width + 1);
            this.y = y;
            
            // How fast does the target move (random).
            // Between 1 and 10 pixels per frame.
            this.speed = Math.floor(Math.random() * 10 + 1);
            
            // Increase targets that have appeared.
            game.score.increment("targetsAppeared");
        },
        mixin: {
            /** @lends Target.prototype */
            /**
             * Position of this object, as x distance of pixels from the
             * upper left corner of the game field.
             * @type {Number}
             */
            x: null,
            /**
             * Position of this object, as y distance of pixels from the
             * upper left corner of the game field.
             * @type {Number}
             */
            y: null,
            /**
             * Number of pixels that will be traveled, per frame, in the
             * heading of this element.
             * @type {Number}
             */
            speed: null,
            /**
             * Heading of the target as a unit vector.
             * @type {Heading}
             */
            heading: null,
            /**
             * Targets are drawn via Canvas surfaces.
             * @type {Surface}
             */
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
            /**
             * Height of this target in pixels.
             * @type {Number}
             */
            height: 20,
            /**
             * Width of this target in pixels.
             * @type {Number}
             */
            width: 20,
            /**
             * Is the target exploding?
             * @type {Boolean}
             */
            exploding: false,
            /**
             * Implementation of the .update() jsGameSoup inteface method. 
             * Called before the .draw() method of each frame.
             * @param g {jsGameSoup} The jsGameSoup object is passed to the
             * update method on each call.
             */
            update: function(g) {
                this.x += this.speed;
                
                if (this.exploding) {
                    g.delEntity(this);
                    // When the target explodes, add flak where the target was.
                    g.addEntity(
                        new Flak(this.x + this.width/2, this.y + this.height/2)
                    );
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
            },
            /**
             * Called when the target does not collide with something during
             * a negated collision test.
             */
            collide_not_aabb: function() {
                // We're outside the world, we're done.
                game.delEntity(this);
            },
        }
    });
    


    // Export.
    exports.Target = Target;

})(window);