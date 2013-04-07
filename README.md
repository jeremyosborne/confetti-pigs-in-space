shootdown
=========

An experiment documenting my organic coding procedures. Also a game.



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
* Refactor again (need to somewhat normalize how I define entities).
* Make multiline text and improve the TextOverlay.
* Include the flying confetti pigs, and orient correctly.



Acknowledgements
----------------
Even though I have a habit of modifying and changing code, the following are acknowledgements (listed in alphabetical order) to authors whose code I have taken and integrated with this code example.

* [Chris McCormick](http://mccormickit.com/) and [jsGameSoup](http://jsgamesoup.net/). Code I am using from jsGameSoup:
    * collisions.js
* [Simon Oberhammer](https://github.com/oberhamsi) and [gamejs](https://github.com/oberhamsi/gamejs). I am using a lot of gamejs, in particular the Surface object which is a nice wrapper for canvas overlays.

The licenses from these libraries are included in the LICENSE.txt file if a license was available. If I have incorrectly attributed anyone, please let me know and I'll correct it.
