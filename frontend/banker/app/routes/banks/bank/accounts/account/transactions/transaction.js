import Ember from 'ember';
import { getSessionData,role } from '../../../../../../utils/util';
export default Ember.Route.extend({
  sharedData:Ember.inject.service('shared-data'),
  beforeModel() {
   
    let sessionData = getSessionData();

    if (!sessionData) {
      this.transitionTo('login');
      return;
    }

    let userrole = sessionData.user_role;

    if (userrole == role.SUPERADMIN) {
      this.transitionTo('users');
      return;
    }
  }, 
  model(params)
  {
      this.get('sharedData').set('transactionId', params.transactionId);
      return params;
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.loadTransaction( this.get('sharedData').get('transactionId'));
  }
});
