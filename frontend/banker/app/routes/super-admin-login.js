import Ember from 'ember';

export default Ember.Route.extend({
    sharedData:Ember.inject.service('shared-data'),
    beforeModel() {
        if (document.cookie != '') {
            this.transitionTo('users');
        } 
        this.get('sharedData').set('bankId','*');
    }

});
