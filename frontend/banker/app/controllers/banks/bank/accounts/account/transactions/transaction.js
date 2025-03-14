import Ember from 'ember';
import { methods } from '../../../../../../utils/util';

export default Ember.Controller.extend({

    fetchService: Ember.inject.service('fetch'),
    transaction: [],
    sharedData:Ember.inject.service('shared-data'),
    transactionData: Ember.computed('transaction', function () {
      let transaction = this.get('transaction');
      return [
        { label: "Transaction Id", value: transaction.transaction_id },
        { label: "Transaction Type", value: transaction.transaction_type },
        { label: "Transaction Amount", value: `Rs. ${transaction.transaction_amount}` },
        { label: "Status", value: transaction.transaction_status },
        { label: "Date and Time", value: transaction.transaction_datetime },
        { label: "Account Number", value: transaction.acc_number }
      ];
    }),
    loadTransaction(transactionId) {

      let url = `http://localhost:8080/banker/api/v1/`;
      let bankId =this.get('sharedData').get('bankId');
      let branchId = this.get('sharedData').get("branchId");
      let accno = this.get('sharedData').get('accNo');
      if(bankId!="*" && bankId)
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
      if(transactionId!="*")
      {
    
        url=url+`/transactions/${transactionId}`;
      }
    
      this.get('fetchService').fetch(url,methods.GET)
        .then((response) => {
          // console.log(response);
          this.set('transaction', response.data);
          this.set('transaction',this.get('transaction')[0]);
        })
        .catch((error) => {
          console.error("Failed to load transaction:", error);
        });
    },
});
