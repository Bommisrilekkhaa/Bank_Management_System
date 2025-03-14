import Ember from 'ember';
import { status,methods } from '../../utils/util';
export default Ember.Controller.extend({
  fetchService: Ember.inject.service('fetch'),
  sharedData:Ember.inject.service('shared-data'),
  status:status,
  notification: Ember.inject.service('notify'),
  users: [],
  selectedUserRole: '',
  selectedUserStatus: '',

  currentPage: 1,
  itemsPerPage: 8,
  loadUsers(page,selectedRole,selectedStatus,searchQuery) {
    let bankId=this.get('sharedData').get('bankId');
    let url = `http://localhost:8080/banker/api/v1`;
    if(bankId!="*" && bankId)
    {
      url=url +`/banks/${bankId}`;
    }
   
    url=url+`/users?page=${page}`;
    if(selectedRole && selectedRole!='')
      {
        url=url+`&filter_role=${selectedRole}`;
      }
      if(selectedStatus && selectedStatus!='')
      {
        url=url+`&filter_status=${selectedStatus}`;
      }
      if(searchQuery && searchQuery!='')
      {
        url=url+`&search_item=${searchQuery}`;
      }

    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      // console.log(response);
      this.set('totalUsers', response.totalUsers);
      this.set('users', response.data);
    }).catch((error) => {
      this.set('users', []);
      console.error("Failed to load users:", error);
    });
  },
  FilteredUsers() {
   
    let selectedUserRole = this.get('selectedUserRole');
    let selectedUserStatus = this.get('selectedUserStatus');

    this.loadUsers(this.get('currentPage'),selectedUserRole,selectedUserStatus,this.get('searchQuery'));
      
  },

  totalPages: Ember.computed('totalUsers', 'itemsPerPage', function() {
 
    let totalItems = this.get('totalUsers');
    let itemsPerPage = this.get('itemsPerPage');
    return Math.ceil(totalItems / itemsPerPage);
  }),


  visiblePages: Ember.computed('users','currentPage', 'totalPages', function() {
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

  showFirstPage: Ember.computed('users','currentPage', function() {
    return this.get('currentPage') > 3;
  }),

  showLastPage: Ember.computed('users','currentPage', 'totalPages', function() {
    return this.get('currentPage') < this.get('totalPages') - 2;
  }),

  showLeftEllipsis: Ember.computed('users','currentPage', function() {
    return this.get('currentPage') > 3;
  }),

  showRightEllipsis: Ember.computed('users','currentPage', 'totalPages', function() {
    return this.get('currentPage') < this.get('totalPages') - 2;
  }),

  searchSuggestion() {
    let users = this.get('users') || [];
    let query = this.get('searchQuery');
  
    if (query) {
      let suggestions = [];
  
      users.forEach(user => {
        if (user.username.startsWith(query) && suggestions.indexOf(user.username) === -1) {
          suggestions.push(user.username);
        }
      });
  
      this.set('searchSuggestions', suggestions);
    } else {
      this.set('searchSuggestions', []);
    }
  },
  actions: {
    FilterReset(){
      this.set('selectedUserRole','');
      this.set('selectedUserStatus','');
      this.FilteredUsers();
    },
    UserRole(value){
      this.set('selectedUserRole',value);
      this.FilteredUsers();
    },
    UserStatus(value){
      this.set('selectedUserStatus',value);
      this.FilteredUsers();
    },
    viewUser(user) {

      this.transitionToRoute('users.user', user.user_id);
    },

    editUser(user) {
      this.transitionToRoute('users.user.edit', user.user_id).then((newRoute) => {
        newRoute.controller.setProperties({
          isEdit: true,
          userId: user.user_id,
          fullname: user.fullname,
          username: user.username,
          user_role: user.user_role,
          date_of_birth: user.date_of_birth,
          user_phonenumber: user.user_phonenumber,
          user_address: user.user_address,
          user_status: user.user_status
        });
        
      }).catch((error) => {
        console.error("Failed to load users:", error);
      });
    },

    deleteUser(user) {
      let bankId=this.get('sharedData').get('bankId');
      let url = `http://localhost:8080/banker/api/v1`;
      if(bankId!="*" && bankId)
      {
        url=url +`/banks/${bankId}`;
      }
      if(user.user_id!="*")
      {
        url=url+`/users/${user.user_id}`;

      }
      if (confirm(`Are you sure you want to delete the user: ${user.fullname}?`)) 
        {

        this.get('fetchService').fetch(url,methods.DELETE,user.user_id).then(() => {
          // console.log('User deleted successfully');
          this.get('notification').showNotification('User Deleted successfully!', 'success');

          Ember.run.later(() => {
            this.transitionToRoute('users');
            this.loadUsers(1);
           }, 2000);
        }).catch((error) => {
          console.error("Failed to load users:", error);
        });
        
      }
    },

    goToPage(page) {
      this.set('currentPage', page);
      this.loadUsers(page,this.get('selectedUserRole'),this.get('selectedUserStatus'),this.get('searchQuery'));
     
    },

    nextPage() {
      let currentPage = this.get('currentPage');
      let totalPages = this.get('totalPages');
      if (currentPage < totalPages) {
        this.incrementProperty('currentPage');
      }
      this.loadUsers(this.get('currentPage'),this.get('selectedUserRole'),this.get('selectedUserStatus'),this.get('searchQuery'));
     
    },

    previousPage() {
      let currentPage = this.get('currentPage');
      if (currentPage > 1) {
        this.decrementProperty('currentPage');
      }
      this.loadUsers(this.get('currentPage'),this.get('selectedUserRole'),this.get('selectedUserStatus'),this.get('searchQuery'));
     
    },
    updateSearchQuery(value) {
      this.set('searchQuery', value);
      this.searchSuggestion();
    },
      
    performSearch() {
      
      this.loadUsers(this.get('currentPage'),this.get('selectedUserRole'),this.get('selectedUserStatus'),this.get('searchQuery'));
     
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
