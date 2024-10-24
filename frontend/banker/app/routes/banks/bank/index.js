import Ember from 'ember';
import { getSessionData,role } from '../../../utils/util';
export default Ember.Route.extend({
  beforeModel() {
    
    let sessionData = getSessionData();

    if (!sessionData) {
      this.transitionTo('login');
      return;
    }


    localStorage.setItem('accNo', '*');
    localStorage.setItem('loanId', '*');
    localStorage.setItem('transactionId', '*');
    if(sessionData.user_role != role.MANAGER)
    {
      localStorage.setItem('branchId', '*');
    }
  },
  setupController(controller, model) {
    controller.loadBanks();
  }

});