import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
      goToPage(page) {
        this.sendAction('goToPage', page);},
  
      nextPage() {
        this.sendAction('nextPage'); },
  
      previousPage() {
        this.sendAction('previousPage'); },
    }
});
