import Ember from 'ember';

export default Ember.Controller.extend({
    sharedData:Ember.inject.service('shared-data'),
    actions:{
        toLoan()
        {
            this.transitionToRoute("banks.bank.loans",this.get('sharedData').get('bankId'));
        }
      }
});
z