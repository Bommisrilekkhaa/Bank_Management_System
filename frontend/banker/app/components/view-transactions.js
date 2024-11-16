
import Ember from 'ember';
import { role } from '../utils/util';

export default Ember.Component.extend({
  transactions: [],
  userRole: role,

  role: Ember.computed(function () {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${'sessionData'}=`);
    if (parts.length === 2) {
      let cookieData = decodeURIComponent(parts.pop().split(';').shift());
      let sessionData = JSON.parse(cookieData);
      return sessionData.user_role;
    }
  }),
  searchQuery:'',
  selectedTransactionType: '',
  selectedTransactionStatus: '',
  currentPage: 1,
  itemsPerPage: 8,

  filteredTransactions: Ember.computed('transactions', 'selectedTransactionType', 'selectedTransactionStatus', function () {
    let transactions = this.get('transactions') || [];
    let selectedTransactionType = this.get('selectedTransactionType');
    let selectedTransactionStatus = this.get('selectedTransactionStatus');

    if (selectedTransactionType) {
      transactions = transactions.filter(transaction => transaction.transaction_type === selectedTransactionType);
    }

    if (selectedTransactionStatus) {
      transactions = transactions.filter(transaction => transaction.transaction_status === selectedTransactionStatus);
    }

    return transactions;
  }),

  FilteredTransactions() {
   
    let selectedTransactionType = this.get('selectedTransactionType');
    let selectedTransactionStatus = this.get('selectedTransactionStatus');

    this.sendAction('changeTransactions',this.get('currentPage'),selectedTransactionType,selectedTransactionStatus,this.get('searchQuery'));
    
  },

  totalPages: Ember.computed('totalTransactions', 'itemsPerPage', function () {
    let totalItems = this.get('totalTransactions');
    let itemsPerPage = this.get('itemsPerPage');
    return Math.ceil(totalItems / itemsPerPage);
  }),

 

  visiblePages: Ember.computed('transactions','currentPage', 'totalPages', function () {
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

  showFirstPage: Ember.computed('transactions','currentPage', function () {
    return this.get('currentPage') > 3;
  }),

  showLastPage: Ember.computed('transactions','currentPage', 'totalPages', function () {
    return this.get('currentPage') < this.get('totalPages') - 2;
  }),

  showLeftEllipsis: Ember.computed('transactions','currentPage', function () {
    return this.get('currentPage') > 3;
  }),

  showRightEllipsis: Ember.computed('transactions','currentPage', 'totalPages', function () {
    return this.get('currentPage') < this.get('totalPages') - 2;
  }),

  searchSuggestion() {
    let transactions = this.get('transactions') || [];
    let query = this.get('searchQuery');
  
    if (query) {
      let suggestions = [];
  
  transactions.forEach(transaction => {
        
        if (transaction.acc_number.toString().startsWith(query) && suggestions.indexOf(transaction.acc_number) === -1) {
          suggestions.push(transaction.acc_number);
        }
      });
  
      this.set('searchSuggestions', suggestions);
    } else {
      this.set('searchSuggestions', []);
    }
  },
  
  actions: {
    FilterReset(){
      this.set('selectedTransactionType','');
      this.set('selectedTransactionStatus','');
      this.FilteredTransactions();
    },
    TransactionType(value){
      this.set('selectedTransactionType',value);
      this.FilteredTransactions();
    },
    TransactionStatus(value){
      this.set('selectedTransactionStatus',value);
      this.FilteredTransactions();
    },
    viewTransaction(transaction) {
      this.sendAction('viewTransaction', transaction);
    },

    addNewTransaction() {
      this.sendAction('toaddNewTransaction');
    },

    goToPage(page) {
      this.set('currentPage', page);
      this.sendAction('changeTransactions',page,this.get('selectedTransactionType'),this.get('selectedTransactionStatus'),this.get('searchQuery'));
     
    },

    nextPage() {
      let currentPage = this.get('currentPage');
      let totalPages = this.get('totalPages');
      if (currentPage < totalPages) {
        this.incrementProperty('currentPage');
      }
      this.sendAction('changeTransactions',this.get('currentPage'),this.get('selectedTransactionType'),this.get('selectedTransactionStatus'),this.get('searchQuery'));
     
    },

    previousPage() {
      let currentPage = this.get('currentPage');
      if (currentPage > 1) {
        this.decrementProperty('currentPage');
      }
      this.sendAction('changeTransactions',this.get('currentPage'),this.get('selectedTransactionType'),this.get('selectedTransactionStatus'),this.get('searchQuery'));
    },
    updateSearchQuery(value) {
      this.set('searchQuery', value);
      this.searchSuggestion();
      // this.notifyPropertyChange('searchSuggestions');
    },
      
          // Perform search on button click
    performSearch() {
      
      this.sendAction('changeTransactions',this.get('currentPage'),this.get('selectedTransactionType'),this.get('selectedTransactionStatus'),this.get('searchQuery'));
   
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
  },
});
