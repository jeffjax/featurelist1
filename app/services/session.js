import Ember from 'ember';
import esriId from 'esri/IdentityManager';
import OAuthInfo from 'esri/arcgis/OAuthInfo';
import Portal from 'esri/arcgis/Portal';
import ENV from '../config/environment';

export default Ember.Service.extend({
  credential: null,
  portal: null,

  userId:   Ember.computed.alias('portal.username'),

  initialize: function() {
    // bail if initialization already took place
    //
    var portal = this.get('portal');
    if (portal) {
      return Ember.RSVP.resolve(this);
    }

    var oAuthInfo = new OAuthInfo({
      appId: 'sNtQbNxpKsBTY7He'
    });

    esriId.registerOAuthInfos([oAuthInfo]);
    return new Ember.RSVP.Promise(resolve => {
      esriId.checkSignInStatus(ENV.apiHost).then((credential) => {
        return this.createPortal(credential).then(() => {
          resolve();
        });
      }).otherwise(() => {
        resolve();
      });
    });
  },

  createPortal: function(credential) {
    var self = this;
    self.set('credential', credential);

    return new Ember.RSVP.Promise(function(resolve) {
      var portal = new Portal.Portal(ENV.apiHost);
      portal.signIn().then(() => {
        self.set('portal', portal);
        resolve();
      });
    });
  },

  isAuthenticated: Ember.computed('portal', function() {
    return this.get('portal') != null;
  }),

  authenticate: function() {
    esriId.getCredential(ENV.apiHost).then(credential => {
      this.createPortal(credential);
    });
  },

  invalidate: function() {
    this.set('credential', null);
    this.set('portal', null);
    esriId.destroyCredentials();
  }

});
