import Ember from 'ember';

export default Ember.Component.extend({
  branchesService: Ember.inject.service('branches'),
  session: Ember.inject.service(),
  bankId: localStorage.getItem('bankId'),
  branches: [],
  role:Ember.computed(()=>{
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${'sessionData'}=`);
    if (parts.length === 2) {
        let cookieData = decodeURIComponent(parts.pop().split(';').shift());
        let sessionData = JSON.parse(cookieData);  
        return sessionData.user_role;  
    }
  }),
  init() {
    this._super(...arguments);
    console.log("init...");
    this.loadBranches();
    if(localStorage.key(2)==null)
    {
      localStorage.setItem('branchId', '*');
    }
    if(!localStorage.key(3)==null)
    {
      localStorage.setItem('accNo','*');  
    }
    if(!localStorage.key(4)==null)
    {
      localStorage.setItem('loanId','*');
    }
  }, 
   
  loadBranches() {
    console.log(this.get('bankId'));
    this.get('branchesService').fetchBranches(this.get('bankId')).then((response) => {
      console.log(response);
      this.set('branches', response);
    }).catch((error) => {
      console.error("Failed to load branches:", error);
    });
  },

  actions: {
    logout() {
      localStorage.clear();
      this.get('logout')();
    },
    // toUsers()
    // {
    //   this.get('toUsers')();
    // },
    toBranch()
    {
      this.get('toBranch')();
    },
    todashboard()
    {
      this.get('todashboard')();
    },
    toBank()
    {
      this.get('toBank')();
    },
    toBranches()
    {
      this.get('toBranches')();
    },
    toAccounts()
    {
      this.get('toAccounts')();
    }, 
    
    toTransactions()
    {
      this.get('toTransactions')();
    }, 
    
    toLoans()
    {
      this.get('toLoans')();
    },
    setbranch(branch_name) {
      let array = this.get('branches');

      if (!Array.isArray(array)) {
        console.error('branches is not defined or not an array');
        return;
      }
      if(branch_name=='all')
      {
        localStorage.setItem('branchId', '*');
        this.get('branchesService').set('branchId','*');
      }
      else
      {
        let selectedBranch = array.find((item) => item.branch_name === branch_name);
        
        if (selectedBranch) {
          localStorage.setItem('branchId', selectedBranch.branch_id);
          this.get('branchesService').set('branchId',selectedBranch.branch_id);
          console.log('Branch ID set to:', selectedBranch.branch_id);
        } else {
          console.warn('Branch not found');
        }

      }
    }
  }
});
