/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

process.env.GITHUB_USERNAME = 'cesarandreu';
process.env.GITHUB_TOKEN = '';

describe('jsproject generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('jsproject:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      'bower.json',
      'LICENSE',
      'package.json',
      'README.md',
      '.jshintrc',
      '.editorconfig',
      '.gitignore',
      '.gitattributes',
      '.travis.yml'
    ];

    helpers.mockPrompt(this.app, {
      projectName: 'jsproject',
      projectDescription: 'project description',
      createFolder: false,
      githubUsername: 'cesarandreu',
      githubCreateRepo: false
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });

  it('created folder if ordered', function (done) {
    var expected = [
      'jsproject',
      'jsproject/bower.json',
      'jsproject/LICENSE',
      'jsproject/package.json',
      'jsproject/README.md',
      'jsproject/.jshintrc',
      'jsproject/.editorconfig',
      'jsproject/.gitignore',
      'jsproject/.gitattributes',
      'jsproject/.travis.yml'
    ];

    helpers.mockPrompt(this.app, {
      projectName: 'jsproject',
      projectDescription: 'project description',
      createFolder: true,
      githubUsername: 'cesarandreu',
      githubCreateRepo: false
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });

});
