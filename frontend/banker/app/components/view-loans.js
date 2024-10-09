import Ember from 'ember';

export default Ember.Component.extend({
    loansService: Ember.inject.service('loans'),
  loans: [],
  accNo:'',
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
    viewLoan(loan)
    {
      this.sendAction('viewloan',loan);
    },
    addNewLoan() {
      this.sendAction('toaddNewLoan',localStorage.getItem('branchId'));
      
    },

    editLoan(loan) {
     this.sendAction('toeditLoan',true,loan,localStorage.getItem('branchId'));
    }
  }

});
