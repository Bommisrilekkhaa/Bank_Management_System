import Ember from 'ember';

export default Ember.Component.extend({
  message: '',
  type: '',

  classNameBindings: ['type', 'notification-top-right'],
 
  
});