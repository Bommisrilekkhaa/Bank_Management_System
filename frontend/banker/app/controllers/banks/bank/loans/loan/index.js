import Ember from 'ember';
import { methods } from '../../../../../utils/util';
export default Ember.Controller.extend({
    bankId:localStorage.getItem('bankId'),
    fetchService: Ember.inject.service('fetch'),
    loan:[],
    loadLoan() {
      let bankId = localStorage.getItem("bankId");
      let url = `http://localhost:8080/banker/api/v1/`;
      let branchId = localStorage.getItem("branchId");
      let accno = localStorage.getItem('accNo');
      let loanId = localStorage.getItem('loanId');
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
          this.set('loan', response);
          this.set('loan',this.get('loan')[0]);
        }).catch((error) => {
          console.error("Failed to load loan:", error);
        });
      },
    actions:{
        toEmis(loan,emiAmount)
        {

            this.transitionToRoute("banks.bank.loans.loan.emi",this.get('bankId'),loan.loan_id).then((newRoute)=>{

                newRoute.controller.setProperties({
                  loan:loan,
                  loanAmount:emiAmount
                });
              }).catch((error) => {
                console.error("Transition failed", error);
              });
        }
    }
});