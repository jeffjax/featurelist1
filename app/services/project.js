import Ember from 'ember';
import Assignment from '../models/assignment';
import Query from 'esri/tasks/query';
import Graphic from 'esri/graphic';

export default Ember.Service.extend({
  assignmentsLayer: null,
  assignmentsGraphicsLayer: null,
  assignments: null,

  updateInterval: 5000,


  init: function() {
    this.set('timer', Ember.run.later(this, this.heartbeat, this.updateInterval));
  },

  heartbeat: function() {
    this.set('timer', Ember.run.later(this, this.heartbeat, this.updateInterval));

    if (this.assignmentsLayer) {
      this.queryAssignments();
    }
  },

  queryAssignments: Ember.observer('assignmentsLayer', function() {
    var query = new Query();
    query.where = '1=1';
    query.outFields = ['*'];
    query.orderByFields = ['last_edited_date desc'],

    this.assignmentsLayer.queryFeatures(query).then(featureSet => {
      this.set('assignments', featureSet.features.map(graphic => {
        return Assignment.create({ graphic: graphic });
      }));

      this.assignmentsGraphicsLayer.clear();
      featureSet.features.forEach(graphic => {
        let symbol = this.assignmentsLayer.renderer.getSymbol(graphic);
        let clone = new Graphic(graphic.toJson())
        clone.setSymbol(symbol);
        this.assignmentsGraphicsLayer.add(clone);
      });
    });   
  })
});
