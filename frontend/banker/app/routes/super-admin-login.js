import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel() {
        if (document.cookie != '') {
            this.transitionTo('users');
        }
        localStorage.setItem('bankId', "*");
    }

});
