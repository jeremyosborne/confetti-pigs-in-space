(function(exports) {
    
    
    
    var Heading = klass({
        /**
         * Builds a heading object.
         * 
         * Choices for contructing a heading object:
         * 
         * one argument {Number} degrees using polar coordinates, where
         * 0 degrees is a heading of right across the playing field, 90
         * is up across the playing field.
         * 
         * @constructs
         */
        init: function(deg) {
            
            // Need radians in JavaScript.
            var rad = (deg/180)*Math.PI;
            
            // Save heading info.
            this.angleDeg = deg;
            this.angleRad = rad;

            // Decompose into x and y direction components.
            // And since these translate into device coordinate directions,
            // reverse the sign for y.
            this.x = Math.cos(rad);
            this.y = -Math.sin(rad);
        },
        mixin: {
            /** @lends Heading.prototype */
            /**
             * The polar angle that describes this heading, in degrees.
             * @type {Number}
             */
            angleDeg: null,
            /**
             * The polar angle that describes this heading, in radians.
             * @type {Number}
             */
            angleRad: null,
            /**
             * The portion of the heading contributing to the x direction
             * (+ for "right", - for "left").
             * @type {Number}
             */
            x: null,
            /**
             * The portion of the heading contributing to the y direction
             * (+ for "up", - for "down").
             * @type {Number}
             */
            y: null,
        }
    });
    


    // Export.
    exports.Heading = Heading;

})(window);
