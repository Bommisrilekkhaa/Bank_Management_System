import Ember from 'ember';
import { getSessionData,role } from '../../utils/util';
export default Ember.Route.extend({
  beforeModel() {
    let bankId = localStorage.getItem('bankId');
    
    let sessionData = getSessionData();

    if (!sessionData) {
      this.transitionTo('super-admin-login');
      return;
    }

    let userId = sessionData.user_id;
    let userrole = sessionData.user_role;

    if (userrole !== role.SUPERADMIN) {
      this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
      return;
    }

    localStorage.setItem('bankId', '*');  
    localStorage.setItem('accNo', '*');  
    localStorage.setItem('loanId', '*');
    localStorage.setItem('userId', '*');
    localStorage.setItem('transactionId', '*');
    localStorage.setItem('branchId', '*');
  },

  setupController(controller, model) {
    controller.loadBanks();
  }
});
