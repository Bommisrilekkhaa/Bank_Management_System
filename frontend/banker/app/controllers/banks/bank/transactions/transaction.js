import Ember from 'ember';

export default Ember.Controller.extend({

    transactionsService: Ember.inject.service('transactions'),
    transaction: [],
    bankId:localStorage.getItem('bankId'),
    init()
    {

    },
    loadTransaction() {
      this.get('transactionsService').fetchTransaction()
        .then((response) => {
          console.log(response);
          this.set('transaction', response);
          this.set('transaction',this.get('transaction')[0]);
        })
        .catch((error) => {
          console.error("Failed to load transaction:", error);
          alert("Could not load transaction. Please try again later.");
        });
    },
});
