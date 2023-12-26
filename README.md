# shootdown

Current version of code should be hosted on this project's github pages at http://jeremyosborne.github.io/shootdown.

A video game for my son, which I played more than he did.


## Development

### One time

* [nvm with shell integration](https://github.com/nvm-sh/nvm?tab=readme-ov-file#deeper-shell-integration).
* `npm install`

### Modifying code

WIP tooling....

`npx webpack --watch --mode development`

and

`npm start`


## Choices

* [TypeScript](https://www.typescriptlang.org/) as programming language.
* [Phaser](https://phaser.io/) as game engine.
* [Webpack](https://webpack.js.org/) as code bundle-orchestration.
  * Note on choice of webpack: had trouble using rollup or plain tsc with phaser output, so picked out a simple webpack config and things seem to "just work."

## Acknowledgements and Credits

* [Phaser 3](http://phaser.io) game engine.
* [Tomas Pettersson's sfxr](http://www.drpetter.se/project_sfxr.html) for sound effects.
* [Borderline (Fantastic Vamps : 8-Bit Mix)](http://dig.ccmixter.org/files/vamps/8749) for background music.
* [Hubble Unmasks Ghost Galaxies](http://hubblesite.org/newscenter/archive/releases/2012/26/image/b/) as background image.
