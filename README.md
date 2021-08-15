TRPAppService
=============
TheRedPin 2.0 application service


Requirements
------------
1. Node.js, There are two options for installing Node.js on Mac OS X:
	* Download and install the binaries from [Node.js](http://nodejs.org) (Easier, but not recommended!)
	* Using Homebrew, which is a better option:
		1. First install XCode Command Line Tools, `xcode-select --install`
		2. Install Homebrew, visit [Homebrew](http://brew.sh), or `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install`
		3. Run `brew doctor`
		4. Run `brew install node`
2. Node Packaged Modules (or Node Package Manager), npm, which should be installed along with Node
3. Grunt, JavaScript Task Runner, `npm install -g grunt-cli` visit [Grunt](http://gruntjs.com) for more information


Installation
------------
1. Clone or copy the project folder on your host machine
2. Go to the folder root, run `npm install` command


Grunt Tasks
-----------
* `grunt development` starts node application on port 3000 in debug mode, runs node-inspector on port 8080 and nodemon for development and debugging
* `grunt production` does nothing, for now


Resources
---------
* [Node.js](http://nodejs.org)
* [npm](https://www.npmjs.org)
* [Grunt](http://gruntjs.com)
