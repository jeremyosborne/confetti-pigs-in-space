# shootdown

Click and blow stuff up.



## Build the Game

* Get [Node.js](http://nodejs.org/download/).
* Get [Grunt Commandline](http://gruntjs.com/getting-started):

        npm install -g grunt-cli

* Install other build tools:

        npm install

* Build the code:

        grunt

* If you are going to tweak the code and test things out, recommend:

        grunt watch

* Run game -> load `index.html` in browser.
    * Recommended: [Google Chrome](http://www.google.com/chrome).
* Click to shoot things.



## TODO

* Refactor again (need to somewhat normalize how I define entities).
* Make multiline text and improve the TextOverlay.
* Include the flying confetti pigs, and orient correctly.



## Acknowledgements...

...to authors whose code I am using here:

* [Chris McCormick](http://mccormickit.com/) and [jsGameSoup](http://jsgamesoup.net/). Code I am using from jsGameSoup:
    * collisions.js
* [Simon Oberhammer](https://github.com/oberhamsi) and [gamejs](https://github.com/oberhamsi/gamejs). I am using a lot of gamejs, in particular the Surface object which is a nice wrapper for canvas overlays.
* [Tomas Pettersson's sfxr](http://www.drpetter.se/project_sfxr.html) for some simple, easy to generate sound effects.

The licenses from these libraries are included in the LICENSE.txt file if a license was available. If I have incorrectly attributed anyone, please let me know and I'll correct it.
