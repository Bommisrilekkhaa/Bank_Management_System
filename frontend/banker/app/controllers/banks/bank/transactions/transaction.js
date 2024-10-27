import Ember from 'ember';
import { methods } from '../../../../utils/util';
export default Ember.Controller.extend({

  fetchService: Ember.inject.service('fetch'),
    transaction: [],
    bankId:localStorage.getItem('bankId'),
   
    loadTransaction() {
      let url = `http://localhost:8080/banker/api/v1/`;
      let bankId =localStorage.getItem('bankId');
      let branchId = localStorage.getItem("branchId");
      let accno = localStorage.getItem('accNo');
      let transactionId = localStorage.getItem("transactionId");
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
      if(transactionId!="*")
      {
    
        url=url+`/transactions/${transactionId}`;
      }

      this.get('fetchService').fetch(url,methods.GET)
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
