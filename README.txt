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
* NOT SUPPORTED: IE 6-8. This is an experiment in fun for me as a coder, 
  not an experiment in tedium and annoyance.
* An ECMAScript 5 capable browser. See the following compliance chart if you
  are unfamiliar with what this means:
    http://kangax.github.com/es5-compat-table/
* No additions made to the Object.prototype as it might screw up purposefully
  unprotected enumeration loops -> for (blah in blah) {....}.
* Node.js + npm to build the code.



RUNNING THE GAME
================
* From the commandline load grunt:
    npm install -g grunt
* Build the code:
    grunt build
* Load up the game in a browser by opening up index.html.
* Shoot stuff.



TODO
====
* Include code that attempts to predict if the browser viewing the game does
  not meet the technical requirements.



Step v10
========
* Make it easier to track and locate the various shapes on the screen,
  starting with the targets. Manage their location and their polygon (soon
  to become a Surface) separately.
* Add a Surface object for static canvas drawn images. First surface
  test object: the target.
* Make an official readme, and begin cleaning up documentation.
* Clean up the collision routine (performance improvement during iteration),
  get rid of unnecessary export of helper functions, get rid of accidental
  global variables.
* Cut down on the globals, and rename the main app.js to game.js.
* Bring linting back into the code build process.
* TODO: Make anti-collision formulas for when I want to know when something
  is no longer colliding with something else.
* TODO: Have the targets fly in from all sides.
