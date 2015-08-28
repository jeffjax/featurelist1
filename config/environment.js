/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'featurelist1',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    contentSecurityPolicy: {
      'script-src': "'self' 'unsafe-eval' 'unsafe-inline' http://sampleserver6.arcgisonline.com http://js.arcgis.com/ https://js.arcgis.com/ https://jsdev.arcgis.com/ http://jsdev.arcgis.com/ https://static.arcgis.com",
      'font-src': "'self' http://fast.fonts.net https://fast.fonts.net http://workforce-dev.apps.esri.com.s3-website-us-east-1.amazonaws.com http://js.arcgis.com/ https://js.arcgis.com/",
      'connect-src': "'self' http://sampleserver6.arcgisonline.com http://www.arcgis.com https://www.arcgis.com http://services.arcgis.com https://services.arcgis.com http://js.arcgis.com/ https://js.arcgis.com/ http://services.arcgisonline.com https://services.arcgisonline.com https://geocode.arcgis.com http://static.arcgis.com/",
      'img-src': "'self' data: http://www.arcgis.com https://www.arcgis.com http://services.arcgis.com http://server.arcgisonline.com https://server.arcgisonline.com http://services.arcgisonline.com https://services.arcgisonline.com http://js.arcgis.com/ https://js.arcgis.com/ http://tiles1.arcgis.com/ http://tiles2.arcgis.com/ http://tiles3.arcgis.com/ http://tiles4.arcgis.com/",
      'style-src': "'self' 'unsafe-inline' https://fast.fonts.net http://js.arcgis.com/ https://js.arcgis.com/ https://jsdev.arcgis.com/ http://jsdev.arcgis.com",
      'media-src': "'self'"
    },

    apiHost: 'http://www.arcgis.com',

  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
