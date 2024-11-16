
import Ember from 'ember';
import {role } from '../utils/util';

export default Ember.Component.extend({
  fetchService: Ember.inject.service('fetch'),
  accounts: [],
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
  searchQuery:'',
  selectedAccountType: '',
  selectedAccountStatus: '',
  currentPage: 1,
  itemsPerPage: 8,

  FilteredAccounts() {
   
    let selectedAccountType = this.get('selectedAccountType');
    let selectedAccountStatus = this.get('selectedAccountStatus');

    this.sendAction('changeAccounts',this.get('currentPage'),selectedAccountType,selectedAccountStatus,this.get('searchQuery'));
      // accounts = accounts.filter(account => account.acc_type === selectedAccountType);
    
  },

  totalPages: Ember.computed('totalAccounts', 'itemsPerPage', function() {
 
    let totalItems = this.get('totalAccounts');
    let itemsPerPage = this.get('itemsPerPage');
    return Math.ceil(totalItems / itemsPerPage);
  }),


  visiblePages: Ember.computed('accounts','currentPage', 'totalPages', function() {
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
        for (let i = totalPages - 3; i <=totalPages; i++) {
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

  showFirstPage: Ember.computed('accounts','currentPage', function() {
    return this.get('currentPage') > 3;
  }),

  showLastPage: Ember.computed('accounts','currentPage', 'totalPages', function() {
    return this.get('currentPage') < this.get('totalPages') - 2;
  }),

  showLeftEllipsis: Ember.computed('accounts','currentPage', function() {
    return this.get('currentPage') > 3;
  }),

  showRightEllipsis: Ember.computed('accounts','currentPage', 'totalPages', function() {
    return this.get('currentPage') < this.get('totalPages') - 2;
  }),

  searchSuggestion() {
    let accounts = this.get('accounts') || [];
    let query = this.get('searchQuery');
  
    if (query) {
      let suggestions = [];
  
      accounts.forEach(account => {
        if (account.username.startsWith(query) && suggestions.indexOf(account.username) === -1) {
          suggestions.push(account.username);
        }
      });
  
      this.set('searchSuggestions', suggestions);
    } else {
      this.set('searchSuggestions', []);
    }
  },
  
  actions: { 
    FilterReset(){
    this.set('selectedAccountType','');
    this.set('selectedAccountStatus','');
    this.FilteredAccounts();
  },
    AccountType(value){
      this.set('selectedAccountType',value);
      this.FilteredAccounts();
    },
    AccountStatus(value){
      this.set('selectedAccountStatus',value);
      this.FilteredAccounts();
    },
    viewAccount(account) {
      this.sendAction('viewaccount', account);
    },

    addNewAccount() {
      this.sendAction('toaddNewAccount');
    },

    editAccount(account) {
      this.sendAction('toeditAccount', true, account, account.branch_id);
    },

    goToPage(page) {
      this.set('currentPage', page);
      // this.loadAccounts(page);
      this.sendAction('changeAccounts',page,this.get('selectedAccountType'),this.get('selectedAccountStatus'),this.get('searchQuery'));
     
    },

    nextPage() {
      let currentPage = this.get('currentPage');
      let totalPages = this.get('totalPages');
      if (currentPage < totalPages) {
        this.incrementProperty('currentPage');
      }
      // this.loadAccounts(this.get('currentPage'));
      this.sendAction('changeAccounts',this.get('currentPage'),this.get('selectedAccountType'),this.get('selectedAccountStatus'),this.get('searchQuery'));
     
    },

    previousPage() {
      let currentPage = this.get('currentPage');
      if (currentPage > 1) {
        this.decrementProperty('currentPage');
      }
      this.sendAction('changeAccounts',this.get('currentPage'),this.get('selectedAccountType'),this.get('selectedAccountStatus'),this.get('searchQuery'));
     
      // this.loadAccounts(this.get('currentPage'));
    },
    updateSearchQuery(value) {
      this.set('searchQuery', value);
      this.searchSuggestion();
      // this.notifyPropertyChange('searchSuggestions');
    },
      
          // Perform search on button click
    performSearch() {
      
      this.sendAction('changeAccounts',this.get('currentPage'),this.get('selectedAccountType'),this.get('selectedAccountStatus'),this.get('searchQuery'));
     
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
