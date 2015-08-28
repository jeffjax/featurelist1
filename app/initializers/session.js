export default {
  name: 'session',
  initialize: function(container, app) {
    app.inject('route', 'session', 'service:session');
    app.inject('controller', 'session', 'service:session');
  }
};