import Ember from 'ember';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import jsonUtils from 'esri/renderers/jsonUtils';
import Query from 'esri/tasks/query';
import Graphic from 'esri/graphic';

export default Ember.Object.extend({
  featureLayer: null,
  graphicsLayer: null,
  filter: null,

  init: function() {
    const map = this.get('map'),
          featureLayer = map.getLayer(this.get('layerId')),
          index = map.graphicsLayerIds.indexOf(this.get('layerId')),
          graphicsLayer = new GraphicsLayer();
    
    graphicsLayer.renderer = jsonUtils.fromJson(featureLayer.renderer.toJson());

    map.addLayer(graphicsLayer, index);
    map.removeLayer(featureLayer);
    
    this.setProperties({ graphicsLayer : graphicsLayer, featureLayer: featureLayer });
  },

  query: function() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      const query = new Query();
      query.where = '1=1';
      query.outFields = ['*'];
      query.orderByFields = ['last_edited_date desc'];

      this.featureLayer.refresh();  // without this we get cached results back

      this.featureLayer.queryFeatures(query).then(featureSet => {

        resolve(featureSet);
        this.graphicsLayer.clear();

        for (var i = 0; i < featureSet.features.length; i++) {
          let graphic = new Graphic(featureSet.features[i].toJson());

          this.graphicsLayer.add(graphic);
          if (!this.filter(graphic, i)) {
            graphic.hide();
          }
        }
      });   
    });
  }
});