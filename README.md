# generator-jsproject [![Build Status](https://secure.travis-ci.org/cesarandreu/generator-jsproject.png?branch=master)](https://travis-ci.org/cesarandreu/generator-jsproject)

> Yeoman generator for javascript projects, because having to copy over files every time is a pain.

## What does it do?

* Initialize core files that are generally used in all my javascript projects
* Creates the folder for you unless you opt-out
* Creates the GitHub repo for you unless you opt-out (requires `GITHUB_TOKEN`)


## Usage

Make sure you have Yeoman installed:

```bash
$ npm install -g yo
```

Install `generator-jsproject`:

```bash
$ npm install -g generator-jsproject
```

Finally, initiate the generator:

```bash
$ yo jsproject
```

If during generation you get an error like `API rate limit exceeded`, you need to log in to GitHub and [create a new API token](https://github.com/settings/tokens/new), then add:
```bash
export GITHUB_TOKEN='YOUR_NEW_TOKEN'
```
to your `.bashrc`, `.zshrc`, `.profile` or another file that is run on shell initialization. In new terminal shells you shouldn't see this error anymore.

## Environment Variables

* __GITHUB_USERNAME__ - value that will be used as the default GitHub username, defaults to `cesarandreu`
* __GITHUB_TOKEN__ - your github token, must have `public_repo` or `repo` permissions to initialize your GitHub repo

## Generated files

* bower.json
* package.json
* LICENSE (MIT)
* README.md
* .editorconfig
* .gitattributes
* .gitignore
* .jshintrc
* .travis.yml
