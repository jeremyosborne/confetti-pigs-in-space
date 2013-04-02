module.exports = function(grunt) {
    // List of source files, in order of least-to-most dependency.
    var srcFiles = [
        // Browser prerequisite check.
        "js/browser_prereq.js",
        // Third party libraries.
        "lib/dasspiel.js",
        //"lib/jsgamesoup.js",
        //"lib/collisions.js",
        //"lib/audio.js",
        //"lib/klass.js",
        // Load priority items.
        //"js/surface.js",
        //"js/heading.js",
        // Load non-priority items.
        //"js/score.js",
        //"js/target.js",
        //"js/world.js",
        "js/stages.js",
        "js/stagestart.js",
        "js/stagethegame.js",
        "js/stageend.js",
        // Load this one last.
        "js/main.js",
    ];



    grunt.initConfig({
        
        
        
        pkg: grunt.file.readJSON('package.json'),
        
        
        
        meta: {
            banner: ''+
                '/*!\n' +
                '    <%= pkg.title || pkg.name %>\n' +
                '    v<%= pkg.version %>\n' + 
                '    built <%= grunt.template.today("yyyy-mm-dd") %>\n' + 
                '    <%= pkg.homepage || "" %>\n' + 
                '    Copyright (c) <%= grunt.template.today("yyyy") %> <% pkg.author.name ? print(pkg.author.name+" <"+pkg.author.email+">") : print(pkg.author) %>\n' + 
                '    Licensed <%= pkg.license || _.pluck(pkg.licenses, "type").join(", ") %> \n' +
                ' */\n',
        },
        
        
        
        clean: ["dist/"],
        
        
        
        concat: {
            options: {
                banner: '<%= meta.banner %>',
                separator: ';'
            },
            dist: {
                src: srcFiles,
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        
      
        
        // Move files from spot A to spot B
        // copy: {
            // main: {
                // files: [
                    // {
                        // src: ['**'],
                        // cwd: "static",
                        // expand: true,
                        // dest: 'dist/',
                    // },
                // ]
            // }
        // },
        
        
        
        // Configuration for JSHint and the lint task.
        jshint: {
            // Which files should we lint?
            files: ['Gruntfile.js', 'js/**/*.js'],
            // see 
            //     http://www.jshint.com/docs/
            // for a list of options
            options: {
                curly: true,
                eqeqeq: false,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: false,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true,
                es5: true,
                devel: true,
                jquery: true,
                // Define globals here, with a true if they should be modifiable
                // and false if not. Use these for project globals that appear
                // everywhere and are assumed to be used everywhere.
                globals: {
                    module: false,
                    Game: false,
                    Stages: false,
                    // The following will be coded out eventually.
                    game: false,
                    klass: false,
                },
            },
        },
        
        
        // Qunit files run in phantomjs and are expected to be .html files.
        // qunit: {
            // files: ['tests/**/*.html']
        // },


        
        // minification task.
        uglify: {
            options: {
                banner: '<%= meta.banner %>',
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },



        // The watch task should be called separately, as it can often be
        // a nuisance with all of the updates it can cause.
        watch: {
            scripts: {
                files: ['Gruntfile.js', 'js/**/*.js', 'index.html', 'css/**/*.css'],
                tasks: ['jshint', 'concat'],
                options: {
                    debounceDelay: 250
                }
            }
        },
    });



    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    //grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');



    //grunt.registerTask('default', ['copy', 'jshint', 'qunit', 'concat']);
    grunt.registerTask('default', ['jshint', 'concat']);
    //grunt.registerTask('dist', ['clean', 'copy', 'jshint', 'qunit', 'concat', 'uglify']);
};
