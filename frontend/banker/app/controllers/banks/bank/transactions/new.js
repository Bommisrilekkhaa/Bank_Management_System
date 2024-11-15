import Ember from 'ember';

export default Ember.Controller.extend({
    sharedData:Ember.inject.service('shared-data'),
    actions:{
        toTransaction()
        {
            this.transitionToRoute("banks.bank.transactions", this.get('sharedData').get('bankId'));
        }
      }

});
