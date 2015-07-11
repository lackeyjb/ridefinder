module.exports = function() {
  var client     = './src/client/';
  var clientApp  = client + 'app/';
  var root       = './';
  var server     = './src/server/';
  var temp       = './.tmp/';
  var wiredep    = require('wiredep');
  var bowerFiles = wiredep({devDependencies: true})['js'];

  var config = {

    /**
     * File paths
     */

    // all js to vet
    alljs: [
      './src/**/*.js',
      './*.js'
    ],
    build: './build/',
    client: client,
    index: client + 'index.html',
    css: temp + '*.css',
    fonts: './bower_components/font-awesome/fonts/**/*.*',
    html: clientApp + '**/*.html',
    htmltemplates: clientApp + '**/*.html',
    images: client + 'images/**/*.*',
    js: [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js'
    ],
    sass: client + 'styles/**/*.scss',
    root: root,
    server: server,
    temp: temp,

    /**
     * Optimized files
     */
    optimized: {
      app: 'app.js',
      lib: 'lib.js'
    },

    /**
     * Template Cache
     */
    templateCache: {
      file: 'templates.js',
      options: {
        module: 'app',
        standAlone: false,
        root: 'app/'
      }
    },

    /**
     * Browser sync
     */
    browserReloadDelay: 1000,

    /**
     * Bower and npm locations
     */
    bower: {
      json: require('./bower.json'),
      directory: './bower_components',
      ignorePath: '../..'
    },
    packages: [
      './package.json',
      './bower.json'
    ],

    /**
     * Node settings
     */
    defaultPort: 3000,
    nodeServer: server + 'server.js'
  };

  config.getWiredepDefaultOptions = function() {
    var options = {
      bowerJson: config.bower.json,
      directory: config.bower.directory,
      ignorePath: config.bower.ignorePath
    };
    return options;
  };

  return config;

};
