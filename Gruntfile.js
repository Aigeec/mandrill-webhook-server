module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['mochaTest'],
    },
    mochaTest: {
      test: {
        src: ['test/**/*.js'],
        options: {
          reporter: 'spec',
          captureFile: '/testing/results.txt',
        },
      },
    },
    jsdoc: {
      dist: {
        src: ['src/*.js', 'test/*.js'],
        options: {
          destination: 'doc',
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('default', ['jshint']);

};
