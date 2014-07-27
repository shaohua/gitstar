module.exports = function(grunt) {
  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    opts: {
      path: '.',
      name: 'gitstar'
    },
    connect: {
      server: {
        options: {
          keepalive: false,
          port: 8000,
          base: '<%= opts.path %>'
        }
      }
    },
    browserify: {
      dev: {
        files: {
          '<%= opts.path %>/dist/<%= opts.name %>.js': ['<%= opts.path %>/scripts/index.js'],
        }
      }
    },
    stylus: {
      compile: {
        options: {
          compress: false,
          use: [ require('nib') ],
          "include css": true
        },
        files: {
          '<%= opts.path %>/dist/<%= opts.name %>.css': '<%= opts.path %>/css/index.styl'
        }
      }
    },
    watch: {
      options: {
        spawn: false
      },
      dev: {
        files: [
          '<%= opts.path %>/scripts/**/*.js',
          '<%= opts.path %>/css/**/*.styl'
        ],
        tasks: ['stylus', 'browserify']
      }
    }
  });

  grunt.registerTask('default', ['stylus', 'browserify', 'connect', 'watch']);
};
