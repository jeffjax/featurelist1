import Ember from 'ember';
import Assignment from '../models/assignment';
import Query from 'esri/tasks/query';

export default Ember.Service.extend({
  assignmentsLayer: null,
  assignments: null,

  queryAssignments: Ember.observer('assignmentsLayer', function() {
    var query = new Query();
    query.where = '1=1';
    query.outFields = ['*'];
   
    this.assignmentsLayer.queryFeatures(query).then(featureSet => {
      this.set('assignments', featureSet.features.map(graphic => {
        return Assignment.create({ graphic: graphic });
      }));
    });   
  })
});
