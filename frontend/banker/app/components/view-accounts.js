import Ember from 'ember';

export default Ember.Component.extend({
    accountssService: Ember.inject.service('accounts'),
  accounts: [],
  bankId:'',
  branchId:localStorage.getItem('branchId'),
  role:Ember.computed(()=>{
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${'sessionData'}=`);
    if (parts.length === 2) {
        let cookieData = decodeURIComponent(parts.pop().split(';').shift());
        let sessionData = JSON.parse(cookieData);  
        console.log(sessionData);
        return sessionData.user_role;  
    }
  }),
  actions: {
    viewAccount(account)
    {
      this.sendAction('viewaccount',account,this.get('branchId'));
    },
    addNewAccount() {
      this.sendAction('toaddNewAccount',this.get('branchId'));
      
    },

    editAccount(account) {
     this.sendAction('toeditAccount',true,account,this.get('branchId'));
    },

  }

});
