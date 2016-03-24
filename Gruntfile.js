'use strict';

module.exports = function (grunt) {
  require('jit-grunt')(grunt, {
    injector: 'grunt-asset-injector'
  });

  grunt.initConfig({
    app: {
      build: './<%= pkg.name %>.min.js',
      map: './<%= pkg.name %>.map.js',
      src: './<%= pkg.name %>.js',
      specs: './test/<%= pkg.name %>.spec.js'
    },

    pkg: grunt.file.readJSON('package.json'),

    // Uglify
    uglify: {
      build: {
        options: {
          enclose: { angular : 'angular' },
          sourceMap: true,
          sourceMapName: '<%= app.map %>'
        },
        files: {
          '<%= app.build %>': '<%= app.src %>'
        }
      }
    },

    eslint: {
      target: ['<%= app.src %>']
    },

    githooks: {
      all: {
        'pre-commit': 'eslint'
      }
    },

    // Test settings
    karma: {
      options: {
        files: [
          './node_modules/es5-shim/es5-shim.js',
          './test/lib/custom_event_polyfill.js',
          './node_modules/angular/angular.js',
          './node_modules/angular-mocks/angular-mocks.js'
        ]
      },

      build: {
        configFile: 'karma.conf.js',
        reporters: ['spec'],
        singleRun: true,
        files: [
          { src: '<%= app.build %>' },
          { src: '<%= app.specs %>' }
        ]
      },

      dev: {
        configFile: 'karma.conf.js',
        reporters: ['spec'],
        singleRun: true,
        files: [
          { src: ['<%= app.src %>'] },
          { src: ['<%= app.specs %>'] }
        ]
      }
    },

    bytesize: {
      all: {
        src: [
          '<%= app.build %>'
        ]
      }
    },

    replace: {
      readme: {
        options: {
          patterns: [{
            match: /\/latest\-(.+)\-brightgreen\.svg/g,
            replacement: function(){
              var options = grunt.file.readJSON('package.json');
              var version = options.version.replace(/\-/g, '--');
              return '\/latest-v'+version+'\-brightgreen\.svg';
            }
          }]
        },
        files: {'./README.md': './README.md'}
      }
    }
  });

  grunt.registerTask('build', ['eslint', 'uglify:build', 'karma:build', 'replace', 'bytesize']);

  grunt.registerTask('test', function(target){
    if (target === 'build') {
      grunt.task.run(['karma:build']);
    }
    else {
      grunt.task.run(['karma:dev']);
    }
  });
};
