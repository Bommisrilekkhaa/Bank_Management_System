import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  sharedData:Ember.inject.service('shared-data'),
  fetchService: Ember.inject.service('fetch'),
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
      this.set('bankId',this.get('sharedData').get('bankId'));
      this.transitionToRoute('banks.bank', this.get('bankId'));
    },
    toBanks() {
      this.transitionToRoute('banks');
    },
    toBranch() {
      this.set('bankId',this.get('sharedData').get('bankId'));
      let bankId = this.get('bankId');
      // console.log(this.get('branchId'));
      this.transitionToRoute('banks.bank.branches.branch', bankId,this.get('sharedData').get('branchId')).then((newRoute) => {
        newRoute.controller.setProperties({
          bankId: bankId,
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    },
    toBranches() {
      this.set('bankId',this.get('sharedData').get('bankId'));
      this.transitionToRoute('banks.bank.branches', this.get('bankId'));
    },
    toAccounts() {
      this.set('bankId',this.get('sharedData').get('bankId'));
      this.transitionToRoute('banks.bank.accounts', this.get('bankId'));
    },

    todashboard() {
      this.set('bankId',this.get('sharedData').get('bankId'));
      // console.log("bankId : "+this.get('bankId'));
      this.transitionToRoute('banks.bank.users.user.dashboard', this.get('bankId'), this.get('userId'));
    },
    toTransactions() {
      this.set('bankId',this.get('sharedData').get('bankId'));
      this.transitionToRoute('banks.bank.transactions', this.get('bankId'));
    },
    toLoans() {
      this.set('bankId',this.get('sharedData').get('bankId'));
      this.transitionToRoute('banks.bank.loans', this.get('bankId'));
    }
  }
});
