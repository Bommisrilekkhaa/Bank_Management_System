import Ember from 'ember';

export default Ember.Controller.extend({
  transactionsService: Ember.inject.service('transactions'),
  transactions: [],
  bankId:localStorage.getItem('bankId'),
  loadTransactions() {
    this.get('transactionsService').fetchTransactions(localStorage.getItem('accNo'), this.get('bankId'))
      .then((response) => {
        console.log(response);
        this.set('transactions', response);
      })
      .catch((error) => {
        console.error("Failed to load transactions:", error);
        alert("Could not load transactions. Please try again later.");
      });
  },

  actions: {
    viewTransaction(transaction) {
      this.transitionToRoute('banks.bank.accounts.account.transactions.transaction', transaction.acc_number, transaction.transaction_id)
        .then((newRoute) => {
          newRoute.controller.setProperties({
            bankId: this.get('bankId'),
            branchId: this.get('branchId'),
            transaction: transaction
          });
        })
        .catch((error) => {
          console.error("Transition failed", error);
        });
    },

    addNewTransaction(branchId) { 
      console.log(branchId);
      this.transitionToRoute('banks.bank.accounts.account.transactions.new')
        .then((newRoute) => {
          newRoute.controller.setProperties({
            accNo: this.get('accNo'),
            branchId: branchId, 
            bankId: this.get('bankId')
          });
        })
        .catch((error) => {
          console.error("Transition to new transaction page failed", error);
        });
    }
  }
});
