# shootdown

Click and blow stuff up. Current version of code should be hosted on this project's github pages at http://jeremyosborne.github.io/shootdown.



## Build the Game

* Get [Node.js](http://nodejs.org/download/).
* Get [Gulp](http://gruntjs.com/getting-started):

        npm install -g gulp

* Install other build tools:

        npm install

* Build code, auto-rebuild code when changed, and start dev server:

        gulp

* Run game in modern browser
    * go to: http://localhost:4242
    * or just open `index.html` with a double click



## Playing the game

Click to shoot things. Such high scores. Much wow.



## Acknowledgements...

...to authors whose code I am using here:

* [Chris McCormick](http://mccormickit.com/) and [jsGameSoup](http://jsgamesoup.net/). Code I am using from jsGameSoup:
    * collisions.js
* [Simon Oberhammer](https://github.com/oberhamsi) and [gamejs](https://github.com/oberhamsi/gamejs). I am using a lot of gamejs, in particular the Surface object which is a nice wrapper for canvas overlays.
* [Tomas Pettersson's sfxr](http://www.drpetter.se/project_sfxr.html) for some simple, easy to generate sound effects.

The licenses from these libraries are included in the LICENSE.txt file if a license was available. If I have incorrectly attributed anyone, please let me know and I'll correct it.
