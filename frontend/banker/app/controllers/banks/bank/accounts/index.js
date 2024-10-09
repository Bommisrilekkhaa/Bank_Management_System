import Ember from 'ember';

export default Ember.Controller.extend({
  branchesService: Ember.inject.service('branches'),
  accountsService: Ember.inject.service('accounts'),
  bankId: localStorage.getItem('bankId'),
  init() {
    // console.log("controller");
    // this._super(...arguments);
    // console.log(this.get('model.id'));
    // this.loadAccounts();
  },
  accounts: [],

  loadAccounts() {
    console.log(this.get('bankId'));
    this.get('accountsService').fetchAccounts(this.get('bankId')).then((response) => {
      console.log(response);
      this.set('accounts', response);
    }).catch((error) => {
      console.error("Failed to load accounts:", error);
    });
  },

  actions: {

    viewaccount(account)
    {
      this.get('branchesService').set('branchId',account.branch_id);
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
          bankId:this.get('bankId')
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    },
   
  }
});
