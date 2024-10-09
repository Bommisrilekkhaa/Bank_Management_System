import Ember from 'ember';

export default Ember.Controller.extend({
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
