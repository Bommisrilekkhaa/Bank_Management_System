import Ember from 'ember';

export default Ember.Controller.extend({

  actions:{
    toAccount()
    {
        this.transitionToRoute("banks.bank.accounts",this.get('bankId'));
    }
  }
});
