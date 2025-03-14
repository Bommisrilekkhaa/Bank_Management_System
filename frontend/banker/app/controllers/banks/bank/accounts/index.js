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
    if(bankId!="*" && bankId)
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
      url=url+`&filter_type=${selectedType}`;
    }
    if(selectedStatus && selectedStatus!='')
    {
      url=url+`&filter_status=${selectedStatus}`;
    }
    if(searchQuery && searchQuery!='')
    {
      url=url+`&search_item=${searchQuery}`;
    }

    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      // console.log(response.data);
      this.set('accounts', response.data);
      this.set('totalAccounts',response.totalAccounts);
    }).catch((error) => {
      this.set('accounts', []);
      console.error("Failed to load accounts:", error);
    });
 
  },

  actions: {

    viewaccount(account)
    {
      document.getElementById('branch').value = account.branch_name;
      let bankId = this.get('sharedData').get('bankId');
      this.get('sharedData').set('branchId',account.branch_id);
      this.transitionToRoute('banks.bank.accounts.account',bankId,account.acc_no);
    },
    addNewAccount() {

      this.transitionToRoute('banks.bank.accounts.new');
        
    },

    editAccount(isEdit,account) {

    document.getElementById('branch').value = account.branch_name;
    let bankId = this.get('sharedData').get('bankId');
    this.get('sharedData').set('branchId',account.branch_id);
    console.log(account.branch_id)
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
          branch_Id:account.branch_id,
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
   
  }
});
