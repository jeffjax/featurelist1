import Ember from 'ember';
import arcgisUtils from 'esri/arcgis/utils';

export default Ember.Component.extend({
  projectService: Ember.inject.service('project'),
  map: null,

  didInsertElement: function() {
    const id = '350815f04ffa4757a636364e824d83d7';

    arcgisUtils.createMap(id, this.elementId, {
      usePopupManager: true
    }).then(response => {
      response.map.resize();

      // find the assignments and workers layers in the webmap
      // and give them to the projectService
      //
      var webmap = response.itemInfo.itemData;
      webmap.operationalLayers.forEach(layer => {
        if (layer.title === 'Assignments') {
          var assignmentsLayer = response.map.getLayer(layer.id);
          this.set('projectService.assignmentsLayer', assignmentsLayer);
        } else if (layer.title === 'Workers') {
          var workersLayer = response.map.getLayer(layer.id);
          this.set('projectService.workersLayer', workersLayer);
        }
      });

      this.set('map', response.map);
      this.set('registerAs', this);  // expose a property for clients of the component
                                     // in order to call methods like zoomTo() and highlight()
    });
  },

});
