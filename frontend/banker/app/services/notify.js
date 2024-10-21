import Ember from 'ember';

export default Ember.Service.extend({
  message: '',
  type: '',
  isNotificationVisible: false,

  showNotification(message, type) {
    this.set('message', message);
    this.set('type', type);
    this.set('isNotificationVisible', true);

    Ember.run.later(this, function() {
      this.clearNotification();
    }, 2000);
  },

  clearNotification() {
    this.set('isNotificationVisible', false);
    this.set('message', '');
    this.set('type', '');
  }
});
