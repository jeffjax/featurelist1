import Ember from 'ember';
import arcgisUtils from 'esri/arcgis/utils';
import Assignment from '../models/assignment';
import Query from 'esri/tasks/query';
import Graphic from 'esri/graphic';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import jsonUtils from 'esri/renderers/jsonUtils';

export default Ember.Service.extend({
  assignmentsLayer: null,
  assignmentsGraphicsLayer: null,
  assignments: null,

  updateInterval: 5000,
  updateCount: 0,
  filterText: null,

  loadMap: function(mapElementId) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      const id = '350815f04ffa4757a636364e824d83d7';

      arcgisUtils.createMap(id, mapElementId, {
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
            
            this.set('assignmentsLayer', assignmentsLayer);
            this.set('assignmentsGraphicsLayer', assignmentsGraphicsLayer);
          } else if (layer.title === 'Workers') {
            var workersLayer = response.map.getLayer(layer.id);
            this.set('workersLayer', workersLayer);
          }

          resolve(response.map);
        });
    
        this.set('timer', Ember.run.later(this, this.heartbeat, this.updateInterval));
      });
    });
  },

  heartbeat: function() {
    this.set('timer', Ember.run.later(this, this.heartbeat, this.updateInterval));

    if (this.assignmentsLayer) {
      this.queryAssignments();
    }
  },

  queryAssignments: Ember.observer('assignmentsLayer', function() {
    let query = new Query();
    query.where = '1=1';
    query.outFields = ['*'];
    query.orderByFields = ['last_edited_date desc'];

    this.assignmentsLayer.refresh();  // without this we get cached results back

    this.assignmentsLayer.queryFeatures(query).then(featureSet => {
      this.incrementProperty('updateCount');

      let assignments = featureSet.features.map(graphic => {
        graphic.attributes.status = Math.floor(Math.random() * 6);
        return Assignment.create({ graphic: graphic });
      });

      this.set('assignments', assignments);

      this.assignmentsGraphicsLayer.clear();

      assignments.forEach(assignment => {
        let graphic = new Graphic(assignment.get('graphic').toJson());

        this.assignmentsGraphicsLayer.add(graphic);
        if (!this.satisfiesFilter(assignment)) {
          graphic.hide();
        }
      });
    });   
  }),


  satisfiesFilter: function(assignment) {
    if (!this.filterText) {
      return true;
    }

    var filter = this.filterText.toLowerCase();
    var type = assignment.get('type') || '';
    var location = assignment.get('location') || '';

    return type.toLowerCase().indexOf(filter) > -1 ||
      location.toLowerCase().indexOf(filter) > -1;
  },

  filterAssignmentGraphics: Ember.observer('filterText', function() {
    let assignments = this.get('assignments');

    // update the graphics already on the map
    //
    for (let i = 0; i < assignments.length; i++) {
      let graphic = this.assignmentsGraphicsLayer.graphics[i];

      if (this.satisfiesFilter(assignments[i])) {
        graphic.show();
      } else {
        graphic.hide();
      }
    }
  }),

  filteredAssignments: Ember.computed('assignments.@each', 'filterText', function() {

    let assignments = this.get('assignments');
    if (!assignments) {
      return null;
    }   

    return assignments
      .filter(assignment => this.satisfiesFilter(assignment));
    }),
});
