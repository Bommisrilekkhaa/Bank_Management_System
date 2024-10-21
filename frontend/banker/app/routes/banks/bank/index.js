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
      this.transitionTo('login');
      return;
    }


    localStorage.setItem('accNo', '*');
    localStorage.setItem('loanId', '*');
    localStorage.setItem('transactionId', '*');
    if(sessionData.user_role != 'MANAGER')
    {
      localStorage.setItem('branchId', '*');
    }
  },
  setupController(controller, model) {
    controller.loadBanks();
  }

});