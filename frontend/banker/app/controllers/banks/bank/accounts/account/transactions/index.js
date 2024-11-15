import Ember from 'ember';
import { methods } from '../../../../../../utils/util';

export default Ember.Controller.extend({
  fetchService: Ember.inject.service('fetch'),
  transactions: [],
  sharedData:Ember.inject.service('shared-data'),
  loadTransactions(page,selectedType,selectedStatus,searchQuery) {
    let url = `http://localhost:8080/banker/api/v1/`;
    let bankId = this.get('sharedData').get('bankId');
    let branchId = this.get('sharedData').get("branchId");
    let accno = this.get('sharedData').get('accNo');
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
    url=url+`/transactions?page=${page}`;

    if(selectedType && selectedType!='')
      {
        url=url+`&filtertype=${selectedType}`;
      }
      if(selectedStatus && selectedStatus!='')
      {
        url=url+`&filterstatus=${selectedStatus}`;
      }
      if(searchQuery && searchQuery!='')
      {
        url=url+`&searchitem=${searchQuery}`;
      }
    this.get('fetchService').fetch(url,methods.GET)
      .then((response) => {
        // console.log(response);
        this.set('transactions', response[0].data);
        this.set('totalTransactions',response[0].totalTransactions);
      })
      .catch((error) => {
        this.set('transactions', []);
        console.error("Failed to load transactions:", error);
      });
  },

  actions: {
    viewTransaction(transaction) {
      this.transitionToRoute('banks.bank.accounts.account.transactions.transaction', transaction.acc_number, transaction.transaction_id)
        .then((newRoute) => {
          newRoute.controller.setProperties({
            bankId: this.get('bankId'),
            transactionId: transaction.transaction_id
          });
        })
        .catch((error) => {
          console.error("Transition failed", error);
        });
    },

    addNewTransaction() { 
      // console.log(branchId);
      this.transitionToRoute('banks.bank.accounts.account.transactions.new')
        .then((newRoute) => {
          newRoute.controller.setProperties({
            accNo: this.get('accNo'),
            bankId: this.get('bankId')
          });
        })
        .catch((error) => {
          console.error("Transition to new transaction page failed", error);
        });
    },
    changeTransactions(page,selectedType,selectedStatus,searchQuery)
    {
      this.loadTransactions(page,selectedType,selectedStatus,searchQuery);
    }
  }
});
