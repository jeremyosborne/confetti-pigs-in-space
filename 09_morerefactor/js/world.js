(function(exports) {
        
        
        
    // The "world" provides the background, as well as the tracking area
    // for the mouse.
    var World = SimpleClass(function() {
        var canvas = document.querySelector("#game");
        this.width = canvas.width;
        this.height = canvas.height;
    }, {
        // Every frame the world is responsible for clearing the canvas of
        // any previous drawings.
        draw: function(c, g) {
            g.clear();
            g.background('rgba(100, 100, 100, 1.0)');
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
        // In the update of the world, check for collisions.
        update: function(g) {
            var targets = g.entities.filter(function(entity) {
                return entity instanceof Target;
            });
            var flak = g.entities.filter(function(entity) {
                return entity instanceof Flak;
            });
            collide.aabb(targets, flak);
        }
    });


    // Export.
    exports.World = World;

})(window);
