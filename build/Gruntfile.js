module.exports = function( grunt )
{
var dest = '../release/<%= pkg.name %>_<%= pkg.version %>/';

grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),

        clean: {
            options: {
                force: true
            },
            release: [
                dest
            ]
        },

        copy: {
            release: {
                expand: true,
                cwd: '../',
                src: [
                    'images/*.{png,jpg}',
                    'libraries/*.{woff,js}',
                    'map_info/**',
                    'background.js',
                    'manifest.json'
                ],
                dest: dest
            }
        },

        uglify: {
            release: {
                files: {
                    '../release/<%= pkg.name %>_<%= pkg.version %>/min.js': [ '../scripts/*.js' ]
                }
            }
        },

        cssmin: {
            release: {
                files: [{
                    expand: true,
                    cwd: '../',
                    src: 'style.css',
                    dest: dest
                }]
            }
        },

        processhtml: {
            release: {
                files: [{
                    expand: true,
                    cwd: '../',
                    src: 'index.html',
                    dest: dest
                }]
            }
        }
    });

    // load the plugins
grunt.loadNpmTasks( 'grunt-contrib-copy' );
grunt.loadNpmTasks( 'grunt-contrib-uglify' );
grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
grunt.loadNpmTasks( 'grunt-contrib-clean' );
grunt.loadNpmTasks( 'grunt-processhtml' );

    // tasks
grunt.registerTask( 'default', [ 'clean', 'copy', 'uglify', 'cssmin', 'processhtml' ] );
};