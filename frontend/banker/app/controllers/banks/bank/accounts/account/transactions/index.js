import Ember from 'ember';
import { methods } from '../../../../../../utils/util';

export default Ember.Controller.extend({
  fetchService: Ember.inject.service('fetch'),
  transactions: [],
  bankId:localStorage.getItem('bankId'),

  loadTransactions() {
    let url = `http://localhost:8080/banker/api/v1/`;
    let bankId =localStorage.getItem('bankId');
    let branchId = localStorage.getItem("branchId");
    let accno = localStorage.getItem('accNo');
    if(bankId!="*")
    {
      url=url +`banks/${bankId}`;
    }
    if(branchId!='*')
    {
      url=url+`/branches/${branchId}`;
    }
    if(accno!="*")
    {
      url = url+`/accounts/${accno}`;
    }
    url=url+`/transactions`;

    this.get('fetchService').fetch(url,methods.GET)
      .then((response) => {
        // console.log(response);
        this.set('transactions', response);
      })
      .catch((error) => {
        console.error("Failed to load transactions:", error);
        alert("Could not load transactions. Please try again later.");
      });
  },

  actions: {
    viewTransaction(transaction) {
      localStorage.setItem('transactionId', transaction.transaction_id);
      this.transitionToRoute('banks.bank.accounts.account.transactions.transaction', transaction.acc_number, transaction.transaction_id)
        .then((newRoute) => {
          newRoute.controller.setProperties({
            bankId: this.get('bankId'),
            branchId: this.get('branchId'),
            transactionId: transaction.transaction_id
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
