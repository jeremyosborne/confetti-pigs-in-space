shootdown
=========

A silly little game for my own spare time coding and fun. also an experiment documenting my organic coding procedures, which aren't always pretty.



Building the Code
-----------------
* Install [Node.js](http://nodejs.org/download/).
* From the commandline install [Grunt](http://gruntjs.com/getting-started):

        npm install -g grunt-cli@0.1.6

* Install other build tools:

        npm install
        
* Build the code:

        grunt build

* Load up the game in a browser by opening up index.html.
    * Recommended: [Google Chrome](http://www.google.com/chrome).
    * Purposely Unsupported Browsers: IE 6-8, and other old browsers.
* Click to shoot things.



TODO
----
* Implement requestAnimationFrame to maybe help speed things up.
* Looks like the CSS3 animation, the way I'm doing it, is killing the browser (probably the radial gradients and alpha transparency?).
* Tighten up the game and make the single player experience a good one.
* BUG: There seems to be a sound problem on Firefox but only when serving up the files from my home site?
