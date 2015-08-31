import Ember from 'ember';

export default Ember.Controller.extend({
  projectService: Ember.inject.service('project'),
  assignments: Ember.computed.alias('projectService.filteredAssignments'),
  updateCount: Ember.computed.alias('projectService.updateCount'),
  filterText: Ember.computed.alias('projectService.filterText'),

  esriMap:          null,  // the esri-map component, will be set by template binding

  actions: {
    zoomTo: function(assignment) {
      this.get('esriMap').zoomTo(assignment);
      console.log(assignment.get('graphic'));
    }
  }
});
