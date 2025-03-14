import Ember from 'ember';

export default Ember.Controller.extend({

    sharedData:Ember.inject.service('shared-data'),
    actions:{
        toAccount()
        {
            this.transitionToRoute("banks.bank.accounts",this.get('sharedData').get('bankId'));
        }
      }
});
