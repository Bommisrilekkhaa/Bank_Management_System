import Ember from 'ember';

export default Ember.Controller.extend({

  actions:{
    toBranch()
    {
        this.transitionToRoute("banks.bank.branches",localStorage.getItem("bankId"));
    }
  }
});
