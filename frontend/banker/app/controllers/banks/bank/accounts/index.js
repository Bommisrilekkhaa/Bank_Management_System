import Ember from 'ember';
import {methods} from '../../../../utils/util';
export default Ember.Controller.extend({
  branchSelection: Ember.inject.service('branch-select'),
  fetchService: Ember.inject.service('fetch'),
  bankId: localStorage.getItem('bankId'),

  init() {
    this._super(...arguments);
    
    this.get('branchSelection').on('branchChanged', this, this.handleBranchChange);
  },

  handleBranchChange(newBranchId,currentRouteName) {
    console.log(currentRouteName);
    if(currentRouteName=='banks.bank.accounts.index')
    {
      this.loadAccounts();
    }
  },
  accounts: [],

  loadAccounts() {
    let url = `http://localhost:8080/banker/api/v1/`;
    let branchId = localStorage.getItem("branchId");
    let bankId = localStorage.getItem('bankId');
    if(bankId!="*")
    {
      url=url +`banks/${bankId}`;
    }
    if(branchId!='*')
    {
      url=url+`/branches/${branchId}`;
    }
    url=url+`/accounts`;

    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      console.log(response);
      this.set('accounts', response);
    }).catch((error) => {
      this.set('accounts', []);
      console.error("Failed to load accounts:", error);
    });
 
  },

  actions: {

    viewaccount(account)
    {
      localStorage.setItem('branchId',account.branch_id);
      localStorage.setItem('accNo',account.acc_no);
      // console.log("view...."+this.get('bankId'));

        this.transitionToRoute('banks.bank.accounts.account',this.get('bankId'),account.acc_no).then((newRoute)=>{
          newRoute.controller.setProperties({
            bankId:this.get('bankId'),
            branchId:account.branch_id,
            account:account
          });
        }).catch((error) => {
          console.error("Transition failed", error);
        });
    },
    addNewAccount() {
      console.log(this.get('bankId'));
      this.transitionToRoute('banks.bank.accounts.new').then((newRoute)=>{

        newRoute.controller.setProperties({
          bankId:this.get('bankId')
        });
        
      }).catch((error) => {
        console.error("Transition failed", error);
      });
        
    },

    editAccount(isEdit,account,branchId) {
      localStorage.setItem('branchId',branchId);
      localStorage.setItem('accNo',account.acc_no);
      this.transitionToRoute('banks.bank.accounts.account.edit',this.get('bankId'),account.acc_no).then((newRoute)=>{

        newRoute.controller.setProperties({
          isEdit: isEdit,
          accNo: account.acc_no,
          acc_type: account.acc_type,
          acc_balance: account.acc_balance,
          acc_status: account.acc_status,
          username:account.username,
          fullname: account.user_fullname,
          branch_name: account.branch_name,
          branch_Id:branchId,
          bankId:this.get('bankId'),
          userId:account.user_id
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    },
   
  },
  willDestroy() {
    this._super(...arguments);
    this.get('branchSelection').off('branchChanged', this, this.handleBranchChange);
  }
});
