shootdown
a silly little game for my own spare time coding and fun.
also an experiment documenting my organic coding procedures, which aren't
always pretty.
by Jeremy Osborne (jeremyosborne.com)



TABLE OF CONTENTS
=================
* REQUIREMENTS
* RUNNING THE GAME
* TODO
* [notes for the current step/tag]



REQUIREMENTS
============
* Node.js + npm to build the code.
* A web browser, recommend newest versions of Chrome or Firefox.
    * NOT SUPPORTED: IE 6-8, and other old browsers. Don't try, game will
      break.



RUNNING THE GAME
================
* From the commandline load grunt:
    npm install -g grunt
* Build the code:
    grunt build
* Load up the game in a browser by opening up index.html.
* Click to shoot things.



TODO
====
* Make multiplayer after the main UI works for single player.



Step v12
========
* Performance improvements: 
  Implement requestAnimationFrame to maybe help speed things up.
  Looks like the CSS3 animation, the way I'm doing it, is killing
  the browser (probably the radial gradients and alpha transparency?).
* Tighten up the game and make the single player experience a good one.
* BUG: There seems to be a sound problem on Firefox but only when serving up
  the files from my home site?