/*
 * @fileoverview A very simple "class" factory for JavaScript.
 */



/**
 * Simple "class" factory.
 * 
 * Cleans up the construction of function objects performing the role of
 * a Class in JavaScript, without adding anything beyond what is already
 * supported by ECMAScript 3.
 * @param [config] {Object} Arguments as associative array.
 * @param [config.init] {Function} The function that will act as the
 * constructor, or a falsey value if we want an empty function object to be
 * created and used.
 * @param [config.parent] {Function} Parent function (class) that we 
 * want to inherit from.
 * @param [config.mixin] {Object|Object[]} A singular object or an array
 * of objects that conform to the mixin paradigm as can be represented in
 * JavaScript. If an array, each object in the array will have its own 
 * properties and values shallow-copied onto he prototype, in the ascending 
 * order declared in the array.
 * If a non-array object, the object will have its own properties and values 
 * shallow-copied onto the prototype.
 * @return {Function} Function object assumed to be usable as a class/type.
 */
var klass = function(config) {
    var i,
        p,
        mixin,
        // our resulting "class" or "type" function.
        klass,
        // Internal logging function. 
        log = function() {
            // Only log on browsers that support the console object.
            if (console && console.log) {
                console.log.apply(console, arguments)
            }
        },
        // Less work to just declare this function here as is.
        isArray = function(potentialArray) {
            return Object.prototype.toString.call(potentialArray) === '[object Array]';
        };
        
    // Normalize.
    config = config || {};
    
    
    
    if (!config.init) {
        // Nicety, assume falsey means we'll use an empty constructor 
        // function.
        klass = function() {};
    }
    else if (typeof config.init != "function"){
        log("SimpleClass Error: Probably didn't mean to use the following non-functional constructor:");
        log(config.init);
        throw new Error("SimpleClass Error: Probably didn't mean to use a non-functional constructor.")
    }
    else if (config.init) {
        // Here we're a function.
        klass = config.init;
    }



    if (typeof config.parent == "function") {
        // Only inherit if we have something appropriate to inherit from.
        klass.prototype = new config.parent();
    }
    else if (config.parent){
        log("SimpleClass Error: Probably didn't mean to inherit from the following non-function object:");
        log(config.parent);
        throw new Error("SimpleClass Error: Probably didn't mean to inherit from a non-function object.")
    }
    
    
    
    if (isArray(config.mixin)) {
        // Shallow copy keys:values over to the constructor prototype
        // from each object in the array.
        for (i = 0; i < config.mixin.length; i++) {
            mixin = config.mixin[i];
            for (p in mixin) {
                if (mixin.hasOwnProperty(p)) {
                    klass.prototype[p] = mixin[p];
                }
            }
        }
    }
    else if (config.mixin) {
        // Shallow copy keys:values over to the constructor prototype.
        mixin = config.mixin;
        for (p in mixin) {
            if (mixin.hasOwnProperty(p)) {
                klass.prototype[p] = config.mixin[p];
            }
        }
    }
    
    
    
    return klass;
};
