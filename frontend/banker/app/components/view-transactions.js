import Ember from 'ember';
import { role } from '../utils/util';
export default Ember.Component.extend({
  transactionsService: Ember.inject.service('transactions'),
  transactions: [],
  branchId: localStorage.getItem('branchId'),
  userRole:role,
  role: Ember.computed(function() {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${'sessionData'}=`);
    if (parts.length === 2) {
      let cookieData = decodeURIComponent(parts.pop().split(';').shift());
      let sessionData = JSON.parse(cookieData);  
      return sessionData.user_role;  
    }
  }),

  selectedTransactionType: '',
  selectedTransactionStatus: '',

  filteredTransactions: Ember.computed('transactions', 'selectedTransactionType', 'selectedTransactionStatus', function() {
    let transactions = this.get('transactions');
    let selectedTransactionType = this.get('selectedTransactionType');
    let selectedTransactionStatus = this.get('selectedTransactionStatus');

    if (selectedTransactionType) {
      transactions = transactions.filter(transaction => transaction.transaction_type === selectedTransactionType);
    }

    if (selectedTransactionStatus) {
      transactions = transactions.filter(transaction => transaction.transaction_status === selectedTransactionStatus);
    }

    return transactions;
  }),

  actions: {
    viewTransaction(transaction) {
      this.sendAction('viewTransaction', transaction, this.get('branchId'));
    },

    addNewTransaction() {
      this.sendAction('toaddNewTransaction', this.get('branchId'));
    },
    
  }
});
