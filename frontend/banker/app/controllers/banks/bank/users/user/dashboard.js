import Ember from 'ember';
import { methods, role } from '../../../../../utils/util';
export default Ember.Controller.extend({

  fetchService: Ember.inject.service('fetch'),
  sharedData:Ember.inject.service('shared-data'),
  userRole:role,
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
    let bankId=this.get('sharedData').get('bankId');
    let url = `http://localhost:8080/banker/api/v1/banks/${bankId}/users/${this.get('sessionData').user_id}/dashboard`;
 
    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      this.set('branches', response);
    }).catch((error) => {
      console.error("Failed to load dashboard:", error);
    });
  },
  fetchManagerDashboard() {
    this.getSessionData();
    let bankId=this.get('sharedData').get('bankId');
    let url = `http://localhost:8080/banker/api/v1/banks/${bankId}/users/${this.get('sessionData').user_id}/dashboard`;
 
    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      this.set('branches', response);
      let array = this.get('branches');
      for (let i = 0; i < array.length; i++) {
        let item = array[i];
        if (item['manager_id'] == this.get('sessionData').user_id) {
          this.set('branch', item);
          this.get('sharedData').set('branchId', this.get('branch').branch_id);
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
    let bankId=this.get('sharedData').get('bankId');
    let url = `http://localhost:8080/banker/api/v1/banks/${bankId}/users/${this.get('sessionData').user_id}/dashboard`;
     
    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      // console.log(response);
           
      let accounts = [];
      let loans=[];
      let transactions=[];
      for (let i = 0; i < response.length; i++) {
          let account = response[i];
              let accountData = {
                  acc_no: account.acc_no,
                  acc_type: account.acc_type,
                  acc_balance: account.acc_balance,
                  acc_status: account.acc_status
              };

              let loanDetails = account.loan_details || null; 
              let transaction = account.transactions || [];

             
              accounts.push(accountData);
              loans.push(loanDetails);
              for (let i = 0; i < transaction.length; i++)
              {
                let transac = transaction[i];
                transactions.push(transac);
              }
          }

          this.set('loanList',loans);
          this.set('accountList', accounts);
          this.set('transactionList',transactions);

        }).catch((error) => {
          console.error("Failed to load dashboard:", error);
        });
  }

});