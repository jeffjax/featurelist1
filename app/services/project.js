import Ember from 'ember';
import Assignment from '../models/assignment';
import Query from 'esri/tasks/query';

export default Ember.Service.extend({
  assignmentsLayer: null,
  assignments: null,

  updateInterval: 5000,


  init: function() {
    this.set('timer', Ember.run.later(this, this.heartbeat, this.updateInterval));
  },

  heartbeat: function() {
    this.set('timer', Ember.run.later(this, this.heartbeat, this.updateInterval));

    if (this.assignmentsLayer) {
      this.assignmentsLayer.refresh();
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
    });   
  })
});
