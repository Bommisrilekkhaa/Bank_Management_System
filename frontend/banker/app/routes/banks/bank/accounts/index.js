import Ember from 'ember';
import { getSessionData,role } from '../../../../utils/util';
export default Ember.Route.extend({
  branchSelection: Ember.inject.service('branch-select'),
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

    localStorage.setItem('transactionId', '*');
    localStorage.setItem('accNo', '*');
    if(userrole != role.MANAGER)
    {
      localStorage.setItem('branchId', '*');
    }
    localStorage.setItem('loanId', '*');
  },
  setupController(controller, model) {
    this._super(controller, model);
    controller.loadAccounts();
  }
});
