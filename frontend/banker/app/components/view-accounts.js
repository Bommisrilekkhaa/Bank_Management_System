import Ember from 'ember';

export default Ember.Component.extend({
  accountssService: Ember.inject.service('accounts'),
  accounts: [],
  branchId: localStorage.getItem('branchId'),

  role: Ember.computed(function() {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${'sessionData'}=`);
    if (parts.length === 2) {
      let cookieData = decodeURIComponent(parts.pop().split(';').shift());
      let sessionData = JSON.parse(cookieData);  
      return sessionData.user_role;  
    }
  }),


  filteredAccounts: Ember.computed('accounts', 'selectedAccountType', 'selectedAccountStatus', function() {
    let accounts = this.get('accounts');
    let selectedAccountType = this.get('selectedAccountType');
    let selectedAccountStatus = this.get('selectedAccountStatus');

    if (selectedAccountType) {
      accounts = accounts.filter(account => account.acc_type === selectedAccountType);
    }

    if (selectedAccountStatus) {
      accounts = accounts.filter(account => account.acc_status === selectedAccountStatus);
    }

    return accounts;
  }),

  actions: {
    viewAccount(account) {
      this.sendAction('viewaccount', account);
    },

    addNewAccount() {
      this.sendAction('toaddNewAccount');
    },

    editAccount(account) {
      this.sendAction('toeditAccount', true, account, account.branch_id);
    }
  }
});
