import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel()
  {
    if(document.cookie =='')
      {
          this.transitionTo('login');
      }
    localStorage.setItem('accNo','*');  
    localStorage.setItem('loanId','*');

    localStorage.setItem('branchId','*');
  },
  model(params) {
    return this.modelFor('banks.bank');
  },

  setupController(controller, model) {

    this._super(controller, model);

  
      controller.loadTransactions();
  }

});
