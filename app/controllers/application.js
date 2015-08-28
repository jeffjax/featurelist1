import Ember from 'ember';

export default Ember.Controller.extend({
  projectService: Ember.inject.service('project'),
  esriMap:          null,  // the esri-map component, will be set by template binding

  assignments: Ember.computed('projectService.assignments.@each', function() {
    var assignments = this.get('projectService.assignments');

    if (!assignments) {
      return null;
    }

    return assignments;
  }),

  actions: {
    zoomTo: function(assignment) {
      this.get('esriMap').zoomTo(assignment);
      console.log(assignment.get('graphic'));
    }
  }
});
