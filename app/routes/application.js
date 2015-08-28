import Ember from 'ember';

export default Ember.Route.extend( {
  beforeModel: function() {
    return this.session.initialize();
  },

  actions: {
    authenticateSession: function() {
      this.session.authenticate();
    },

    invalidateSession: function() {
      this.session.invalidate();
      this.transitionToRoute('/');
    }
  }

});
