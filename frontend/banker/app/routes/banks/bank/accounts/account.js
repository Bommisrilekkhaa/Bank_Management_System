import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
            return { 
                bankId: params.bankId 
            };
            
          },
          setupController(controller,model){
            controller.set('bankId',model.bankId);
            // controller.loadAccounts();
          }
});
