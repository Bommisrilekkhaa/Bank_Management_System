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
        url=url+`&filter_type=${selectedType}`;
      }
      if(selectedStatus && selectedStatus!='')
      {
        url=url+`&filter_status=${selectedStatus}`;
      }
      if(searchQuery && searchQuery!='')
      {
        url=url+`&search_item=${searchQuery}`;
      }
    this.get('fetchService').fetch(url,methods.GET)
      .then((response) => {
        // console.log(response);
        this.set('transactions', response.data);
        this.set('totalTransactions',response.totalTransactions);
      })
      .catch((error) => {
        this.set('transactions', []);
        console.error("Failed to load transactions:", error);
      });
  },

  actions: {
    viewTransaction(transaction) {
      this.transitionToRoute('banks.bank.accounts.account.transactions.transaction', transaction.acc_number, transaction.transaction_id);
    },

    addNewTransaction() { 
      // console.log(branchId);
      this.transitionToRoute('banks.bank.accounts.account.transactions.new');
    },
    changeTransactions(page,selectedType,selectedStatus,searchQuery)
    {
      this.loadTransactions(page,selectedType,selectedStatus,searchQuery);
    }
  }
});
