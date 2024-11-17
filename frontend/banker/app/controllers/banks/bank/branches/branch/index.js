import Ember from 'ember';
import { getSessionData, methods, role } from '../../../../../utils/util';
export default Ember.Controller.extend({
  fetchService: Ember.inject.service('fetch'),
  sessionService: Ember.inject.service('session'),
  notification: Ember.inject.service('notify'),
  sharedData:Ember.inject.service('shared-data'),
  branch:[],
  userRole:role,
  role:Ember.computed('branch',()=>{
        return getSessionData().user_role;  
    
  }),
  loadBranch(){
    let bankId=this.get('sharedData').get('bankId');
    let branchId = this.get('sharedData').get('branchId');
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
      this.set('branch', response.data);
      this.set('branch',this.get('branch')[0]);
      // console.log(this.get('branch'));
    }).catch((error) => {
      console.error("Failed to load branch:", error);
    });
  },
  actions: {
    viewAccounts() {
      let bankId=this.get('sharedData').get('bankId');
      this.transitionToRoute('banks.bank.accounts', bankId);
    },

    delete(branch) {
      let bankId=this.get('sharedData').get('bankId');
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
          this.get('sharedData').set('branchId','*');
          this.get('notification').showNotification('Branch Deleted successfully!', 'success');
          Ember.run.later(() => {
            this.get('sessionService').logout().then(() => {
              this.transitionToRoute('login');
    
            });
           }, 2000);
        }).catch((error) => {
          console.error("Failed to delete branch:", error);
        });
      }
    }
  }
});
