import Ember from 'ember';
import { role } from '../utils/util';

export default Ember.Component.extend({
  loans: [],
  userRole: role,

  role: Ember.computed(function() {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${'sessionData'}=`);
    if (parts.length === 2) {
      let cookieData = decodeURIComponent(parts.pop().split(';').shift());
      let sessionData = JSON.parse(cookieData);
      return sessionData.user_role;  
    }
  }),
  selectQuery:'',
  selectedLoanType: '',
  selectedLoanStatus: '',
  currentPage: 1,
  itemsPerPage: 8,

  FilteredLoans() {
   
    let selectedLoanType = this.get('selectedLoanType');
    let selectedLoanStatus = this.get('selectedLoanStatus');

    this.sendAction('changeLoans',this.get('currentPage'),selectedLoanType,selectedLoanStatus,this.get('searchQuery'));
      // accounts = accounts.filter(account => account.acc_type === selectedLoanType);
    
  },

  totalPages: Ember.computed('totalLoans','itemsPerPage', function() {
    let totalItems = this.get('totalLoans');
    let itemsPerPage = this.get('itemsPerPage');
    return Math.ceil(totalItems / itemsPerPage);
  }),

 
  visiblePages: Ember.computed('loans','currentPage', 'totalPages', function() {
    let currentPage = this.get('currentPage');
    let totalPages = this.get('totalPages');
    let visiblePages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          visiblePages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 3; i <= totalPages; i++) {
          visiblePages.push(i);
        }
      } else {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          visiblePages.push(i);
        }
      }
    }

    return visiblePages;
  }),

  showFirstPage: Ember.computed('loans','currentPage', function() {
    return this.get('currentPage') > 3;
  }),

  showLastPage: Ember.computed('loans','currentPage', 'totalPages', function() {
    return this.get('currentPage') < this.get('totalPages') - 2;
  }),

  showLeftEllipsis: Ember.computed('loans','currentPage', function() {
    return this.get('currentPage') > 3;
  }),

  showRightEllipsis: Ember.computed('loans','currentPage', 'totalPages', function() {
    return this.get('currentPage') < this.get('totalPages') - 2;
  }),
  searchSuggestion() {
    let loans = this.get('loans') || [];
    let query = this.get('searchQuery');
  
    if (query) {
      let suggestions = [];
  
      loans.forEach(loan => {
        if (loan.acc_number.toString().startsWith(query) && suggestions.indexOf(loan.acc_number) === -1) {
          suggestions.push(loan.acc_number);
        }
      });
  
      this.set('searchSuggestions', suggestions);
    } else {
      this.set('searchSuggestions', []);
    }
  },
  actions: {
    FilterReset(){
      this.set('selectedLoanType','');
      this.set('selectedLoanStatus','');
      this.FilteredLoans();
    },
    LoanType(value){
      this.set('selectedLoanType',value);
      this.FilteredLoans();
    },
    LoanStatus(value){
      this.set('selectedLoanStatus',value);
      this.FilteredLoans();
    },
    viewLoan(loan) {
      this.sendAction('viewLoan', loan);
    },
    addNewLoan() {
      this.sendAction('toaddNewLoan');
    },

    editLoan(loan) {
      this.sendAction('toeditLoan', true, loan);
    },

    goToPage(page) {
      this.set('currentPage', page);

      this.sendAction('changeLoans',page,this.get('selectedLoanType'),this.get('selectedLoanStatus'),this.get('searchQuery'));
      },

    nextPage() {
      let currentPage = this.get('currentPage');
      let totalPages = this.get('totalPages');
      if (currentPage < totalPages) {
        this.incrementProperty('currentPage');
      }
      this.sendAction('changeLoans',this.get('currentPage'),this.get('selectedLoanType'),this.get('selectedLoanStatus'),this.get('searchQuery'));
    },

    previousPage() {
      let currentPage = this.get('currentPage');
      if (currentPage > 1) {
        this.decrementProperty('currentPage');
      }
      this.sendAction('changeLoans',this.get('currentPage'),this.get('selectedLoanType'),this.get('selectedLoanStatus'),this.get('searchQuery'));
    },
    updateSearchQuery(value) {
      this.set('searchQuery', value);
      this.searchSuggestion();
      // this.notifyPropertyChange('searchSuggestions');
    },
      
          // Perform search on button click
    performSearch() {
      
      this.sendAction('changeLoans',this.get('currentPage'),this.get('selectedLoanType'),this.get('selectedLoanStatus'),this.get('searchQuery'));
   
      this.set('currentPage', 1); // Reset pagination
      this.set('searchSuggestions', []);
    },
      
          // Select suggestion from dropdown
    selectSuggestion(suggestion) {
      this.set('searchQuery', suggestion);
      this.searchSuggestion();
      // this.notifyPropertyChange('searchSuggestions');
      this.set('currentPage', 1); // Reset pagination
    },
  }
});
