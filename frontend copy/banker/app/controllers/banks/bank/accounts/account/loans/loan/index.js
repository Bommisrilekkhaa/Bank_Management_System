import Ember from 'ember';
import { methods } from '../../../../../../../utils/util';

export default Ember.Controller.extend({
    fetchService: Ember.inject.service('fetch'),
  sharedData:Ember.inject.service('shared-data'),
    loan:[],
    loadLoan(loanId) {
      let bankId =this.get('sharedData').get('bankId');
      let url = `http://localhost:8080/banker/api/v1/`;
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
      if(loanId!="*")
        {
          url = url+`/loans/${loanId}`;
        }
        this.get('fetchService').fetch(url,methods.GET).then((response) => {
          // console.log(response);
          this.set('loan', response.data);
          this.set('loan',this.get('loan')[0]);
        }).catch((error) => {
          console.error("Failed to load loan:", error);
        });
      },

      actions:{
        toEmis(loan,emiAmount)
        {
          let bankId = this.get('sharedData').get('bankId');
            this.transitionToRoute("banks.bank.accounts.account.loans.loan.emi",bankId,loan.acc_number,loan.loan_id).then((newRoute)=>{

                newRoute.controller.setProperties({
                  loan,
                  emiAmount
                });
              }).catch((error) => {
                console.error("Transition failed", error);
              });
        }
    }
});