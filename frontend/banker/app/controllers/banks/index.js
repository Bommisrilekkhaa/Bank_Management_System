import Ember from 'ember';
import {methods} from '../../utils/util';
export default Ember.Controller.extend({
  fetchService: Ember.inject.service('fetch'),
  
  banks: [],

  loadBanks(page) {

    let  url= `http://localhost:8080/banker/api/v1/banks?page=${page}`;
    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      // console.log(response);
      this.set('totalBanks', response.totalBanks);
      this.set('banks', response.data);
    }).catch((error) => {
      this.set('banks', []);
      console.error("Failed to load banks:", error);
    });
  },
  currentPage: 1,
  itemsPerPage: 8,
  totalPages: Ember.computed('totalBanks', 'itemsPerPage', function() {
 
    let totalItems = this.get('totalBanks');
    let itemsPerPage = this.get('itemsPerPage');
    return Math.ceil(totalItems / itemsPerPage);
  }),


  visiblePages: Ember.computed('banks','currentPage', 'totalPages', function() {
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

  showFirstPage: Ember.computed('banks','currentPage', function() {
    return this.get('currentPage') > 3;
  }),

  showLastPage: Ember.computed('banks','currentPage', 'totalPages', function() {
    return this.get('currentPage') < this.get('totalPages') - 2;
  }),

  showLeftEllipsis: Ember.computed('banks','currentPage', function() {
    return this.get('currentPage') > 3;
  }),

  showRightEllipsis: Ember.computed('banks','currentPage', 'totalPages', function() {
    return this.get('currentPage') < this.get('totalPages') - 2;
  }),

  actions: {
    viewBank(bank) {
      this.transitionToRoute('banks.bank', bank.bank_id);
    },
    addNewBank() {
        this.transitionToRoute('banks.new').then(()=>{
          
        }).catch((error) => {
          console.error("Transition failed", error);
        });
          
      },

      goToPage(page) {
        this.set('currentPage', page);
        this.loadBanks(page);
       
      },
  
      nextPage() {
        let currentPage = this.get('currentPage');
        let totalPages = this.get('totalPages');
        if (currentPage < totalPages) {
          this.incrementProperty('currentPage');
        }
        this.loadBanks(this.get('currentPage'));
       
      },
  
      previousPage() {
        let currentPage = this.get('currentPage');
        if (currentPage > 1) {
          this.decrementProperty('currentPage');
        }
        this.loadBanks(this.get('currentPage'));
       
      }
      
    }
});