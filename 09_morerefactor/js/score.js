(function(exports) {
    
    
    
    // Keep track of score in the game.
    var Score = klass({
        init: function() {
            this.shotsFired = 0;
            this.targetsAppeared = 0;
            this.targetsDestroyed = 0;
            // Links to on screen display of score.
            this.display = {
                shotsFired: document.querySelector("#score .shots-fired"),
                targetsAppeared: document.querySelector("#score .targets-appeared"),
                targetsDestroyed: document.querySelector("#score .targets-destroyed"),
                net: document.querySelector("#score .net")
            }
        }, 
        mixin: {
            // Display the score on the page.
            update: function() {
                this.display.shotsFired.innerHTML = this.shotsFired;
                this.display.targetsAppeared.innerHTML = this.targetsAppeared;
                this.display.targetsDestroyed.innerHTML = this.targetsDestroyed;
                
                this.display.net.innerHTML = -this.shotsFired - this.targetsAppeared + 5*this.targetsDestroyed;
            },
            // Increments a particular score
            increment: function(tallyName) {
                this[tallyName] += 1;
            }
        }
    });
    
    
    
    // Export.
    exports.Score = Score;
    
})(window);
