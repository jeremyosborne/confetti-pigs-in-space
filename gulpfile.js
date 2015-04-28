/* jshint unused:true, undef:true, node:true */

// gulp specific stuff below ////////////////////////////////
//
// http://gulpjs.com/
var gulp = require("gulp");
// A gulp version of connect for running a dev webserver.
var connect = require("gulp-connect");



// The default is a dev build plus file watch and rebuild on the fly.
// The default dev environment is also the most bleeding edge.
gulp.task("default", function() {
    connect.server({
        port: "4242",
    });
});
