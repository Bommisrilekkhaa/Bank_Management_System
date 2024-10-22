import Ember from 'ember';

export default Ember.Route.extend({
  branchSelection: Ember.inject.service('branch-select'),
  beforeModel() {

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
      this.transitionTo('login');
      return;
    }

    let role = sessionData.user_role;

    if (role == 'SUPERADMIN') {
      this.transitionTo('users');
      return;
    }

    localStorage.setItem('transactionId', '*');
    localStorage.setItem('accNo', '*');
    if(role != 'MANAGER')
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
