(function(exports) {

/**
 * Crosshair used to track the mouse targeting in the game.
 * @param game {Game} Needs access to the game object in order to instantiate.
 */
var Crosshair = function(game) {
    // Start outside of the canvas.
    this.x = -100;
    this.y = -100;
    
    // remember, gamejs is assbackwards with alpha.
    //this.alpha = 0;
    
    // Crosshair needs access to the Surface object.
    this.surface = new game.engine.Surface(20, 20);
    // surface, color, startPos, endPos, width
    game.engine.draw.line(this.surface, "#ffffff", [9, 0], [9, 3], 1);
    game.engine.draw.line(this.surface, "#ffffff", [9, 16], [9, 19], 1);
    game.engine.draw.line(this.surface, "#ffffff", [0, 9], [3, 9], 1);
    game.engine.draw.line(this.surface, "#ffffff", [16, 9], [19, 9], 1);
    
    this.isAlive = function() {
        // We're always alive.
        return true;
    };
    this.size = function() {
        return !this.surface ? null : this.surface.getSize();
    };
    this.upperLeft = function() {
        var size = this.size();
        if (size) {
            return [this.x-size[0]/2, this.y-size[1]/2];
        }
        else {
            return [this.x, this.y];
        }
    };
    /**
     * Called to update the data.
     * @param msDuration {Number} How many ms since our last update.
     * @return {Boolean} Whether we should be included in future updates
     * or garbage collected.
     */
    this.update = function(msDuration) {
        return this.isAlive();
    };
    /**
     * Called during the draw stage.
     * @param target {Surface} Where we draw ourselves onto.
     */
    this.draw = function(target) {
        if (this.surface) {
            //this.surface.setAlpha(this.alpha);
            target.blit(this.surface, this.upperLeft());
        }
    };
};



// Manages the game until the game is over.
exports.thegame = {
    "id": "thegame",
    "enter": function() {
        var game = this.game;
        var defaultFont = game.defaultFont;
        var TextOverlay = game.TextOverlay;
        
        // Initialize.
        this.gameText = new TextOverlay({
            alignx: "center",
            aligny: "center",
            text: "[placeholder for the game. click to end.]",
            font: defaultFont,
        });

        // Initialize our crosshair.       
        this.crosshair = new Crosshair(game);
        this.stageObjects.push(this.crosshair);
    },
    "heartbeat": function(msDuration) {
        var game = this.game;
        var display = game.display;
        var event = game.engine.event;
        var MOUSE_DOWN = event.MOUSE_DOWN;
        var MOUSE_MOTION = event.MOUSE_MOTION;
        var stageObjects = this.stageObjects;
        var crosshair = this.crosshair;

        event.get().forEach(function(e) {
            if (e.type == MOUSE_MOTION) {
                // Special treatment for the crosshair.
                crosshair.x = e.pos[0];
                crosshair.y = e.pos[1];
            }
            else if (e.type === MOUSE_DOWN) {
                // Transition.
                //game.activateStage("end");
            }
        });
        
        
        display.fill('#000000');
        stageObjects = stageObjects.filter(function(obj) {
            var isAlive = obj.update(msDuration);
            if (isAlive) {
                obj.draw(display);
            }
            return isAlive;
        });

    },
    // Created during initialization.
    gameText: null,
    // All of the objects managed during an update loop.
    // All objects promise to have an update function.
    stageObjects: [],
    // Special treatment for the crosshairs. Created during initialization.
    crossHair: null,
};



})(Stages);
