import Ember from 'ember';
import {status,accountType,role,methods} from '../utils/util';
export default Ember.Component.extend({
  notification: Ember.inject.service('notify'),
  fetchService: Ember.inject.service('fetch'),
  sharedData:Ember.inject.service('shared-data'),
  errorMessage: '',
  branchNames: [],
  userRole:role,
  statuses: [status.ACTIVE,status.INACTIVE,status.PENDING],
  types: [accountType.BUSINESS,accountType.SAVINGS],
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
    // console.log("init...");
    this.loadBranches();
  }, 
  userId: Ember.computed(()=>{
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${'sessionData'}=`);
    if (parts.length === 2) {
        let cookieData = decodeURIComponent(parts.pop().split(';').shift());
        let sessionData = JSON.parse(cookieData);
          return sessionData.user_id;  
    }
  }),

  
  accNo: '',
  acc_type: '',
  acc_balance: '',
  acc_status: '',
  username: '',
  fullname:'',
  branch_name: '',
  isEdit: false,  
  branchId:'',
  loadBranches() {
    let bankId=this.get('sharedData').get('bankId');
    let url = `http://localhost:8080/banker/api/v1/`;
      if(bankId!="*")
      {
        url=url +`banks/${bankId}`;
      }
      
      url=url+`/branches`;
    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      this.set('branchNames', response[0].data);
     
    }).catch((error) => {
      console.error("Failed to load branches:", error);
    });
  },
  
  actions: {
    submitForm() {

    if (!this.get('types').includes(this.get('acc_type'))) {
      this.set("errorMessage",'Please select a valid account type.');
      return;
    }


    if (!this.get('branch_name') || this.get('branch_name').trim() === '') {
      this.set("errorMessage",'Please select a branch.');
      return;
    }
    let array=this.get('branchNames');
    for (let i = 0; i < array.length; i++) {
      let item = array[i];
      if(item['branch_name']==this.get('branch_name'))
      {
        this.set('branchId',item['branch_id']);
      }
    }
      
      if(this.get('role')!='MANAGER')
      {
        this.get('sharedData').set('branchId',this.get('branchId'));
      }
        
        const accountData = {
          acc_type: (this.get('acc_type')==accountType.BUSINESS)?0:1,
          // acc_balance: this.get('acc_balance'),
          username:this.get('username'),
          acc_status: (this.get('acc_status')=='')?0:((this.get('acc_status')==status.PENDING)?0:((this.get('acc_status')==status.ACTIVE)?1:2)),
          bank_id:this.get('sharedData').get('bankId'),
          user_id:this.get('user_id')
        };


  let url = `http://localhost:8080/banker/api/v1/`;
  let bankId = this.get('sharedData').get('bankId');
  let branchId = this.get('sharedData').get("branchId");
    if (this.get('isEdit')) {
      let accNo = this.get('sharedData').get('accNo');
      if(bankId!="*")
      {
        url=url +`banks/${bankId}`;
      }
      if(branchId!='*')
      {
        url=url+`/branches/${branchId}`;
      }
      if(accNo!="*")
      {
        url = url+`/accounts/${accNo}`;
      }

        this.get('fetchService').fetch(url,methods.PUT,accountData).then(() => {
          // alert('Account updated successfully!');

          this.resetForm();
          this.get('notification').showNotification('Account Edited successfully!', 'success');

           Ember.run.later(() => {
            this.sendAction("toAccount");
            }, 2000);
        }).catch((error) => {
          // alert('Error updating account');
          console.error(error);
          this.sendAction("toAccount");
        });

        
      } else {
        if(bankId!="*")
        {
          url=url +`banks/${bankId}`;
        }
        if(branchId!='*')
        {
          url=url+`/branches/${branchId}`;
        }
        url=url+`/accounts`;
    
        this.get('fetchService').fetch(url,methods.POST,accountData).then(() => {

          // alert('Account created successfully!');
          this.resetForm();
        
          this.get('notification').showNotification('Account Created successfully!', 'success');

           Ember.run.later(() => {
            this.sendAction("toAccount");
            }, 2000);
        }).catch((error) => {
          // alert('Error creating account');
          console.error(error);
          this.sendAction("toAccount");
        });
      }
    },

    cancel() {
      this.resetForm();
      // this.transitionToRoute('accounts'); 
    }
  },

  resetForm() {
    this.setProperties({
      accNo: '',
      acc_type: '',
      // acc_balance: '',
      fullname:'',
      acc_status: '',
      username: '',
      branch_name: '',
      isEdit: false
    });
  }

});
