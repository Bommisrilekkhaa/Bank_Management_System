import Ember from 'ember';
import { methods } from '../../../../../../utils/util';

export default Ember.Controller.extend({

    fetchService: Ember.inject.service('fetch'),
    transaction: [],
    sharedData:Ember.inject.service('shared-data'),
    loadTransaction(transactionId) {

      let url = `http://localhost:8080/banker/api/v1/`;
      let bankId =this.get('sharedData').get('bankId');
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
      if(transactionId!="*")
      {
    
        url=url+`/transactions/${transactionId}`;
      }
    
      this.get('fetchService').fetch(url,methods.GET)
        .then((response) => {
          // console.log(response);
          this.set('transaction', response[0].data);
          this.set('transaction',this.get('transaction')[0]);
        })
        .catch((error) => {
          console.error("Failed to load transaction:", error);
          alert("Could not load transaction. Please try again later.");
        });
    },
});
