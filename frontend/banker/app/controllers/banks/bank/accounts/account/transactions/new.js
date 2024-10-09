import Ember from 'ember';

export default Ember.Controller.extend({
    actions:{
        toTransaction()
        {
            this.transitionToRoute("banks.bank.accounts.account.transactions",localStorage.getItem('accNo'));
        }
      }

});
