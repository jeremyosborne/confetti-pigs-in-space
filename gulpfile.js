/* jshint unused:true, undef:true, node:true */

var fs = require("fs-extra");
var semver = require("semver");
var util = require("util");
// gulp specific stuff below ////////////////////////////////
//
// http://gulpjs.com/
var gulp = require("gulp");
// Concat files together.
var concat = require("gulp-concat");
// A gulp version of connect for running a dev webserver.
var connect = require("gulp-connect");
// Add headers to files.
var header = require("gulp-header");
// Static analysis of JavaScript code.
var jshint = require("gulp-jshint");
// Force tasks to run in series even if tasks do not depend on each other.
var runSequence = require('run-sequence');
// Search and replace during build.
//var uglify = require("gulp-uglify");




//
// package.json holds the current version of this project. The other manifest
// files either in source control or generated have their versions set from
// the version found in package.json.
//
//
// Returns a {semver object} object build for the upcoming build version.
// Can bump the version in the package.json (one time only per build) if
// given an option.
var buildVersion = (function() {
    var _buildVersion = null;
    return function(bump) {
        if (!_buildVersion && bump) {
            var packageDotJson = require("./package.json");
            // Bump the build (aka patch) version. This is the only bumping we do, all
            // other version increases require manual intervention.
            _buildVersion = semver.inc(packageDotJson.version, "patch");
            // Write back incremented version. Fine if build version gets big.
            packageDotJson.version = _buildVersion;
            console.log("Bumping build version in package.json to:", _buildVersion);
            // Let error break things.
            fs.writeJsonSync('./package.json', packageDotJson);
        } else if (!_buildVersion) {
            _buildVersion = require("./package.json").version;
        } // else { use cached to prevent multiple bumps during one build cycle. }
        return _buildVersion;
    };
})();



// Gets today's date as a string. Will cache first result
// and return it for the entire life of this module.
var buildDate = (function() {
    var _buildDate = null;
    return function() {
        if (!_buildDate) {
            _buildDate = (new Date()).toISOString().replace(/T/, ' ').replace(/\..+/, '');
        }
        return _buildDate;
    };
})();



// Returns a banner as a single string to be placed at the top of the built
// files.
// Tagline is inserted if provided. Build date and build version are inserted
// which will have a side effect of bumping the version in the package.json.
var bannerMaker = function() {
    var bannerTemplate = [
        "/*!",
        " * Shootdown",
        " * Build date: %s",
        " * Build version: %s",
        " */",
        "",
    ].join("\n");

    return util.format(bannerTemplate, buildDate(), buildVersion());
};



// Essentially things we don't want to lint.
var thirdPartyJsFiles = [
    "js/lib/dasspiel.js",
];

// List of source files, in order of least-to-most dependency.
var appJsFiles = [
    // Browser prerequisite check.
    "js/browser-prereq.js",
    // App modules.
    "js/countdown.js",
    "js/score-keeper.js",
    "js/sound.js",
    "js/crosshair.js",
    "js/flak.js",
    "js/target.js",
    "js/stage-load.js",
    "js/stage-start.js",
    "js/stage-the-game.js",
    "js/stage-end.js",
    // Load this one last.
    "js/main.js",
];

// All the files in the appropriate dependency order.
var jsFiles = thirdPartyJsFiles.concat(appJsFiles);



gulp.task("lint", function() {
    // Don't lint third party code.
    return gulp.src(appJsFiles)
        .pipe(jshint({
            boss: true,
            browser: true,
            curly: true,
            devel: true,
            eqeqeq: false,
            eqnull: true,
            immed: true,
            jquery: true,
            latedef: true,
            newcap: true,
            noarg: false,
            sub: true,
            undef: true,
            unused: true,
            globals: {
                $g: false,
            },
        }))
        .pipe(jshint.reporter('default'));
});



// not-minified for desktop development, in debug mode
gulp.task("js-dev", ["lint"], function() {
    return gulp.src(jsFiles)
        .pipe(concat("shootdown.js"))
        //.pipe(uglify())
        .pipe(header(bannerMaker()))
        .pipe(gulp.dest("dist/"));
});



// For testing. Start a static document server.
gulp.task("serve-dev", function() {
    connect.server({
        root: ".",
        port: "4242",
    });
});



// The default is a dev build plus file watch and rebuild on the fly.
// The default dev environment is also the most bleeding edge.
gulp.task("default", function(done) {
    gulp.watch(jsFiles, ["js-dev"]);

    runSequence("js-dev",
        "serve-dev",
        done);
});
