import Ember from 'ember';

export default Ember.Object.extend({
  graphic: null,  // the raw AGS graphic
  id: Ember.computed.alias('graphic.attributes.OBJECTID'),
  geometry: Ember.computed.alias('graphic.geometry'),

  // returns the domain name for specified field
  //
  valueForDomain: function(fieldName) {
    var domain = this.graphic.getLayer().getDomain(fieldName);
    var value = this.graphic.attributes[fieldName];
    return domain.getName(value);
  },

  // returns the symbol for the feature
  //
  symbolUrl: Ember.computed(function() {
    var symbol = this.graphic.getLayer().renderer.getSymbol(this.graphic);
    return symbol.url;
  })

});
