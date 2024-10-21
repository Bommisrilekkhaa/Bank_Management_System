import Ember from 'ember';

export default Ember.Route.extend({
  resetNamespace: true,  // Ensure fresh route
  queryParams: {
    refreshModel: true,  // Reload model on param change
  },
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

    localStorage.setItem('accNo', '*');
    localStorage.setItem('loanId', '*');
    localStorage.setItem('transactionId', '*');
    if (sessionData.user_role != 'MANAGER') {
      localStorage.setItem('branchId', '*');
    }
  },



  setupController(controller, model) {

    this._super(controller, model);


    controller.loadTransactions();
  }

});
