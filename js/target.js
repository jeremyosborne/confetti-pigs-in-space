/*global Flak:false, Surface:false, Heading:false*/
(function(exports) {
    
    
    
    var Target = klass({
        /**
         * Build a target to shoot down.
         * @param [config] {Object} Associative array of arguments.
         * @param [config.x=0] {Number} Starting x-pixel coordinate.
         * @param [config.y=0] {Number} Starting y-pixel coordinate.
         * @param [config.heading=0] {Number} Degrees heading the target
         * is going to travel in.
         * @param [config.speed=1] {Number} How many pixels per frame does
         * this target move.
         * @constructs
         */
        init: function(config) {
            config = config || {};
            
            // Initialize starting location of the target.
            this.x = config.x || 0;
            this.y = config.y || 0;
            
            // Set the direction of travel.
            this.heading = new Heading(config.heading || 0);
            
            // How fast does the target move.
            this.speed = config.speed || 1;
                        
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
                this.x += this.heading.x * this.speed;
                this.y += this.heading.y * this.speed;
                
                if (this.exploding) {
                    g.delEntity(this);
                    // When the target explodes, add flak where the target was.
                    g.addEntity(
                        new Flak(this.x + this.width/2, this.y + this.height/2)
                    );
                }
            },
            draw: function(c, g) {
                c.save();
                
                c.translate(this.x+this.width/2, this.y+this.height/2);
                // NOTE: positive radians is clockwise, negative is counter
                // clockwise. Opposite of what is being used in the heading
                // where positive is counter clockwise.
                c.rotate(-this.heading.angleRad);
                c.drawImage(this.surface.canvas, -this.width/2, -this.height/2, this.width, this.height);
                
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
