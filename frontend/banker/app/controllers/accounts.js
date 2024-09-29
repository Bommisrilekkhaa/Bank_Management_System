import Ember from 'ember';

export default Ember.Controller.extend({
  accountsService: Ember.inject.service('accounts'),

  accounts: [],
  init() {
    this._super(...arguments);
    this.loadAccounts();
  },

  loadAccounts() {
    this.get('accountsService').fetchAccounts().then((response) => {
      this.set('accounts', response);
    }).catch((error) => {
      console.error("Failed to load accounts:", error);
    });
  },

  actions: {
    addNewAccount() {
      
      this.transitionToRoute('inputform');
    },

  
    editAccount(account) {
      this.transitionToRoute('inputform').then((newRoute)=>{

        newRoute.controller.setProperties({
          isEdit: true,
          acc_no: account.acc_no,
          acc_type: account.acc_type,
          acc_balance: account.acc_balance,
          acc_status: account.acc_status,
          username: account.user_fullname,
          branch_name: account.branch_name
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    }
  }
});
