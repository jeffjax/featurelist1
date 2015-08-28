import Ember from 'ember';

export default Ember.Controller.extend({
  projectService: Ember.inject.service('project'),

  assignments: Ember.computed('projectService.assignments.@each', function() {
    var assignments = this.get('projectService.assignments');

    if (!assignments) {
      return null;
    }

    return assignments;
  })
});
