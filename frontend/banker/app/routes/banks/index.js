import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    let bankId = localStorage.getItem('bankId');
    
    let getSessionData = () => {
      let value = `; ${document.cookie}`;
      let parts = value.split(`; sessionData=`);
      if (parts.length === 2) {
        let cookieData = decodeURIComponent(parts.pop().split(';').shift());
        return JSON.parse(cookieData);
      }
      return null;
    };

    let sessionData = getSessionData();

    if (!sessionData) {
      this.transitionTo('super-admin-login');
      return;
    }

    let userId = sessionData.user_id;
    let role = sessionData.user_role;

    if (role !== 'SUPERADMIN') {
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
