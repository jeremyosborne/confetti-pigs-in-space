(function(exports) {
    


    /**
     * Function generator for running fn on all of groupa and groupb.
     * @private
     * @param fn {Function} The collision test function that contains the
     * logic to determine whether two objects have collided or not.
     * @param collisionCallback {String} The callback associated with this 
     * type of collision function, and that will be called if implemented
     * on the colliding objects.
     * @return {Function} Constructs a function that will check two groups
     * for collisions.
     */
    var collideall = function(fn, collisionCallback) {        
        // groupa and groupb are assumed to be arrays. Improve the iteration.
        return function(groupa, groupb) {
            // Loop counters.
            var a, b, collisionresult;
            // Entities to test for collisions.
            var ae, be;
            // Get the lengths up front to speed up iteration.
            var groupaLength = groupa.length;
            var groupbLength = groupb.length;
            
            for (a = 0; a < groupaLength; a++) {
                for (b = 0; b < groupbLength; b++) {
                    ae = groupa[a];
                    be = groupb[b];
                    // Do not collide test with ourselves.
                    if (ae !== be) {
                        collisionresult = fn(ae, be);
                        if (collisionresult) {
                            if (ae[collisionCallback]) {
                                ae[collisionCallback](be, collisionresult);
                            }
                            if (be[collisionCallback]) {
                                be[collisionCallback](ae, collisionresult);
                            }
                        }
                    }
                }
            }
        };
    };
    

    
    /** 
     * @class Methods to batch test for collisions between entities.
     * @singleton
     */
    var collisions = {};



    /**
     * Axis-aligned bounding-box collision between two arrays of entities. 
     *
     * Requirements:
     * - If an entity is collidable, entity implements 
     *     
     *     collide_rect() 
     * 
     * that returns an Array representing the collidable boundaries of the 
     * entity as [top, left, width, height].
     * 
     * - If an entity wishes to respond to a collision, entity implements
     * 
     *     collision_rect(entity, didCollide);
     * 
     * and it will be called with:
     * 
     * entity {Object} The entity that we have collided with.
     * didCollide {Boolean} The boolean value true will always be passed in
     * for this test.
     * 
     * @param a {Entity[]} Array of entities.
     * @param b {Entity[]} Array of entities that will be collided with those 
     * in group a. No self collisions are allowed.
     */
    collisions.rect = collideall(function(a, b) {
        var aaabb, baabb;
        if (a.collide_rect && b.collide_rect) {
            aaabb = a.collide_rect();
            baabb = b.collide_rect();
            
            return !(aaabb[0] > baabb[0] + baabb[2] || 
                baabb[0] > aaabb[0] + aaabb[2] || 
                aaabb[1] > baabb[1] + baabb[3] || 
                baabb[1] > aaabb[1] + aaabb[3]);
        }
    // Name of the callback.
    }, "collision_rect");



    /**
     * Axis-aligned bounding-box anti-collision between two arrays of 
     * entities. Things that do NOT collide will trigger a callback.
     *
     * Requirements:
     * - If an entity is collidable, entity implements 
     *     
     *     collide_rect() 
     * 
     * that returns an Array representing the collidable boundaries of the 
     * entity as [top, left, width, height].
     * 
     * - If an entity wishes to respond to a collision, entity implements
     * 
     *     collision_not_rect(entity, didNotCollide);
     * 
     * and it will be called with:
     * 
     * entity {Object} The entity that we have collided with.
     * didNotCollide {Boolean} true will always be passed in as an affirmative
     * that we did not collide.
     * 
     * @param a {Entity[]} Array of entities.
     * @param b {Entity[]} Array of entities that will be collided with those 
     * in group a. No self collisions are allowed.
     */
    collisions.not_rect = collideall(function(a, b) {
        var aaabb, baabb;
        if (a.collide_rect && b.collide_rect) {
            aaabb = a.collide_rect();
            baabb = b.collide_rect();
            
            return (aaabb[0] > baabb[0] + baabb[2] || 
                baabb[0] > aaabb[0] + aaabb[2] || 
                aaabb[1] > baabb[1] + baabb[3] || 
                baabb[1] > aaabb[1] + aaabb[3]);
        }
    }, "collision_not_rect");

    

    /**
     * Circle collision test between two groups of entities.
     *
     * Requirements:
     * - If an entity is collidable, entity implements 
     *     
     *     collide_circle() 
     * 
     * that returns an Array representing the collidable boundaries of the 
     * entity as [[centerx, centery], radius].
     * 
     * - If an entity wishes to respond to a collision, entity implements
     * 
     *     collision_circle(entity, didCollide);
     * 
     * and it will be called with:
     * 
     * entity {Object} The entity that we have collided with.
     * didCollide {Boolean} true will always be passed in as an affirmative
     * that we did not collide.
     * 
     * @param a {Entity[]} Array of entities.
     * @param b {Entity[]} Array of entities that will be collided with those 
     * in group a. No self collisions are allowed.
     */
    collisions.circle = collideall(function(a, b) {
        var ca, cb;
        
        if (b.collide_circle && a.collide_circle) {
            ca = a.collide_circle();
            cb = b.collide_circle();
            return Math.pow(ca[0][0] - cb[0][0],2) + 
                Math.pow(ca[0][1] - cb[0][1],2) < Math.pow(ca[1] + cb[1], 2);
        }
        
    }, "collision_circle");
    
    
 
    /*
        Helper function which tests whether a point is within a particular 
        polygon.
        @param pos is a point of the form [x, y]
        @param poly is a polygon defined as a list of points of the form 
        [[x1, y1], [x2, y2], ... [xn, yn]]
     */
    var pointInPoly = function(pos, poly) {
        /* 
           This code is patterned after [Franklin, 2000]
           http://www.geometryalgorithms.com/Archive/algorithm_0103/algorithm_0103.htm
           Tells us if the point is in this polygon 
         */
        var cn = 0
        var pts = poly.slice();
        pts.push([poly[0][0], poly[0][1]]);
        for (var i=0; i<poly.length; i++) {
            if (((pts[i][1] <= pos[1]) && (pts[i+1][1] > pos[1])) || 
                ((pts[i][1] > pos[1]) && (pts[i+1][1] <= pos[1]))) {
                if (pos[0] < pts[i][0] + (pos[1] - pts[i][1]) / 
                    (pts[i+1][1] - pts[i][1]) * (pts[i+1][0] - pts[i][0])) {
                    cn += 1
                }
            }
        }
        return cn % 2
    };
    
    /**
        Helper function which tests whether two lines intersect.
        @param l1 is a line of the form [[x1, y1], [x2, y2]]
        @param l2 is a line of the form [[x1, y1], [x2, y2]]    
    */
    var lineOnLine = function(l1, l2) {
        // Detects the intersection of two lines
        //   http://www.kevlindev.com/gui/math/intersection/Intersection.js
        var a1 = l1[0];
        var a2 = l1[1];
        var b1 = l2[0];
        var b2 = l2[1];
        var a1x = a1[0];
        var a1y = a1[1];
        var a2x = a2[0];
        var a2y = a2[1];
        var b1x = b1[0];
        var b1y = b1[1];
        var b2x = b2[0];
        var b2y = b2[1];
    
        var ua_t = (b2x - b1x) * (a1y - b1y) - (b2y - b1y) * (a1x - b1x);
        var ub_t = (a2x - a1x) * (a1y - b1y) - (a2y - a1y) * (a1x - b1x);
        var u_b  = (b2y - b1y) * (a2x - a1x) - (b2x - b1x) * (a2y - a1y);
        
        if (u_b) {
            var ua = ua_t / u_b;
            var ub = ub_t / u_b;
            
            if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
                // intersection
                return [a1x + ua * (a2x - a1x), a1y + ua * (a2y - a1y)];
            } else {
                return [];
            }
        } 
        else {
            if (ua_t == 0 || ub_t == 0) {
                // coincident
                //return [line2]
                //this will be caught elsewhere anyway
                return [(a2x + a1x) / 2, (a2y + a1y) / 2];
            } 
            else {
                // parallel
                return [];
            }
        }
    };
    
    /**
        Polygon collision tests whether two entities defined by polygons are 
        touching. Entities should have a get_collision_poly() method which 
        should return an array of lines of the form 
        [[x1, y1], [x2, y2], ... [xn, yn]].
        @param a {Entity[]} array of entities.
        @param b {Entity[]} array of entities to test against group a for
        collisions.
    */
    collisions.polys = collideall(function(a, b) {
        var e1, e2,
            l1, l2,
            compareline1, compareline2,
            linesresult;
            
        if (b.get_collision_poly && a.get_collision_poly) {
            e1 = a.get_collision_poly();
            e2 = b.get_collision_poly();
            for (l1=0; l1 < e1.length; l1++) {
                for (l2=0; l2 < e2.length; l2++) {
                    compareline1 = [e1[l1], e1[(l1 + 1) % e1.length]];
                    compareline2 = [e2[l2], e2[(l2 + 1) % e2.length]];
                    linesresult = lineOnLine(compareline1, compareline2);
                    if (linesresult.length) {
                        return [compareline1, compareline2, linesresult];
                    }
                }
            }
            // if we get here test if a point from each poly is inside the other
            return pointInPoly(e1[0], e2) || pointInPoly(e2[0], e1);
        }
    }, "collide_poly");


    // Export
    exports.collisions = collisions;

})(window);

