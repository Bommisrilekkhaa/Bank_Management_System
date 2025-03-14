import Ember from 'ember';
import { methods } from '../../../../../../../utils/util';

export default Ember.Controller.extend({
    fetchService: Ember.inject.service('fetch'),
  sharedData:Ember.inject.service('shared-data'),
    loan:[],
    loanData: Ember.computed('loan', function () {
      let loan = this.get('loan');
      return [
        { label: "Loan Id", value: loan.loan_id },
        { label: "Loan Type", value: loan.loan_type },
        { label: "Loan Amount", value: `Rs. ${loan.loan_amount}` },
        { label: "Interest", value: `${loan.loan_interest}%` },
        { label: "Duration", value: `${loan.loan_duration} Months` },
        { label: "Status", value: loan.loan_status },
        { label: "Availed Date", value: loan.loan_availed_date },
        { label: "Account Number", value: loan.acc_number }
      ];
    }),
    loadLoan(loanId) {
      let bankId =this.get('sharedData').get('bankId');
      let url = `http://localhost:8080/banker/api/v1/`;
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