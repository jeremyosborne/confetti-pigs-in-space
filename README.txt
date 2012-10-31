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
* Click to shoot things (think old school Missile Command).



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
* Make anti-collision formulas for when I want to know when something
  is no longer colliding with something else.
* Switch the targets testing for their removal by having them test
  for an anti collision against the world object.
* Cleanup and add some documentation to my gruntfile for my own understanding
  of what is going on.
* Add a license for my own code.
* Improve the package.json file to be more correct and useful.
* Build a Heading class.
* Add a heading instance to the targets.
* TODO: Have the targets fly in from random locations around the world.
