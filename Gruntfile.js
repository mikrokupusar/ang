module.exports = function(grunt) {

    "use strict";

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        assetsDir: 'app',
        distDir: 'dist',

        availabletasks: {
            tasks: {
                options: {
                    filter: 'include',
                    groups: {
                        'Development': ['dev', 'test:unit', 'test:e2e', 'report'],
                        'Production': ['package'],
                        'Continuous Integration': ['ci']
                    },
                    sort: ['dev', 'test:unit', 'test:e2e', 'report', 'package', 'ci'],
                    descriptions: {
                        'dev' : 'Launch the static server and watch tasks',
                        'test:unit' : 'Run unit tests and show coverage report',
                        'test:e2e' : 'Run end-to-end tests',
                        'report' : 'Open Plato reports in your browser',
                        'package' : 'Package your web app for distribution',
                        'ci' : 'Run unit & e2e tests, package your webapp and generate reports. Use this task for Continuous Integration'
                    },
                    tasks: ['dev', 'test:unit', 'test:e2e',  'package', 'report', 'ci']
                }
            }
        },
        'bower-install': {
            target: {
                src: '<%= assetsDir %>/index.html',
                ignorePath: '<%= assetsDir %>/',
                jsPattern: '<script type="text/javascript" src="{{filePath}}"></script>',
                cssPattern: '<link rel="stylesheet" href="{{filePath}}" >'
            }
        },
        clean: {
            dist: ['.tmp', '<%= distDir %>']
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= assetsDir %>',
                    dest: '<%= distDir %>/',
                    src: [
                        'index.html',
                        'img/**'
                    ]
                }]
            }
        },
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/js',
                    src: '*.js',
                    dest: '.tmp/concat/js'
                }]
            }
        },
        useminPrepare: {
            html: '<%= assetsDir %>/index.html',
            options: {
                dest: '<%= distDir %>'
            }
        },
        usemin: {
            html: '<%= distDir %>/index.html'
        },
        browser_sync: {
            dev: {
                bsFiles: {
                    src : ['<%= assetsDir %>/**/*.html', '<%= assetsDir %>/**/*.js', '<%= assetsDir %>/**/*.css']
                },
                options: {
                    watchTask: true,
                    ghostMode: {
                        clicks: true,
                        scroll: true,
                        links: false, // must be false to avoid interfering with angular routing
                        forms: true
                    },
                    server: {
                        baseDir: "<%= assetsDir %>"
                    }
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all : {
                src : ['<%= assetsDir %>/js/**/*.js']
            }
        },
        watch: {
            options : {
                interrupt: true
            },
            js: {
                files: ['<%= assetsDir %>/js/**/*.js'],
                tasks: ['newer:jshint' , 'karma:dev_unit:run' ]
            },
            html : {
                files: ['<%= assetsDir %>/**/*.html']
            },
            css: {
                files: ['<%= assetsDir %>/css/**/*.css'],
                tasks: ['csslint']
                
            }
            ,
                less: {
                    files : ['<%= assetsDir %>/less/**/*.less'],
                        tasks: ['less:all']
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            all : {
                src : ['<%= assetsDir %>/css/**/*.css']
            }
        },
        connect: {
            test : {
                options: {
                    port: 8887,
                        base: '<%= assetsDir %>',
                        keepalive: false,
                        livereload: false,
                        open: false
                }
            },
            plato : {
                options: {
                    port: 8889,
                        base: 'reports/complexity',
                        keepalive: true,
                        open: true
                }
            }
        },
        karma: {
            dev_unit: {
                options: {
                    configFile: 'test/conf/unit-test-conf.js',
                        background: true,  // The background option will tell grunt to run karma in a child process so it doesn't block subsequent grunt tasks.
                        singleRun: false,
                        autoWatch: true,
                        reporters: ['progress']
                }
            },
            dist_unit: {
                options: {
                    configFile: 'test/conf/unit-test-conf.js',
                        background: false,
                        singleRun: true,
                        autoWatch: false,
                        reporters: ['progress', 'coverage'],
                        coverageReporter : {
                            type : 'html',
                            dir : '../reports/coverage'
                        }
                }
            },
            e2e: {
                options: {
                    configFile: 'test/conf/e2e-test-conf.js'
                }
            }
        },
        plato : {
            options: {
                jshint : grunt.file.readJSON('.jshintrc'),
                    title : 'Ang test'
            },
            all : {
                files: {
                    'reports/complexity': ['<%= assetsDir %>/js/**/*.js']
                }
            }
        },
        less: {
            options: {
                paths: ['<%= assetsDir %>/less']
            },
            all: {
                files: {
                    "<%= assetsDir %>/css/app.css": "<%= assetsDir %>/less/app.less"
                }
            }
        }
    });

    grunt.registerTask('test:e2e', ['connect:test', 'karma:e2e']);
    grunt.registerTask('test:unit', ['karma:dist_unit:start']);
    grunt.registerTask('report', ['plato', 'connect:plato']);
    grunt.registerTask('dev', ['less:all','browser_sync',   'karma:dev_unit:start',   'watch']);
    grunt.registerTask('package', ['jshint', 'clean', 'useminPrepare', 'copy', 'concat', 'ngmin', 'uglify', 'less:all',  'cssmin',   'usemin']);
    grunt.registerTask('ci', ['package', 'connect:test', 'karma:dist_unit:start',  'karma:e2e'  ,'plato']);
    grunt.registerTask('ls', ['availabletasks']);

};