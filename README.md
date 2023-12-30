# confetti pigs in space

I originally made this game for my son, and then I played it more than he did.


## Development

### One time

- [nvm with shell integration](https://github.com/nvm-sh/nvm?tab=readme-ov-file#deeper-shell-integration).
- `npm install`

### Development

`npm start`

### Production build

`npm run build`

Test the built files with:

`npx http-server ./dist`


## Dev notes

- [TypeScript](https://www.typescriptlang.org/) as programming language.
- [Phaser](https://phaser.io/) as game engine.
- [Webpack](https://webpack.js.org/) as code bundle-orchestration.
- Code and artifact organization:
  - `./src`: processed in some way and become transpiled output.
  - `./static`: not processed, but required in the output.'
    - Game assets (images, sounds, etc.) live in `./static/assets`.
      - Use relative references to assets in game, as the final deploy will be in an application document root, not the absolute path of the url.
  - `./dist`: target folder, becomes the application root of the final build.
- Building code:
  - Development
    - `webpack-dev-server` for code watching and application hosting.
  - Production
    - Working changes go to `main`.
    - Push `main` to `release` to publish new version.
    - Github actions run:
      - To build the code into  `./dist` and then to replace all code in `gh-pages` with the contents of `./dist`.
      - To deploy the code in `gh-pages` document root to the github CDN (or wherever the documents go).


## Acknowledgements and Credits

- [Phaser 3](http://phaser.io) game engine.
- [Tomas Pettersson's sfxr](http://www.drpetter.se/project_sfxr.html) for sound effects.
- [Borderline (Fantastic Vamps : 8-Bit Mix)](http://dig.ccmixter.org/files/vamps/8749) for background music.
- ChatGPT, which helped me solve the idiomatic differences during the migration from Phaser 2 to Phaser 3.


## Known issues / historical notes

- Note on choice of webpack: had trouble using rollup or plain tsc with phaser output, so picked out a simple webpack config and things seem to "just work."


## TODO

...