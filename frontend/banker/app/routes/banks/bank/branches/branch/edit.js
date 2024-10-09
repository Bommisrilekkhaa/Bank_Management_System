import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel()
  {
    if(document.cookie =='')
      {
          this.transitionTo('login');
      }
    },
    model(params) {
        return this.modelFor('banks.bank'); 
      },
      setupController(controller, model) {
        controller.set('bankId', model.bankId); 
        this._super(controller, model);
      }
});
