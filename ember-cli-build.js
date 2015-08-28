/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    srcTag: 'https://js.arcgis.com/3.13/', // only needed for CDN, will default to 'built.js' if useRequire = true 
      useRequire: false, // if this is true, srcTag via options is ignored 
      useDojo: false, // if this is true, will inject the Dojo loader instead of RequireJS 
      locale: 'en-us', // will use RequireJS i18n to set the localization 
      amdPackages: [ // user defined AMD packages to search for in application 
        'esri','dojo','dojox','dijit',
        'put-selector','xstyle','dgrid'
      ]
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
