module.exports = function (grunt) {
  'use strict';


  var readOptionalJSON = function (file) {
    var data = {};
    try {
      data = grunt.file.readJSON(file);
    } catch (e) {
    }
    return data;
  };


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    env: {
      development: {
        NODE_ENV: 'development'
      },
      test: {
        NODE_ENV: 'qa'
      },
      production: {
        NODE_ENV: 'production'
      }
    },


    'node-inspector': {
      development: {
        options: {
          'web-port': 3030,
          'web-host': 'localhost',
          'debug-port': 5858,
          'save-live-edit': true,
          'no-preload': true,
          'stack-trace-limit': 4,
          'hidden': ['node_modules']
        }
      }
    },


    concurrent: {
      development: {
        tasks: ['nodemon', 'node-inspector', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },


    nodemon: {
      development: {
        script: 'index.js',
        options: {
          args: ['dev'],
          nodeArgs: ['--debug'],
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });
          },
          env: {
            PORT: '3000'
          },
          cwd: __dirname,
          ignore: ['node_modules/**'],
          ext: 'js'
        }
      }
    },


    watch: {
      files: ['**/*.js', '!node_modules/**/*', '!lib/sequelize/**/*'],
      tasks: ['jshint', 'jscs'],
      options: {
        livereload: true
      }
    },


    jshint: {
      files: ['**/*.js', '!node_modules/**/*', '!models/**/*', '!lib/sequelize/**/*'],
      options: {
        reporter: require('jshint-stylish'),
        jshintrc: '.jshintrc'
      }
    },


    jscs: {
      files: ['**/*.js', '!node_modules/**/*', '!models/**/*', '!lib/sequelize/**/*', '!Gruntfile.js'],
      options: {
        config: '.jscsrc'
      }
    }


  });


  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-node-inspector');
  grunt.loadNpmTasks('grunt-nodemon');


  grunt.registerTask('development', ['env:development', 'concurrent']);
  grunt.registerTask('check', ['jshint', 'jscs']);


};