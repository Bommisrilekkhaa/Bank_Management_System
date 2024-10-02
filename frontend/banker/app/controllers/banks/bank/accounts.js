import Ember from 'ember';

export default Ember.Controller.extend({
  // accountsService: Ember.inject.service('accounts'),
  // bankId: '',
  // init() {
  //   // console.log("controller");
  //   // this._super(...arguments);
  //   // console.log(this.get('model.id'));
  //   // this.loadAccounts();
  // },
  // accounts: [],

  // loadAccounts() {
  //   console.log(this.get('bankId'));
  //   this.get('accountsService').fetchAccounts(this.get('bankId')).then((response) => {
  //     console.log(response);
  //     this.set('accounts', response);
  //   }).catch((error) => {
  //     console.error("Failed to load accounts:", error);
  //   });
  // },

  // actions: {
  //   addNewAccount() {
  //     console.log(this.get('bankId'));
  //     this.transitionToRoute('banks.bank.accounts.new').then((newRoute)=>{

  //       newRoute.controller.setProperties({
  //         bankId:this.get('bankId')
  //       });
  //     }).catch((error) => {
  //       console.error("Transition failed", error);
  //     });
        
  //   },

  //   editAccount(account) {
  //     this.transitionToRoute('banks.bank.accounts.account.edit',this.get('bankId'),accountId).then((newRoute)=>{

  //       newRoute.controller.setProperties({
  //         isEdit: true,
  //         acc_no: account.acc_no,
  //         acc_type: account.acc_type,
  //         acc_balance: account.acc_balance,
  //         acc_status: account.acc_status,
  //         username:account.username,
  //         fullname: account.user_fullname,
  //         branch_name: account.branch_name,
  //         bankId:this.get('bankId')
  //       });
  //     }).catch((error) => {
  //       console.error("Transition failed", error);
  //     });
  //   }
  // }
});
