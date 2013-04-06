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

* If you are going to tweak the code and test things out, recommend:

        grunt watch

* Load up the game in a browser by opening up `index.html`.
    * Recommended: [Google Chrome](http://www.google.com/chrome).
    * Purposely Unsupported Browsers: IE 6-8, and likely other old browsers.
* Click to shoot things.



TODO
----
* Turn the game timer back up to 60 seconds.
* Orient the flying pig objects correctly (and include them correctly).
* Refactor again (need to somewhat normalize how I define entities).



Notes
-----
* Updated to grunt version 0.4.
* Embrace markdown.
* Convert to my wrapper game library dasspiel.
* Break the game into separate stages (which are essentially overall game states).
* Game timer added.
* Added a max number of targets on screen at a time.
* Calculate a single final score.
* Add particles upon explosion of targets.
* Add sound on any explosion, flak or target (add the sound in the flak constructor).
* Allow replay by clicking on the end stage.



Acknowledgements
----------------
Even though I have a habit of modifying and changing code, the following are acknowledgements (listed in alphabetical order) to authors whose code I have taken and integrated with this code example.

* [Chris McCormick](http://mccormickit.com/) and [jsGameSoup](http://jsgamesoup.net/). Code I am using from jsGameSoup:
    * collisions.js
* [Simon Oberhammer](https://github.com/oberhamsi) and [gamejs](https://github.com/oberhamsi/gamejs). I am using a lot of gamejs, in particular the Surface object which is a nice wrapper for canvas overlays.

The licenses from these libraries are included in the LICENSE.txt file if a license was available. If I have incorrectly attributed anyone, please let me know and I'll correct it.
