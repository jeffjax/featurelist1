import Ember from 'ember';
import Assignment from '../models/assignment';
import Query from 'esri/tasks/query';
import Graphic from 'esri/graphic';

export default Ember.Service.extend({
  assignmentsLayer: null,
  assignmentsGraphicsLayer: null,
  assignments: null,

  updateInterval: 5000,
  updateCount: 0,
  filterText: null,

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
    let query = new Query();
    query.where = '1=1';
    query.outFields = ['*'];
    query.orderByFields = ['last_edited_date desc'];

    this.assignmentsLayer.refresh();  // without this we get cached results back

    this.assignmentsLayer.queryFeatures(query).then(featureSet => {
      this.incrementProperty('updateCount');

      let assignments = featureSet.features.map(graphic => {
        return Assignment.create({ graphic: graphic });
      });

      this.set('assignments', assignments);

      this.assignmentsGraphicsLayer.clear();

      assignments.forEach(assignment => {
        let graphic = assignment.get('graphic');
        let symbol = this.assignmentsLayer.renderer.getSymbol(graphic);
        let clone = new Graphic(graphic.toJson());
        clone.setSymbol(symbol);
        this.assignmentsGraphicsLayer.add(clone);
        if (!this.satisfiesFilter(assignment)) {
          clone.hide();
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
