import Ember from 'ember';

export default Ember.Controller.extend({
  branchesService: Ember.inject.service('branches'),
  role:Ember.computed(()=>{
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${'sessionData'}=`);
    if (parts.length === 2) {
        let cookieData = decodeURIComponent(parts.pop().split(';').shift());
        let sessionData = JSON.parse(cookieData);  
        return sessionData.user_role;  
    }
  }),
  actions: {
    viewAccounts(branch) {
      localStorage.setItem("branchId",branch.branch_id);
      this.transitionToRoute('banks.bank.accounts', this.get('bankId')).then((newRoute) => {
        newRoute.controller.setProperties({
          bankId: localStorage.getItem('bankId'),
          branchId: this.get('branchId')
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    },

    delete(branch) {
      if (confirm(`Are you sure you want to delete the branch: ${branch.branch_name}?`)) {
        this.get('branchesService').deleteBranch(this.get('bankId'), branch.branch_id).then(() => {
          console.log('Branch deleted successfully');
        }).catch((error) => {
          console.error("Failed to delete branch:", error);
          alert('Error occurred while deleting the branch.');
        });
      }
    }
  }
});
