import Ember from 'ember';
import {methods} from '../../../../../utils/util';
export default Ember.Controller.extend({
  acc:[],
  fetchService: Ember.inject.service('fetch'),
  sharedData:Ember.inject.service('shared-data'),
  loadAccount(accNo) {
    let url = `http://localhost:8080/banker/api/v1/`;
  let bankId = this.get('sharedData').get('bankId');
    let branchId = this.get('sharedData').get('branchId');
    if(bankId!="*" && bankId)
    {
      url=url +`banks/${bankId}`;
    }
    if(branchId!='*')
    {
      url=url+`/branches/${branchId}`;
    }
    if(accNo!="*")
    {
      url = url+`/accounts/${accNo}`;
    }

    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      // console.log(response);
      this.set('acc', response.data);
      this.set('acc',this.get('acc')[0]);
    }).catch((error) => {
      console.error("Failed to load account:", error);
    });
  },

  accountData: Ember.computed('acc', function () {
    let acc = this.get('acc');
    return [
      { label: "Account Number", value: acc.acc_no },
      { label: "Account Type", value: acc.acc_type },
      { label: "Account Balance", value: `Rs. ${acc.acc_balance}` },
      { label: "Branch Name", value: acc.branch_name },
      { label: "Status", value: acc.acc_status }
    ];
  }),

  actions:{
    toLoans()
    {
      this.transitionToRoute('banks.bank.accounts.account.loans',this.get('sharedData').get('accNo'));
    },
    toTransactions()
    {
      this.transitionToRoute('banks.bank.accounts.account.transactions',this.get('sharedData').get('accNo'));
    }
  }
});
