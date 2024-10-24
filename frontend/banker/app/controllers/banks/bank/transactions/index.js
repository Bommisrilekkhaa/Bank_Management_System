import Ember from 'ember';

export default Ember.Controller.extend({
  branchSelection: Ember.inject.service('branch-select'),
  transactionsService: Ember.inject.service('transactions'),
  transactions: [],
  bankId:localStorage.getItem('bankId'),
  accNo:localStorage.getItem('accNo'),
  
  init() {
    this._super(...arguments);
    this.get('branchSelection').on('branchChanged', this, this.handleBranchChange);
  },

  handleBranchChange(newBranchId,currentRouteName) {
    if(currentRouteName=='banks.bank.transactions.index')
    {
      this.loadTransactions();
    }
  },

  loadTransactions() {
    console.log(this.get('accNo'));
    this.get('transactionsService').fetchTransactions(this.get('accNo'), this.get('bankId'))
      .then((response) => {
        console.log(response);
        this.set('transactions', response);
      })
      .catch((error) => {
        console.error("Failed to load transactions:", error);
        this.set('transactions', []);
      });
  },

  actions: {
    viewTransaction(transaction) {
      localStorage.setItem('transactionId',transaction.transaction_id);
      this.transitionToRoute('banks.bank.transactions.transaction',this.get('bankId'),transaction.transaction_id)
        .then((newRoute) => {
          newRoute.controller.setProperties({
            bankId: this.get('bankId'),
            branchId: this.get('branchId'),
            transactionId: transaction.transaction_id
          });
          console.log("inner view transactions");
        })
        .catch((error) => {
          console.error("Transition failed", error);
        });
    },


    addNewTransaction(branchId) { 
      console.log(branchId);
      this.transitionToRoute('banks.bank.transactions.new',this.get('bankId'))
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
  },
  willDestroy() {
    this._super(...arguments);
    this.get('branchSelection').off('branchChanged', this, this.handleBranchChange);
  }
});
