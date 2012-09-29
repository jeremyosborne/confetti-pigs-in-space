/*
 * @fileoverview A very simple class factory for JavaScript.
 */



/**
 * Clean up the construction of function objects performing the role of
 * a Class in JavaScript, without adding anything beyond what is already
 * supported by ECMAScript 3.
 * @param [constructor] {Function} The function that will act as the
 * constructor, or a falsey value if we want an empty function object to be
 * created and used.
 * @param [proto] {Object} An object that will be mapped to the function
 * prototype, or a falsey value if we don't want to add anything to the
 * prototype.
 * @param [ParentClass] {Function} Parent function (class) that we want to
 * inherit from.
 * @return {Function} Function object assumed to be usable as a class.
 */
var SimpleClass = function(constructor, proto, ParentClass) {
    var i,
        // Internal logging function. 
        log = function() {
            // Only log on browsers that support the console object.
            if (console && console.log) {
                console.log.apply(console, arguments)
            }
        };
    
    if (!constructor) {
        // Nicety, assume falsey means we'll use an empty constructor 
        // function.
        constructor = function() {};
    }
    else if (typeof constructor != "function"){
        log("SimpleClass Error: Probably didn't mean to use the following non-functional constructor:");
        log(constructor);
        throw new Error("SimpleClass Error: Probably didn't mean to use a non-functional constructor.")
    }

    if (typeof ParentClass == "function") {
        // Only inherit if we have something appropriate to inherit from.
        constructor.prototype = new ParentClass();
    }
    else if (ParentClass){
        log("SimpleClass Error: Probably didn't mean to inherit from the following non-function object:");
        log(ParentClass);
        throw new Error("SimpleClass Error: Probably didn't mean to inherit from a non-function object.")
    }
    
    if (proto) {
        // Shallow copy keys:values over to the constructor prototype.
        for (i in proto) {
            if (proto.hasOwnProperty(i)) {
                constructor.prototype[i] = proto[i];
            }
        }
    }
    
    return constructor;
};
