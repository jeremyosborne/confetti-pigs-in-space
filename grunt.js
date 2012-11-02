/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Loads and parses the package.json file into a JavaScript object
        // literal.
        pkg : '<json:package.json>',
        // Various meta information for use elsewhere.
        meta : {
            // Banner can be used by various tasks, like concat and min.
            // Information place at the top of source files.
            banner : ''+
                '/*!\n' +
                '    <%= pkg.title || pkg.name %>\n' +
                '    v<%= pkg.version %>\n' + 
                '    built <%= grunt.template.today("yyyy-mm-dd") %>\n' + 
                '    <%= pkg.homepage ? pkg.homepage : "" %>\n' + 
                '    Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> <<%= pkg.author.email%>>\n' + 
                '    Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> \n' +
                ' */'
        },        
        /**
         * All the source files that are going into this program.
         * 
         * NOT A TASK! DON'T RUN!
         * (!tasks probably belong somewhere else, but I'll leave it here).
         */
        srcFiles: {
            list: [
                // Browser prerequisite check.
                "js/browser_prereq.js",
                // Third party libraries.
                "lib/jsgamesoup.js",
                "lib/collisions.js",
                "lib/audio.js",
                "lib/klass.js",
                // Load priority items.
                "js/surface.js",
                "js/heading.js",
                // Load non-priority items.
                "js/crosshair.js",
                "js/flak.js",
                "js/mousecoords.js",
                "js/score.js",
                "js/target.js",
                "js/world.js",
                // Load this one last.
                "js/game.js",
            ],
        },
        concat: {
            dist: {
                src: [
                    // Could not get the banner options to work,
                    // seem like we need to declare the banner like this
                    // to get it into the file.
                    '<banner:meta.banner>',
                    // All the other files we want.
                    '<config:srcFiles.list>',
                ],
                dest : 'dist/<%= pkg.name %>.js',
            }
        },
        /* Minification task. */
        min : {
            dist : {
                src : [
                    // Could not get the banner options to work,
                    // seem like we need to declare the banner like this
                    // to get it into the file.
                    // Supposedly the min task will correctly place the
                    // banner into the file if declared like this.
                    '<banner:meta.banner>',
                    // Other source files.
                    '<config:srcFiles.list>',
                ],
                dest : 'dist/<%= pkg.name %>.min.js',
            }
        },
        /**
         * Configuration for uglifyjs (for min task... at least I think it is.)
         */
        uglify : {},
        /**
         * Respond to file changes.
         */
        watch : {
            /* 
             * Which files to watch for changes. 
             * NOTE: watch seems to barf if/when it encounters a banner mixed
             * in with files, or other non-file-path stuff.
             */
            files : '<config:srcFiles.list>',
            /* What tasks to run when a file changes. */
            tasks: 'concat',
        },
        /**
         * Which files do I want to run through jshint?
         */
        lint : {
            files : [
                'grunt.js', 
                'js/**/*.js',
            ]
        },
        /**
         * Configuration for jshint (and the lint task).
         */
        jshint : {
            // see http://www.jshint.com/docs/
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
                browser : true,
                es5: true,
                devel: true,
            },
            // Define globals here, with a true if they should be modifiable
            // and false if not. Use these for project globals that appear
            // everywhere and are assumed to be used everywhere.
            globals : {
                // Used for creating JavaScript "classes."
                klass: false,
                // The game "app" object.
                game: false,
            },
        },
        /**
         * What qunit tests to run in the qunit task?
         */
        qunit : {
            files : ['test/**/*.html']
        },
    });

    // Default task, run via the default "grunt" command.
    grunt.registerTask('default', 'lint concat watch');

    // Non-default tasks, run with "grunt build" for example.
    grunt.registerTask('build', 'concat');
};
