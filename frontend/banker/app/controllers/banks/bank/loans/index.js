import Ember from 'ember';

export default Ember.Controller.extend({
  branchSelection: Ember.inject.service('branch-select'),
  loansService: Ember.inject.service('loans'),
  

  init() {
    this._super(...arguments);
   
    this.get('branchSelection').on('branchChanged', this, this.handleBranchChange);
    
  },

  handleBranchChange(newBranchId) {
    this.loadLoans();
  },

  loans: [],
  loadLoans() {
    console.log(this.get('accNo'));
    this.get('loansService').fetchLoans(localStorage.getItem('accNo'),localStorage.getItem('bankId')).then((response) => {
      console.log(response);
      this.set('loans', response);
    }).catch((error) => {
      console.error("Failed to load loans:", error);
    });
  },
  bankId:localStorage.getItem('bankId'),
  actions: {

    viewloan(loan)
    {
      localStorage.setItem("accNo",loan.acc_number);
      // console.log("view...."+this.get('bankId'));
      localStorage.setItem("loanId",loan.loan_id);
        this.transitionToRoute('banks.bank.loans.loan',this.get('bankId'),loan.loan_id).then((newRoute)=>{

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
      this.transitionToRoute('banks.bank.loans.new').then((newRoute) => {
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
      localStorage.setItem("accNo",loan.acc_number);
      this.transitionToRoute('banks.bank.loans.loan.edit',  loan.loan_id).then((newRoute) => {
        newRoute.controller.setProperties({
          isEdit: isEdit,
          loan_id: loan.loan_id,
          loan_type: loan.loan_type,
          loan_amount: loan.loan_amount,
          loan_interest: loan.loan_interest,
          loan_duration: loan.loan_duration,
          loan_status: loan.loan_status,
          loan_availed_date: loan.loan_availed_date,
          accNo: loan.acc_number,
          bankId:this.get('bankId'),
          branchId:branchId
        });
      }).catch((error) => {
        console.error("Transition to edit loan page failed", error);
      });
    }
  },
  willDestroy() {
    this._super(...arguments);
    this.get('branchSelection').off('branchChanged', this, this.handleBranchChange);
  }

});
