(function(exports) {
    
    
    
    /**
     * An in memory canvas element meant to be reused (via the canvas 
     * drawImage method) to repeatedly draw the same image into the game
     * world.
     */
    var Surface = klass({
        /**
         * Constructor for the surface.
         * @param args {Object} Associative array of configurations for the
         * surface.
         * @param args.height {Number} Integer number of pixels defining the 
         * height of this surface.
         * @param args.width {Number} Integer number of pixeld defining the 
         * width of this surface.
         * @param args.shapes {Object[]} Array of shape objects used to draw
         * on the canvas, organized in ascending order (in which they will
         * be drawn on the canvas).
         */
        init: function(args) {
            var i;
            var shapes;
            var context;
            
            if (!args.height || !args.width || !args.shapes) {
                console.error("Incorrectly initializing a surface. Missing arguments. Logging arguments to console.");
                console.error(arguments);
                throw new Error("Incorrectly initializing a surface. Missing arguments.");
            }

            // Build our canvas element to be used as our image.
            this.canvas = document.createElement("canvas");
            // Dimensions must always be set on the dom element.
            this.width = this.canvas.width = args.width;
            this.height = this.canvas.height = args.height;
            
            context = this.context = this.canvas.getContext("2d");
            
            // Draw our shapes onto our canvas.
            shapes = args.shapes;
            for (i = 0; i < shapes.length; i++) {
                context.save();
                this._configureContext(shapes[i].conf);
                this["_draw_"+shapes[i].type](shapes[i].path);
                context.restore();
            }
        },
        mixin: {
            /**
             * Points to the canvas element on which the surface is drawn.
             * @type {CanvasElement}
             */
            canvas: null,
            /**
             * Points to the canvas context with which to draw the surface.
             * @type {Canvas2dContext}
             */
            context: null,
            /**
             * The width of the surface (in pixels).
             * @type {Number}
             */
            width: null,
            /**
             * The height of the surface (in pixels).
             * @type {Number}
             */
            height: null,
            /**
             * Configure the context for a particular shape.
             * @param args {Object} Associative array of configuration 
             * settings (strokeStyle, fillStyle, etc.) to be set prior to
             * a draw routine.
             */
            _configureContext: function(args) {
                var c = this.context;
                var i;
                for (i in args) {
                    c[i] = args[i];
                }
            },
            /**
             * Draw a line on the context.
             * The first point is always considered a beginning of a new path
             * and is a moveTo. Lines are only stroked, never filled.
             * @param points {Object[]} An array of point objects in the
             * form of {x: n, y: n}.
             */
            _draw_line: function(points) {
                var c = this.context;
                var i;
                
                c.beginPath();
                
                c.moveTo(points[0].x, points[0].y);
                for (i = 1; i < points.length; i++) {
                    c.lineTo(points[i].x, points[i].y);
                }
                
                c.stroke();
            },
            /**
             * Draw a polygone on the context.
             * The first point is always considered a beginning of a new path
             * and is a moveTo. Polys are always stroked and filled. If you
             * want your polygon closed, make sure to include a last point
             * that ends on the starting point.
             * @param points {Object[]} An array of point objects in the
             * form of {x: n, y: n}.
             */
            _draw_polygon: function(points) {
                var c = this.context;
                var i;
                
                c.beginPath();
                
                c.moveTo(points[0].x, points[0].y);
                for (i = 1; i < points.length; i++) {
                    c.lineTo(points[i].x, points[i].y);
                }
                
                c.fill();
                c.stroke();
            },
        },
    });
    
    
    
    // Export.
    exports.Surface = Surface;

})(window);
