import Ember from 'ember';
import { methods } from '../../../../../../utils/util';
export default Ember.Controller.extend({
  fetchService: Ember.inject.service('fetch'),
  sharedData: Ember.inject.service('shared-data'),
  loans: [],
  loadLoans(page, selectedType, selectedStatus, searchQuery) {
    let url = `http://localhost:8080/banker/api/v1/`;
    let bankId = this.get('sharedData').get('bankId');
    let branchId = this.get('sharedData').get("branchId");
    let accno = this.get('sharedData').get('accNo');
    if (bankId != "*") {
      url = url + `banks/${bankId}`;
    }
    if (branchId != '*') {
      url = url + `/branches/${branchId}`;
    }
    if (accno != "*") {
      url = url + `/accounts/${accno}`;
    }
    url = url + `/loans?page=${page}`;

    if (selectedType && selectedType != '') {
      url = url + `&filter_type=${selectedType}`;
    }
    if (selectedStatus && selectedStatus != '') {
      url = url + `&filter_status=${selectedStatus}`;
    }
    if (searchQuery && searchQuery != '') {
      url = url + `&search_item=${searchQuery}`;
    }

    this.get('fetchService').fetch(url, methods.GET).then((response) => {
      this.set('loans', response.data);
      this.set('totalLoans', response.totalLoans);
    }).catch((error) => {
      this.set('loans', []);
      console.error("Failed to load loans:", error);
    });
  },
  actions: {

    viewloan(loan) {
      this.transitionToRoute('banks.bank.accounts.account.loans.loan', loan.acc_number, loan.loan_id);
    },

    addNewLoan() {
      this.transitionToRoute('banks.bank.accounts.account.loans.new');
    },

    editLoan(isEdit, loan) {
      this.transitionToRoute('banks.bank.accounts.account.loans.loan.edit', loan.loan_id).then((newRoute) => {
        newRoute.controller.setProperties({
          isEdit: isEdit,
          loan_id: loan.loan_id,
          loan_type: loan.loan_type,
          loan_amount: loan.loan_amount,
          loan_interest: loan.loan_interest,
          loan_duration: loan.loan_duration,
          loan_status: loan.loan_status,
          loan_availed_date: loan.loan_availed_date
        });
      }).catch((error) => {
        console.error("Transition to edit loan page failed", error);
      });
    },
    changeLoans(page, selectedType, selectedStatus, searchQuery) {
      this.loadLoans(page, selectedType, selectedStatus, searchQuery);
    }
  }



});
