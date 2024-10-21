import Ember from 'ember';

export default Ember.Controller.extend({
  acc:[],
  accountsService: Ember.inject.service('accounts'),
  loadAccount() {
    this.get('accountsService').fetchAccount(this.get('bankId')).then((response) => {
      console.log(response);
      this.set('acc', response);
      this.set('acc',this.get('acc')[0]);
    }).catch((error) => {
      console.error("Failed to load account:", error);
    });
  },
  actions:{
    toLoans()
    {
      this.transitionToRoute('banks.bank.accounts.account.loans',localStorage.getItem('accNo')).then((newRoute)=>{
             
        newRoute.controller.setProperties({
          bankId:localStorage.getItem('bankId'),
          branchId:localStorage.getItem('branchId')
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    },
    toTransactions()
    {
      this.transitionToRoute('banks.bank.accounts.account.transactions',localStorage.getItem('accNo')).then((newRoute)=>{
             
        newRoute.controller.setProperties({
          bankId:localStorage.getItem('bankId'),
          branchId:localStorage.getItem('branchId')
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    }
  }
});
