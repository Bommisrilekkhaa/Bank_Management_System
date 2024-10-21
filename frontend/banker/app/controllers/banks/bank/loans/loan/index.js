import Ember from 'ember';

export default Ember.Controller.extend({
    bankId:localStorage.getItem('bankId'),
    loansService: Ember.inject.service('loans'),
    loan:[],
    loadLoan() {
        let accNo=localStorage.getItem('accNo');
        let bankId=localStorage.getItem('bankId');
        this.get('loansService').fetchLoan(accNo,bankId).then((response) => {
          console.log(response);
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