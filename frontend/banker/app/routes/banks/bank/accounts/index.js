import Ember from 'ember';

export default Ember.Route.extend({

    model(params) {
        return this.modelFor('banks.bank'); // fetches the model from the parent route
      },
      setupController(controller, model) {
        controller.set('bankId', model.bankId); // sets the bankId in the controller
        this._super(controller, model);
        controller.loadAccounts();
      }
    
});
