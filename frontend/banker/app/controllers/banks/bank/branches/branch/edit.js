import Ember from 'ember';

export default Ember.Controller.extend({

    sharedData:Ember.inject.service('shared-data'),
    actions:{
        toBranch()
        {
            this.transitionToRoute("banks.bank.branches",this.get('sharedData').get('bankId'));
        }
      }
});
