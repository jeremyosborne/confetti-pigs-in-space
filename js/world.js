/*global Flak:false, Target:false, collide:false*/
(function(exports) {
        
        
        
    // The "world" provides the background, as well as the tracking area
    // for the mouse.
    var World = klass({
        init: function() {
            var canvas = document.querySelector("#game");
            this.width = canvas.width;
            this.height = canvas.height;
        }, 
        mixin: {
            // Every frame the world is responsible for clearing the canvas of
            // any previous drawings.
            draw: function(c, g) {
                g.clear();
                g.background('rgba(100, 100, 100, 0.0)');
            },
            // To detect mouseclicks in the world, define the bounding box of the
            // world and listen to the click event.
            pointerBox: function() {
                return [0, 0, this.width, this.height];
            },
            pointerDown: function() {
                // Add a new flak explosion everytime we mouse down.
                // The Flak object will manage its own animation, and eventual
                // removal from the map.
                game.addEntity(new Flak(game.pointerPosition[0], game.pointerPosition[1]));
            },
            // For testing if things are within the viewable world or not.
            get_collision_aabb: function() {
                return [0, 0, this.width, this.height];
            },
            update: function(g) {
                // Check for collisions between targets and explosions.
                var targets = g.entities.filter(function(entity) {
                    return entity instanceof Target;
                });
                var flak = g.entities.filter(function(entity) {
                    return entity instanceof Flak;
                });
                collide.aabb(targets, flak);
                
                // Check for targets that have traveled outside of the play
                // area.
                collide.not_aabb(targets, [this]);
            }
        }
    });


    // Export.
    exports.World = World;

})(window);
