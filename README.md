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
* Do collisions the jsGameSoup way.
    * Update the interface for batch polygon collisions in collisions.js.
    * Add the jsGameSoup collisions to dasspiel.
    * Add some tests to help ensure collisions work.
* Credit the authors of jsGameSoup and gamejs in dasspiel.
* Add in target creation.
* Add max number of targets allowed on screen at a time.
* Add collisions back in.
* Remove targets when they leave the playing field.
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



Acknowledgements
----------------
Even though I have a habit of modifying and changing code, the following are acknowledgements (listed in alphabetical order) to authors whose code I have taken and integrated with this code example.

* [Chris McCormick](http://mccormickit.com/) and [jsGameSoup](http://jsgamesoup.net/). Code I am using from jsGameSoup:
    * collisions.js
* [Simon Oberhammer](https://github.com/oberhamsi) and [gamejs](https://github.com/oberhamsi/gamejs). I am using a lot of gamejs, in particular the Surface object which is a nice wrapper for canvas overlays.

The licenses from these libraries are included in the LICENSE.txt file if a license was available. If I have incorrectly attributed anyone, please let me know and I'll correct it.
