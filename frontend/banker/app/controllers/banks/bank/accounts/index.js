import Ember from 'ember';
import {methods} from '../../../../utils/util';
export default Ember.Controller.extend({
  branchSelection: Ember.inject.service('branch-select'),
  fetchService: Ember.inject.service('fetch'),
  sharedData:Ember.inject.service('shared-data'),
  init() {
    this._super(...arguments);
    
    this.get('branchSelection').on('branchChanged', this, this.handleBranchChange);
  },

  handleBranchChange(currentRouteName) {
    // console.log(currentRouteName);
    if(currentRouteName=='banks.bank.accounts.index')
    {
      this.loadAccounts(1);
    }
  },
  accounts: [], 

  loadAccounts(page,selectedType,selectedStatus,searchQuery) {
    let url = `http://localhost:8080/banker/api/v1/`;
    let branchId = this.get('sharedData').get('branchId');
    let bankId = this.get('sharedData').get('bankId');
    if(bankId!="*")
    {
      url=url +`banks/${bankId}`;
    }
    if(branchId!='*')
    {
      url=url+`/branches/${branchId}`;
    }
    url=url+`/accounts?page=${page}`;
    if(selectedType && selectedType!='')
    {
      url=url+`&filtertype=${selectedType}`;
    }
    if(selectedStatus && selectedStatus!='')
    {
      url=url+`&filterstatus=${selectedStatus}`;
    }
    if(searchQuery && searchQuery!='')
    {
      url=url+`&searchitem=${searchQuery}`;
    }

    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      // console.log(response[0].data);
      this.set('accounts', response[0].data);
      this.set('totalAccounts',response[0].totalAccounts);
    }).catch((error) => {
      this.set('accounts', []);
      console.error("Failed to load accounts:", error);
    });
 
  },

  actions: {

    viewaccount(account)
    {
      let bankId = this.get('sharedData').get('bankId');
      // console.log("view...."+this.get('bankId'));

      this.get('sharedData').set('branchId',account.branch_id);
        this.transitionToRoute('banks.bank.accounts.account',bankId,account.acc_no).then((newRoute)=>{
          newRoute.controller.setProperties({
            bankId:bankId,
            branchId:account.branch_id,
            account:account
          });
        }).catch((error) => {
          console.error("Transition failed", error);
        });
    },
    addNewAccount() {

    let bankId = this.get('sharedData').get('bankId');
      // console.log(this.get('bankId'));
      this.transitionToRoute('banks.bank.accounts.new').then((newRoute)=>{

        newRoute.controller.setProperties({
          bankId:bankId
        });
        
      }).catch((error) => {
        console.error("Transition failed", error);
      });
        
    },

    editAccount(isEdit,account,branchId) {

    let bankId = this.get('sharedData').get('bankId');
    this.get('sharedData').set('branchId',branchId);
      this.transitionToRoute('banks.bank.accounts.account.edit',bankId,account.acc_no).then((newRoute)=>{

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
          bankId:bankId,
          userId:account.user_id
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    },

    changeAccounts(page,selectedType,selectedStatus,searchQuery)
    {
      this.loadAccounts(page,selectedType,selectedStatus,searchQuery);
    }
   
  },
  willDestroy() {
    this._super(...arguments);
    this.get('branchSelection').off('branchChanged', this, this.handleBranchChange);
  }
});
