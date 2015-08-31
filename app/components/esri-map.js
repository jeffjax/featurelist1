import Ember from 'ember';
import arcgisUtils from 'esri/arcgis/utils';
import Graphic from 'esri/graphic';
import Point from 'esri/geometry/Point';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import Color from 'esri/Color';
import Feature from '../models/feature';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import jsonUtils from 'esri/renderers/jsonUtils';

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
          const assignmentsLayer = response.map.getLayer(layer.id),
                index = response.map.graphicsLayerIds.indexOf(layer.id);
     
          const assignmentsGraphicsLayer = new GraphicsLayer();
          assignmentsGraphicsLayer.renderer = jsonUtils.fromJson(assignmentsLayer.renderer.toJson());

          response.map.addLayer(assignmentsGraphicsLayer, index);
          response.map.removeLayer(assignmentsLayer);
          
          this.set('projectService.assignmentsLayer', assignmentsLayer);
          this.set('projectService.assignmentsGraphicsLayer', assignmentsGraphicsLayer);
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

  zoomTo: function(pointOrFeature) {
    var point = null;
    if (Point.prototype.isPrototypeOf(pointOrFeature)) {
      point = pointOrFeature;
    } else if (Feature.prototype.isPrototypeOf(pointOrFeature)) {
      point = pointOrFeature.get('geometry');
    } else {
      return;
    }

    this.map.centerAndZoom(point, 18);

    // delay highlighting to give the map a chance to draw
    //
    Ember.run.later(() => {
      this.highlight(point);
    }, 500);    
  },

  highlight: function(point) {
    // draw a graphic on the map then remove it
    // 
    var symbol = new SimpleMarkerSymbol();
    symbol.size = 64;
    symbol.outline.width = 2;
    symbol.outline.color = new Color([116, 142, 252]);
    symbol.color = new Color([116, 142, 252, 0.25]);

    var graphic = new Graphic(point, symbol);
    this.map.graphics.add(graphic);

    Ember.run.later(() => {
      this.map.graphics.remove(graphic);
    }, 1000);
  }
});
