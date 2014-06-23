'use strict';
// var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var _ = require('lodash');

_.mixin(require('underscore.string').exports());

var githubOptions = {
  version: '3.0.0'
};

var GitHubApi = require('github');
var github = new GitHubApi(githubOptions);

if (process.env.GITHUB_TOKEN) {
  github.authenticate({
    type: 'oauth',
    token: process.env.GITHUB_TOKEN
  });
}

var githubUserInfo = function (name, cb) {
  github.user.getFrom({
    user: name
  }, function (err, res) {
    if (err) {
      throw new Error(err.message + '\n\nCannot fetch your github profile. Make sure you\'ve typed it correctly.');
    }
    cb(JSON.parse(JSON.stringify(res)));
  });
};

var githubCreateRepo = function (repoOptions, cb) {
  github.repos.create(repoOptions, function (err, res) {
    if (err) {
      throw new Error(err.message + '\n\nCannot create github repository.');
    }
    cb(JSON.parse(JSON.stringify(res)));
  });
};

var JsprojectGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      this.log('\nTo finish, copy and paste the following into your terminal:\n');
      var command = '';
      if (this.createFolder) {
        command += ('cd ' + this.slugName + ' && ');
      }
      command += 'git init';
      if (this.githubRepoUrl) {
        command += (' && git remote add origin '+ this.githubRepoUrl +' && git add -A && git commit -m "first commit" && git push -u origin master');
      }
      command += '\n';

      this.log(chalk.magenta(command));
    });
  },

  askFor: function () {
    var done = this.async();

    this.log(yosay('JS-Project generator!'));

    var prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'What is the project name?',
      default: 'jsproject'
    }, {
      type: 'input',
      name: 'projectDescription',
      message: 'Please provide a project description',
      default: 'project description'
    }, {
      type: 'confirm',
      name: 'createFolder',
      message: 'Should I create the project folder?',
      default: true
    },{
      type: 'input',
      name: 'githubUsername',
      message: 'What is your GitHub username?',
      default: process.env.GITHUB_USERNAME || 'cesarandreu'
    }];

    if (process.env.GITHUB_TOKEN) {
      prompts.push({
        type: 'confirm',
        name: 'githubCreateRepo',
        message: 'Create GitHub repository?',
        default: true
      });
    }

    this.prompt(prompts, function (props) {
      this.projectName = props.projectName;
      this.slugName = _.slugify(props.projectName);
      this.projectDescription = props.projectDescription;
      this.createFolder = props.createFolder;
      this.githubUsername = props.githubUsername;
      this.githubCreateRepo = props.githubCreateRepo;
      done();
    }.bind(this));
  },

  userInfo: function () {
    var done = this.async();

    githubUserInfo(this.githubUsername, function (res) {
      this.realname = res.name;
      this.email = res.email;
      this.githubUrl = res.html_url;
      done();
    }.bind(this));
  },

  createGithub: function () {
    var done = this.async();
    if (this.githubCreateRepo) {
      this.log('\nAttempting to create GitHub repo ' + chalk.cyan(this.slugName));
      githubCreateRepo({
        name: this.slugName,
        description: this.projectDescription
      }, function (res) {
        this.log('GitHub repo ' + chalk.cyan(this.slugName) + ' successfully created\n');
        this.githubRepoUrl = res.clone_url;
        done();
      }.bind(this));
    } else {
      done();
    }
  },

  app: function () {

    var packageJson = 'package.json',
      bowerJson = 'bower.json',
      readme = 'README.md',
      license = 'LICENSE',
      gitignore = '.gitignore',
      gitattributes = '.gitattributes',
      editorconfig = '.editorconfig',
      jsHint = '.jshintrc',
      travis = '.travis.yml';

    if (this.createFolder) {
      this.mkdir(this.slugName);
      packageJson = path.join(this.slugName, packageJson);
      bowerJson = path.join(this.slugName, bowerJson);
      readme = path.join(this.slugName, readme);
      license = path.join(this.slugName, license);
      gitignore = path.join(this.slugName, gitignore);
      gitattributes = path.join(this.slugName, gitattributes);
      editorconfig = path.join(this.slugName, editorconfig);
      jsHint = path.join(this.slugName, jsHint);
      travis = path.join(this.slugName, travis);
    }

    this.template('_package.json', packageJson);
    this.template('_bower.json', bowerJson);
    this.template('_README.md', readme);
    this.template('_LICENSE', license);
    this.copy('gitattributes', gitattributes);
    this.copy('gitignore', gitignore);
    this.copy('editorconfig', editorconfig);
    this.copy('jshintrc', jsHint);
    this.copy('travis.yml', travis);
  }

});

module.exports = JsprojectGenerator;
