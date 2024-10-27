import Ember from 'ember';
import {methods} from '../../../../../../utils/util';
export default Ember.Controller.extend({
  fetchService: Ember.inject.service('fetch'),
  loans: [],
  loadLoans() {
    let url = `http://localhost:8080/banker/api/v1/`;
    let bankId = localStorage.getItem("bankId");
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
    url=url+`/loans`;

    // console.log(this.get('accNo'));
    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      console.log(response);
      this.set('loans', response);
    }).catch((error) => {
      console.error("Failed to load loans:", error);
    });
  },
  actions: {

    viewloan(loan)
    {
      // console.log("view...."+this.get('bankId'));
        this.transitionToRoute('banks.bank.accounts.account.loans.loan',loan.acc_number,loan.loan_id).then((newRoute)=>{
          
          localStorage.setItem('loanId',loan.loan_id);  
          newRoute.controller.setProperties({
            bankId:this.get('bankId'),
            branchId:this.get('branchId')
          });
        }).catch((error) => {
          console.error("Transition failed", error);
        });
    },

    addNewLoan(branchId) {
      console.log(branchId);
      this.transitionToRoute('banks.bank.accounts.account.loans.new').then((newRoute) => {
        newRoute.controller.setProperties({
          accNo:this.get('accNo'),
          branchId:branchId,
          bankId:this.get('bankId')
        });
      }).catch((error) => {
        console.error("Transition to edit loan page failed", error);
      });
    },

    editLoan(isEdit,loan,branchId) {
      this.transitionToRoute('banks.bank.accounts.account.loans.loan.edit',  loan.loan_id).then((newRoute) => {
        localStorage.setItem('loanId',loan.loan_id);  
        newRoute.controller.setProperties({
          isEdit: isEdit,
          loan_id: loan.loan_id,
          loan_type: loan.loan_type,
          loan_amount: loan.loan_amount,
          loan_interest: loan.loan_interest,
          loan_duration: loan.loan_duration,
          loan_status: loan.loan_status,
          loan_availed_date: loan.loan_availed_date,
          accNo: this.get('accNo'),
          bankId:this.get('bankId'),
          branchId:branchId
        });
      }).catch((error) => {
        console.error("Transition to edit loan page failed", error);
      });
    }
  }


  
});
