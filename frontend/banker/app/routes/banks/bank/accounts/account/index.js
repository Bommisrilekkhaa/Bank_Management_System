import Ember from 'ember';
import { getSessionData,role } from '../../../../../utils/util';
export default Ember.Route.extend({

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
    localStorage.setItem('loanId', '*');
    localStorage.setItem('transactionId', '*');
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.loadAccount();
  }
});
