/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg : '<json:package.json>',
        meta : {
            banner : '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
        },
        lint : {
            files : ['grunt.js', 'js/**/*.js']
        },
        // qunit : {
            // files : ['test/**/*.html']
        // },
        concat : {
            dist : {
                //src : ['<banner:meta.banner>', '<file_strip_banner:lib/<%= pkg.name %>.js>'],
                src: [
                    "lib/jsgamesoup.js",
                    "lib/collisions.js",
                    "lib/audio.js",
                    "lib/klass.js",
                    "js/crosshair.js",
                    "js/flak.js",
                    "js/mousecoords.js",
                    "js/score.js",
                    "js/target.js",
                    "js/world.js",
                    // Load this one last.
                    "js/app.js"
                ],
                dest : 'dist/<%= pkg.name %>.js'
            }
        },
        min : {
            dist : {
                //src : ['<banner:meta.banner>', '<config:concat.dist.dest>'],
                src : ['<config:concat.dist.dest>'],
                dest : 'dist/<%= pkg.name %>.min.js'
            }
        },
        watch : {
            files : '<config:concat.dist.src>',
            //tasks : 'lint qunit'
            tasks: 'concat'
        },
        jshint : {
            options : {
                curly : true,
                eqeqeq : true,
                immed : true,
                latedef : true,
                newcap : true,
                noarg : true,
                sub : true,
                undef : true,
                boss : true,
                eqnull : true,
                browser : true
            },
            globals : {}
        },
        uglify : {}
    });

    // Default task.
    //grunt.registerTask('default', 'lint qunit concat min');
    grunt.registerTask('default', 'concat watch');
    
};
