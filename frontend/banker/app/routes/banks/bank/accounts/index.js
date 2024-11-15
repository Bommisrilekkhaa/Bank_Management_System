import Ember from 'ember';
import { getSessionData,role } from '../../../../utils/util';
export default Ember.Route.extend({
  branchSelection: Ember.inject.service('branch-select'),
  sharedData:Ember.inject.service('shared-data'),
  beforeModel() {
    let sessionData = getSessionData();

    if (!sessionData) {
      this.transitionTo('login');
      return;
    }

    let userrole = sessionData.user_role;

    if(userrole == role.SUPERADMIN) {
      this.transitionTo('users');
      return;
    }
    this.get('sharedData').set('transactionId', '*');
    this.get('sharedData').set('accNo', '*');
    if(userrole != role.MANAGER)
    {
      this.get('sharedData').set('branchId', '*');
    }
    this.get('sharedData').set('loanId', '*');
  },
  setupController(controller, model) {
    this._super(controller, model);
    controller.loadAccounts(1);
  }
});
