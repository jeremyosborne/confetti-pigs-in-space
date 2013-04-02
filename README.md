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

* Load up the game in a browser by opening up `index.html`.
    * Recommended: [Google Chrome](http://www.google.com/chrome).
    * Purposely Unsupported Browsers: IE 6-8, and probably other old browsers.
* Click to shoot things.



TODO
----
* Add in target creation.
* Add max number of targets allowed on screen at a time.
* Add collisions back in.
* Remove targets when they leave the playing field.
* Do collisions the jsGameSoup way.
    * Add the jsGameSoup collisions to dasspiel.
* Add particles for exploding targets.
* Really need alignable multiline text.
* Separate scoring from object constructors (Target and Flak).
* BUG: There seems to be a sound problem on Firefox but only when serving up the files from my home site?
* BUG: TextOverlay with an empty string fails, but it seems the failure is due to gamejs.



Notes
-----
* Updated to grunt version 0.4.
* Embrace markdown.
* Convert to my wrapper game library.
* Break the game into separate stages (which are roughly game states).
* Game timer added.
