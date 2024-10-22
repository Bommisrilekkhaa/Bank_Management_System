import Ember from 'ember';

export default Ember.Controller.extend({

  dashboardService: Ember.inject.service('dashboard'),
  getSessionData(){
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${'sessionData'}=`);
    if (parts.length === 2) {
      let cookieData = decodeURIComponent(parts.pop().split(';').shift());
      let sessionData = JSON.parse(cookieData);
      this.set('sessionData',sessionData);
    }
  },

  fetchAdminDashboard() {
    this.getSessionData();
    this.get('dashboardService').fetchAdminDashboard().then((response) => {
      this.set('branches', response);
    }).catch((error) => {
      console.error("Failed to load dashboard:", error);
    });
  },
  fetchManagerDashboard() {
    this.getSessionData();
    this.get('dashboardService').fetchManagerDashboard().then((response) => {
      this.set('branches', response);
      let array = this.get('branches');
      for (let i = 0; i < array.length; i++) {
        let item = array[i];
        if (item['manager_id'] == this.get('sessionData').user_id) {
          this.set('branch', item);
          localStorage.setItem('branchId', this.get('branch').branch_id)
          // console.log(this.get('branch'));
          break;
        }
      }


    }).catch((error) => {
      console.error("Failed to load dashboard:", error);
    });
  },

  fetchCustomerDashboard(){
    this.getSessionData();
    this.get('dashboardService').fetchCustomerDashboard().then((response) => {
      console.log(response);
           
      let accounts = [];
      for (let i = 0; i < response.length; i++) {
          let account = response[i];
              let accountData = {
                  acc_no: account.acc_no,
                  acc_type: account.acc_type,
                  acc_balance: account.acc_balance,
                  acc_status: account.acc_status
              };

              let loanDetails = account.loan_details || null; 
              let transactions = account.transactions || [];

             
              accounts.push({
                  account: accountData,
                  loan_details: loanDetails,
                  transactions: transactions
              });
          }

        
          this.set('accountList', accounts);

        }).catch((error) => {
          console.error("Failed to load dashboard:", error);
        });
  }

});