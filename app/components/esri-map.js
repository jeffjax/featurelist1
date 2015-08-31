import Ember from 'ember';
import Graphic from 'esri/graphic';
import Point from 'esri/geometry/Point';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import Color from 'esri/Color';
import Feature from '../models/feature';

export default Ember.Component.extend({
  projectService: Ember.inject.service('project'),
  map: null,

  didInsertElement: function() {
    let projectService = this.get('projectService');
    projectService.loadMap(this.elementId).then(map => {
      this.set('map', map);
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
