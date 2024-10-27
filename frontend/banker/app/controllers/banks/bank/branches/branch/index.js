import Ember from 'ember';
import { methods, role } from '../../../../../utils/util';
export default Ember.Controller.extend({
  fetchService: Ember.inject.service('fetch'),
  sessionService: Ember.inject.service('session'),
  notification: Ember.inject.service('notify'),
  branch:[],
  userRole:role,
  role:Ember.computed(()=>{
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${'sessionData'}=`);
    if (parts.length === 2) {
        let cookieData = decodeURIComponent(parts.pop().split(';').shift());
        let sessionData = JSON.parse(cookieData);  
        return sessionData.user_role;  
    }
  }),
  loadBranch(){
    let bankId=localStorage.getItem('bankId');
    let branchId = localStorage.getItem('branchId');
    let url = `http://localhost:8080/banker/api/v1/`;
    if(bankId!="*")
      {
        url=url +`banks/${bankId}`;
      }
      if(branchId!="*")
        {
          url=url +`/branches/${branchId}`;
        }
      
    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      this.set('branch', response);
      this.set('branch',this.get('branch')[0]);
      console.log(this.get('branch'));
    }).catch((error) => {
      console.error("Failed to load branch:", error);
    });
  },
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
          localStorage.setItem('branchId','*');
          this.get('notification').showNotification('Branch Deleted successfully!', 'success');
          Ember.run.later(() => {
            this.get('sessionService').logout().then(() => {
              this.transitionToRoute('login');
    
            });
           }, 2000);
          // console.log('Branch deleted successfully');
        }).catch((error) => {
          console.error("Failed to delete branch:", error);
          // alert('Error occurred while deleting the branch.');
        });
      }
    }
  }
});
