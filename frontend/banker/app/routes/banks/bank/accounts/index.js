import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel()
  {
    if(document.cookie =='')
      {
          this.transitionTo('login');
      }
    localStorage.setItem('accNo','*');  
    localStorage.setItem('branchId','*');
    localStorage.setItem('loanId','*');
  },
      setupController(controller, model) {
        this._super(controller, model);
        controller.loadAccounts();
      }
    
});
