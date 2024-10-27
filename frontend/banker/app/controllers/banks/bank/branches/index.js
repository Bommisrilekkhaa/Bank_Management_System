import Ember from 'ember';
import { methods } from '../../../../utils/util';

export default Ember.Controller.extend({
  notification: Ember.inject.service('notify'),
  fetchService: Ember.inject.service('fetch'),
  bankId: localStorage.getItem("bankId"),
  branches: [],

  loadBranches() {
    // console.log(this.get('bankId'));
    let bankId=localStorage.getItem('bankId');
    let url = `http://localhost:8080/banker/api/v1/`;
      if(bankId!="*")
      {
        url=url +`banks/${bankId}`;
      }
      
      url=url+`/branches`;
    this.get('fetchService').fetch(url,methods.GET).then((response) => {
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

    deleteBranch(branch) 
    {
        let bankId=localStorage.getItem('bankId');
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
            console.log('Branch deleted successfully');
            this.get('notification').showNotification('Branch Deleted successfully!', 'success');
            Ember.run.later(() => {
              this.transitionToRoute('banks.bank.branches',this.get('bankId'));
              this.loadBranches();
            }, 2000);
          }).catch((error) => {
            console.error("Failed to delete branch:", error);
          });
        }
    }
  }
});
