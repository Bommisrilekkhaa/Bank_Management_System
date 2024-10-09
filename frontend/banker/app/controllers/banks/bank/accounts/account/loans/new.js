import Ember from 'ember';

export default Ember.Controller.extend({
    actions:{
        toLoan()
        {
            this.transitionToRoute("banks.bank.accounts.account.loans",localStorage.getItem('accNo'));
        }
      }

});
