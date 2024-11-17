import Ember from 'ember';
import { methods } from '../../../../utils/util';

export default Ember.Controller.extend({
  notification: Ember.inject.service('notify'),
  fetchService: Ember.inject.service('fetch'),
  sharedData:Ember.inject.service('sharedData'),
  branches: [],
  searchQuery: '',
  selectedBranchStatus: '',
  currentPage: 1,
  itemsPerPage: 8,

  loadBranches(page,searchQuery) {
    // console.log(this.get('bankId'));
    let bankId=this.get('sharedData').get('bankId');
    let url = `http://localhost:8080/banker/api/v1/`;
      if(bankId!="*")
      {
        url=url +`banks/${bankId}`;
      }
      
      url=url+`/branches?page=${page}`;

      if(searchQuery && searchQuery!='')
        {
          url=url+`&search_item=${searchQuery}`;
        }

    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      // console.log(response);
      this.set('branches', response.data);
      this.set('totalBranches',response.totalBranches);
    }).catch((error) => {
      this.set('branches', []);
      console.error("Failed to load branches:", error);
    });
  },

  
  totalPages: Ember.computed('totalBranches', 'itemsPerPage', function() {
    let totalItems = this.get('totalBranches');
    let itemsPerPage = this.get('itemsPerPage');
    return Math.ceil(totalItems / itemsPerPage);
  }),

  
  visiblePages: Ember.computed('branches','currentPage', 'totalPages', function() {
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

  showFirstPage: Ember.computed('branches','currentPage', function() {
    return this.get('currentPage') > 3;
  }),

  showLastPage: Ember.computed('branches','currentPage', 'totalPages', function() {
    return this.get('currentPage') < this.get('totalPages') - 2;
  }),

  showLeftEllipsis: Ember.computed('branches','currentPage', function() {
    return this.get('currentPage') > 3;
  }),

  showRightEllipsis: Ember.computed('branches','currentPage', 'totalPages', function() {
    return this.get('currentPage') < this.get('totalPages') - 2;
  }),
  
  searchSuggestion() {
    let branches = this.get('branches') || [];
    let query = this.get('searchQuery').toLowerCase();
  
    if (query) {
      let suggestions = [];
  
      branches.forEach(branch => {
        if (branch.branch_name.toLowerCase().startsWith(query) && suggestions.indexOf(branch.branch_name) === -1) {
          suggestions.push(branch.branch_name);
        }
        if (branch.manager_name.toLowerCase().startsWith(query) && suggestions.indexOf(branch.manager_name) === -1) {
          suggestions.push(branch.manager_name);
        }
      });
  
      this.set('searchSuggestions', suggestions);
    } else {
      this.set('searchSuggestions', []);
    }
  },
  
  
  actions: {
    viewBranch(branch) {
      let bankId = this.get('sharedData').get('bankId');
      this.transitionToRoute('banks.bank.branches.branch', bankId, branch.branch_id);
    },

    addNewBranch() {

      let bankId = this.get('sharedData').get('bankId');
      // console.log(this.get('bankId'));
      this.transitionToRoute('banks.bank.branches.new',bankId);
    },

    editBranch(branch) {

      let bankId = this.get('sharedData').get('bankId');
      this.transitionToRoute('banks.bank.branches.branch.edit', bankId, branch.branch_id).then((newRoute) => {
        newRoute.controller.setProperties({
          isEdit: true,
          branchId: branch.branch_id,
          branch_name: branch.branch_name,
          branch_address: branch.branch_address,
          branch_number: branch.branch_number,
          manager_id:branch.manager_id,
          manager_name:branch.manager_name,
        });
      }).catch((error) => {
        
        console.error("Transition failed", error);
      });
    },

    deleteBranch(branch) 
    {
        let bankId = this.get('sharedData').get('bankId');
        let url = `http://localhost:8080/banker/api/v1/`;
        if(bankId!="*")
        {
          url=url +`banks/${bankId}`;
        }
        if(branch.branch_id!='*')
        {
          url=url+`/branches/${branch.branch_id}`;
        }
        if (confirm(`Are you sure you want to delete the branch: ${branch.branch_name}?`)) 
        {

          this.get('fetchService').fetch(url,methods.DELETE).then(() => {
            // console.log('Branch deleted successfully');
            this.get('notification').showNotification('Branch Deleted successfully!', 'success');
            Ember.run.later(() => {
              this.transitionToRoute('banks.bank.branches',bankId);
              this.loadBranches(1);
            }, 2000);
          }).catch((error) => {
            console.error("Failed to delete branch:", error);
          });
        }
    },
    goToPage(page) {
      this.set('currentPage', page);
      this.loadBranches(page,this.get('searchQuery'));
    },

    nextPage() {
      let currentPage = this.get('currentPage');
      let totalPages = this.get('totalPages');
      if (currentPage < totalPages) {
        this.incrementProperty('currentPage');
      }
      this.loadBranches(this.get('currentPage'),this.get('searchQuery'));
    },

    previousPage() {
      let currentPage = this.get('currentPage');
      if (currentPage > 1) {
        this.decrementProperty('currentPage');
      }
      this.loadBranches(this.get('currentPage'),this.get('searchQuery'));
    },
    updateSearchQuery(value) {
      this.set('searchQuery', value);
      this.searchSuggestion();
      
    },
      
          
    performSearch() {
      this.loadBranches(this.get('currentPage'),this.get('searchQuery'));
   
      this.set('currentPage', 1); 
      this.set('searchSuggestions', []);
    },
      
          
    selectSuggestion(suggestion) {
      this.set('searchQuery', suggestion);
      this.searchSuggestion();
      
      this.set('currentPage', 1); 
    },
  }
});