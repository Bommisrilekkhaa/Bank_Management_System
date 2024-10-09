import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  branchesService: Ember.inject.service('branches'),
  bankId:localStorage.getItem('bankId'),
  userId: Ember.computed(() => {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${'sessionData'}=`);
    if (parts.length === 2) {
      let cookieData = decodeURIComponent(parts.pop().split(';').shift());
      let sessionData = JSON.parse(cookieData);
      return sessionData.user_id; 
    }
  }),
  isAuthRoute: Ember.computed('currentRouteName', function() {
    const authRoutes = ['login', 'register', 'index'];
    return authRoutes.includes(this.get('currentRouteName'));
  }),
  branchNames:[],
  branch:'',
  branchId:'',
  getBranchId(userId)
  {
    this.get('branchesService').fetchBranches(this.get('bankId')).then((response) => {
      this.set('branchNames',response);
    }).catch((error) => {
      console.error("Failed to load branches:", error);
    });

    let array =this.get('branchNames');
    for (let i = 0; i < array.length; i++) {
      let item = array[i];
      if(item['manager_id']==userId)
      {
        this.set('branch',item);
        this.set('branchId',item['branch_id']);
        break;
      }
    }
  },

  actions:{
    logout() {
            
      this.get('session').logout()
        .then(() => {
          this.transitionToRoute('login'); 
        });
    },
    toUsers()
    {
      console.log(this.get('bankId'));
      this.transitionToRoute('banks.bank.users',this.get('bankId'));
    },
    toBank()
    {
      this.transitionToRoute('banks.bank',this.get('bankId'));
    },
    toBranch()
    {
      let bankId = this.get('bankId')
      this.getBranchId(this.get('userId'));
      console.log(this.get('branchId'));
      this.transitionToRoute('banks.bank.branches.branch',bankId,this.get('branchId')).then((newRoute) => {
        newRoute.controller.setProperties({
          bankId: bankId,
          Branch: this.get('branch')
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    },
    toBranches()
    {
      this.transitionToRoute('banks.bank.branches',this.get('bankId'));
    },
    toAccounts()
    {
      this.transitionToRoute('banks.bank.accounts',this.get('bankId'));
    },

    todashboard()
    {
      this.transitionToRoute('banks.bank.users.user.dashboard',this.get('bankId'),this.get('userId'));
    },
    toTransactions()
    {
      this.transitionToRoute('banks.bank.transactions',this.get('bankId'));
    },
    toLoans()
    {
      this.transitionToRoute('banks.bank.loans',this.get('bankId'));
    }
  }
});
