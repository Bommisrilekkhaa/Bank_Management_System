import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel()
  {
    if(document.cookie =='')
      {
          this.transitionTo('login');
      }
  },
      setupController(controller, model) {
        this._super(controller, model);
        controller.loadLoans();
      }
    
});
