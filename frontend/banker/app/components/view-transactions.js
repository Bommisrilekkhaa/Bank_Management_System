import Ember from 'ember';

export default Ember.Component.extend({
    transactionsService: Ember.inject.service('transactions'),
    transactions: [],
  accNo:localStorage.getItem('accNo'),
  bankId:'',
  role:Ember.computed(()=>{
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${'sessionData'}=`);
    if (parts.length === 2) {
        let cookieData = decodeURIComponent(parts.pop().split(';').shift());
        let sessionData = JSON.parse(cookieData);  
        return sessionData.user_role;  
    }
  }),
  actions: {
    viewTransaction(transaction)
    {
      console.log(transaction);
      this.sendAction('viewtransaction',transaction);
    },
    addNewTransaction() {
      console.log(this.get('accNo'));
      this.sendAction('toaddNewTransaction',localStorage.getItem('branchId'));
      
    },

   
  }

});
