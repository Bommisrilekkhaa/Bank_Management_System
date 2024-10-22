import Ember from 'ember';

export default Ember.Controller.extend({
  branchesService: Ember.inject.service('branches'),
  bankId: localStorage.getItem("bankId"),
  branches: [],

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
    viewBranch(branch) {
      localStorage.setItem('branchId',branch.branch_id);
      this.transitionToRoute('banks.bank.branches.branch', this.get('bankId'), branch.branch_id).then((newRoute) => {
        newRoute.controller.setProperties({
          bankId: this.get('bankId'),
          Branch: branch
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    },

    addNewBranch() {
      console.log(this.get('bankId'));
      this.transitionToRoute('banks.bank.branches.new').then((newRoute) => {
        newRoute.controller.setProperties({
          bankId: this.get('bankId')
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    },

    editBranch(branch) {
      localStorage.setItem('branchId',branch.branch_id);
      this.transitionToRoute('banks.bank.branches.branch.edit', this.get('bankId'), branch.branch_id).then((newRoute) => {
        newRoute.controller.setProperties({
          isEdit: true,
          branchId: branch.branch_id,
          branch_name: branch.branch_name,
          branch_address: branch.branch_address,
          branch_number: branch.branch_number,
          manager_id:branch.manager_id,
          manager_name:branch.manager_name,
          bankId: this.get('bankId')
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    },

    deleteBranch(branch) {
      if (confirm(`Are you sure you want to delete the branch: ${branch.branch_name}?`)) {
        this.get('branchesService').deleteBranch(this.get('bankId'), branch.branch_id).then(() => {
          console.log('Branch deleted successfully');
          this.loadBranches();
        }).catch((error) => {
          console.error("Failed to delete branch:", error);
          alert('Error occurred while deleting the branch.');
        });
      }
    }
  }
});
