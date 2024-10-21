import Ember from 'ember';

export default Ember.Controller.extend({
    actions:{
        toTransaction()
        {
            this.transitionToRoute("banks.bank.transactions",localStorage.getItem('bankId'));
        }
      }

});
