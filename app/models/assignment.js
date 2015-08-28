import Ember from 'ember';
import Feature from './feature';

export default Feature.extend({
  location: Ember.computed('graphic', {
    get: function() {
      return this.get('graphic.attributes.location');
    },
    set: function(key, value) {
      this.get('graphic').attributes['location'] = value;
      return value;
    }
  }),

  typeCode: Ember.computed('graphic', {
    get: function() {
      return this.get('graphic.attributes.assignmentType');
    },
    set: function(key, value) {
      this.get('graphic').attributes['assignmentType'] = value;
      return value;
    }
  }),

  statusCode: Ember.computed('graphic', {
    get: function() {
      return this.get('graphic.attributes.status');
    },
    set: function(key, value) {
      this.get('graphic').attributes['status'] = value;
      return value;
    }  
  }),

  priorityCode: Ember.computed('graphic', {
    get: function() {
      return this.get('graphic.attributes.priority');
    },
    set: function(key, value) {
      this.get('graphic').attributes['priority'] = value;
      return value;
    }  
  }),

  description: Ember.computed('graphic', {
    get: function() {
      return this.get('graphic.attributes.description');
    },
    set: function(key, value) {
      this.get('graphic').attributes['description'] = value;
      return value;
    } 
  }),

  dueDate: Ember.computed('graphic', {
    get: function() {
      return this.get('graphic.attributes.dueDate');
    },
    set: function(key, value) {
      this.get('graphic').attributes['dueDate'] = value;
      return value;
    } 
  }),

  createdDate: Ember.computed('graphic', {
    get: function() {
      return this.get('graphic.attributes.created_date');
    }
  }),

  workerId: Ember.computed('graphic', {
    get: function() {
      return this.get('graphic.attributes.workerId');
    },
    set: function(key, value) {
      this.get('graphic').attributes['workerId'] = value;
      return value;
    }
  }),

  notes: Ember.computed('graphic', {
    get: function() {
      return this.get('graphic.attributes.notes');
    },
    set: function(key, value) {
      this.get('graphic').attributes['notes'] = value;
      return value;
    }    
  }),

  declinedComment: Ember.computed('graphic', {
    get: function() {
      return this.get('graphic.attributes.declinedComment');
    }
  }),

  type: Ember.computed('graphic', function() {
    return this.valueForDomain('assignmentType');
  }),

  status: Ember.computed('graphic', 'statusCode', function() {
    return this.valueForDomain('status');
  }),

  priority: Ember.computed('graphic', 'priorityCode', function() {
    return this.valueForDomain('priority');
  }),
});
