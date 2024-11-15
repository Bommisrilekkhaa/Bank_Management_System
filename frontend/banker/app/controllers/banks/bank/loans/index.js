import Ember from 'ember';
import {methods} from '../../../../utils/util';
export default Ember.Controller.extend({
  branchSelection: Ember.inject.service('branch-select'),
  fetchService: Ember.inject.service('fetch'),
  sharedData:Ember.inject.service('shared-data'),
  init() {
    this._super(...arguments);
   
    this.get('branchSelection').on('branchChanged', this, this.handleBranchChange);
    
  },

  handleBranchChange(newBranchId,currentRouteName) {
    if(currentRouteName=='banks.bank.loans.index')
    {
      this.loadLoans(1);
    }
  },

  loans: [],
  loadLoans(page,selectedType,selectedStatus,searchQuery) {
    let url = `http://localhost:8080/banker/api/v1/`;
    let bankId =  this.get('sharedData').get('bankId');
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
    url=url+`/loans?page=${page}`;

    if(selectedType && selectedType!='')
      {
        url=url+`&filtertype=${selectedType}`;
      }
      if(selectedStatus && selectedStatus!='')
      {
        url=url+`&filterstatus=${selectedStatus}`;
      }
      if(searchQuery && searchQuery!='')
      {
        url=url+`&searchitem=${searchQuery}`;
      }
  
    // console.log(this.get('accNo'));
    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      // console.log(response);
      this.set('loans', response[0].data);
      this.set('totalLoans',response[0].totalLoans);
    }).catch((error) => {
      this.set('loans', []);
      console.error("Failed to load loans:", error);
    });
  },
  actions: {

    viewloan(loan)
    {
      this.get('sharedData').set('accNo',loan.acc_number);
        this.transitionToRoute('banks.bank.loans.loan',this.get('sharedData').get('bankId'),loan.loan_id).then((newRoute)=>{

          newRoute.controller.setProperties({
            bankId:this.get('bankId'),
            branchId:this.get('branchId')
          });
        }).catch((error) => {
          console.error("Transition failed", error);
        });
    },

    addNewLoan() {
      // console.log(branchId);
      this.transitionToRoute('banks.bank.loans.new').then((newRoute) => {
        newRoute.controller.setProperties({
          accNo:this.get('accNo'),
          bankId:this.get('bankId')
        });
      }).catch((error) => {
        console.error("Transition to edit loan page failed", error);
      });
    },

    editLoan(isEdit,loan) {
      this.get('sharedData').set('accNo',loan.acc_number);
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
        });
      }).catch((error) => {
        console.error("Transition to edit loan page failed", error);
      });
    },
     changeLoans(page,selectedType,selectedStatus,searchQuery)
    {
      this.loadLoans(page,selectedType,selectedStatus,searchQuery);
    }
  },
  willDestroy() {
    this._super(...arguments);
    this.get('branchSelection').off('branchChanged', this, this.handleBranchChange);
  }

});
