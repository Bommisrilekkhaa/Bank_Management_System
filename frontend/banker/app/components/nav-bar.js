import Ember from 'ember';
import { role,methods ,getSessionData} from '../utils/util';
export default Ember.Component.extend({
  branchSelection: Ember.inject.service('branch-select'),
  fetchService: Ember.inject.service('fetch'),
  session: Ember.inject.service(),
  sharedData:Ember.inject.service('shared-data'),
  branches: [],
  userRole:role,
  role:Ember.computed(()=>{return getSessionData().user_role}),
  // currentRouteName: Ember.computed('router.currentRouteName', function () {
  //   return this.get('router.currentRouteName');
  // }),
  init() {
    this._super(...arguments);
    if(this.get('role')==role.ADMIN || this.get('role')==role.CUSTOMER)
      {
        this.loadBranches();
        
      }
  }, 
  loadBranches() {
    let bankId=this.get('sharedData').get('bankId');
      let url = `http://localhost:8080/banker/api/v1/`;
        if(bankId!="*" && bankId)
        {
          url=url +`banks/${bankId}`;
        }
        
        url=url+`/branches`;
    Ember.run.later(() => { 
      this.get('fetchService').fetch(url,methods.GET).then((response) => {
      // console.log(response);
      this.set('branches', response.data);
    }).catch((error) => {
      console.error("Failed to load branches:", error);
    });
  }, 3000);
  },

 
  changeBranch(branchId) {
    
    this.get('branchSelection').changeBranch(branchId);
  },
  actions: {
    navigate(routeName) {
      this.set('branch_name','');
      console.log(this.get('branch_name'));
      this.set('currentRoute',routeName);
      routeName=routeName+"Route"
      this.get(routeName)();
    },
    logout() {
      this.get('logout')();
    },
    setbranch(branch_name) {
      let array = this.get('branches');

      if (!Array.isArray(array)) {
        console.error('branches is not defined or not an array');
        return;
      }
      if(branch_name=='')
      {
        this.get('sharedData').set('branchId', '*');
        this.changeBranch("*");
      }
      else
      {
        let selectedBranch = array.find((item) => item.branch_name === branch_name);
        
        if (selectedBranch) {
          this.get('sharedData').set('branchId', selectedBranch.branch_id);
          this.changeBranch(selectedBranch.branch_id);
          // console.log('Branch ID set to:', selectedBranch.branch_id);
        } else {
          console.warn('Branch not found');
        }

      }
    }
  },
  // willDestroyElement() {
  //   this._super(...arguments);
  
  //   // Remove observer
  //   this.removeObserver('sharedData.branchId', this, this.handleBranchChange);
  // },
});
