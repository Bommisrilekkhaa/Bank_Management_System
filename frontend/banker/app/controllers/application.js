import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  branchesService: Ember.inject.service('branches'),
  userId: Ember.computed(() => {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${'sessionData'}=`);
    if (parts.length === 2) {
      let cookieData = decodeURIComponent(parts.pop().split(';').shift());
      let sessionData = JSON.parse(cookieData);
      return sessionData.user_id;
    }
  }),
  isAuthRoute: Ember.computed('currentRouteName', function () {
    const authRoutes = ['login', 'register', 'index', 'super-admin-login'];
    return authRoutes.includes(this.get('currentRouteName'));
  }),
  getBranchId(userId) {
    this.set('bankId',localStorage.getItem('bankId'));
    this.get('branchesService').fetchBranches(this.get('bankId')).then((response) => {
      this.set('branchNames', response);
    }).catch((error) => {
      console.error("Failed to load branches:", error);
    });

    let array = this.get('branchNames');
    for (let i = 0; i < array.length; i++) {
      let item = array[i];
      if (item['manager_id'] == userId) {
        this.set('branch', item);
        this.set('branchId', item['branch_id']);
        break;
      }
    }
  },

  actions: {
    logout() {

      this.get('session').logout()
        .then(() => {
          this.transitionToRoute('login');

        });
    },
    toUsers() {
      this.transitionToRoute('users');
    },
    toBank() {
      this.set('bankId',localStorage.getItem('bankId'));
      this.transitionToRoute('banks.bank', this.get('bankId'));
    },
    toBanks() {
      this.transitionToRoute('banks');
    },
    toBranch() {
      this.set('bankId',localStorage.getItem('bankId'));
      let bankId = this.get('bankId')
      this.getBranchId(this.get('userId'));
      console.log(this.get('branchId'));
      this.transitionToRoute('banks.bank.branches.branch', bankId, this.get('branchId')).then((newRoute) => {
        newRoute.controller.setProperties({
          bankId: bankId,
          Branch: this.get('branch')
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    },
    toBranches() {
      this.set('bankId',localStorage.getItem('bankId'));
      this.transitionToRoute('banks.bank.branches', this.get('bankId'));
    },
    toAccounts() {
      this.set('bankId',localStorage.getItem('bankId'));
      this.transitionToRoute('banks.bank.accounts', this.get('bankId'));
    },

    todashboard() {
      this.set('bankId',localStorage.getItem('bankId'));
      // console.log("bankId : "+this.get('bankId'));
      this.transitionToRoute('banks.bank.users.user.dashboard', this.get('bankId'), this.get('userId'));
    },
    toTransactions() {
      this.set('bankId',localStorage.getItem('bankId'));
      this.transitionToRoute('banks.bank.transactions', this.get('bankId'));
    },
    toLoans() {
      this.set('bankId',localStorage.getItem('bankId'));
      this.transitionToRoute('banks.bank.loans', this.get('bankId'));
    }
  }
});
