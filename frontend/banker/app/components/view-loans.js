import Ember from 'ember';
import { role } from '../utils/util';
export default Ember.Component.extend({
  loansService: Ember.inject.service('loans'),
  loans: [],
  branchId: localStorage.getItem('branchId'),
  userRole:role,
  role: Ember.computed(function() {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${'sessionData'}=`);
    if (parts.length === 2) {
      let cookieData = decodeURIComponent(parts.pop().split(';').shift());
      let sessionData = JSON.parse(cookieData);
      return sessionData.user_role;  
    }
  }),

  selectedLoanType: '',
  selectedLoanStatus: '',

  filteredLoans: Ember.computed('loans', 'selectedLoanType', 'selectedLoanStatus', function() {
    let loans = this.get('loans');
    let selectedLoanType = this.get('selectedLoanType');
    let selectedLoanStatus = this.get('selectedLoanStatus');


    if (selectedLoanType) {
      loans = loans.filter(loan => loan.loan_type === selectedLoanType);
    }

   
    if (selectedLoanStatus) {
      loans = loans.filter(loan => loan.loan_status === selectedLoanStatus);
    }

    return loans;
  }),

  actions: {
    viewLoan(loan) {
      this.sendAction('viewLoan', loan, this.get('branchId'));
    },

    addNewLoan() {
      this.sendAction('toaddNewLoan', this.get('branchId'));
    },
    editLoan(loan) {
      this.sendAction('toeditLoan',true,loan ,this.get('branchId'));
    }
  }
});
