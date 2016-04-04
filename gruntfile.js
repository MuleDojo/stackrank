module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        exec: {
            clean: {
                cmd: 'rm -Rf public/js && rm -Rf build'
            },
            react: {
                cmd: './node_modules/.bin/babel --presets react src/views/ --out-dir build/'
            }
        },
        browserify: {
            react: {
                options: {
                    debug: true,
                    transform: ['babelify'],
                    presets: ['react']
                },
                files: {
                    'public/js/build.js': 'build/**/*.js'
                }
            }
        },
        uglify: {
            react: {
                src: 'public/js/build.js',
                dest: 'public/js/build.min.js'
            }
        }
    });
    // Load the plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-exec');
    // Default task(s).
    grunt.registerTask(
        'default',
        ['exec:clean', 'exec:react', 'browserify:react', 'uglify:react']
    );
};
