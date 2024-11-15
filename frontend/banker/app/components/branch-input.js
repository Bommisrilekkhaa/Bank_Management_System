import Ember from 'ember';
import {methods} from '../utils/util';
export default Ember.Component.extend({
  notification: Ember.inject.service('notify'),
  fetchService: Ember.inject.service('fetch'),
  errorMessage: '',
  branchId: '',
  name: '',
  address: '',
  branch_number: '',
  sharedData:Ember.inject.service('shared-data'),
  manager_id: '',
  isEdit: false,  
  availableManagers:[],
  init() {
    this._super(...arguments);
    // console.log("init...");
    this.loadManagers(); 
  },
  loadManagers() {
    let bankId= this.get('sharedData').get('bankId');
    let url = `http://localhost:8080/banker/api/v1`;
    if(bankId!="*")
    {
      url=url +`/banks/${bankId}`;
    }
   
    url=url+`/users?filter_manager=true`;

    // console.log(this.get('bankId'));
    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      this.set('availableManagers', response);
    }).catch((error) => {
      console.error("Failed to load managers:", error);
    });
  },
  

  actions: {
    submitForm() {
      if (!this.get('name') || this.get('name').trim() === '') {
        this.set("errorMessage", 'Branch name cannot be empty.');
        return;
      }

      if (!this.get('address') || this.get('address').trim() === '') {
        this.set("errorMessage", 'Branch address cannot be empty.');
        return;
      }

      if (!this.get('manager_id') || this.get('manager_id') <=0) {
        this.set("errorMessage", 'Invalid Manager ID .');
        return;
      }

      const branchData = {
        branch_name: this.get('name'),
        branch_address: this.get('address'),
        manager_id: this.get('manager_id'),
        bankId:  this.get('sharedData').get('bankId'),
        branchId:this.get('branchId')
      };

      if (this.get('isEdit')) {
        let bankId= this.get('sharedData').get('bankId');
        let url = `http://localhost:8080/banker/api/v1/`;
        if(bankId!="*")
        {
          url=url +`banks/${bankId}`;
        }
        // console.log(branchData);
        if(branchData.branchId!='*')
        {
          url=url+`/branches/${branchData.branchId}`;
        }
        this.get('fetchService').fetch(url,methods.PUT,branchData).then(() => {
         
          // console.log('Branch updated successfully!');
          this.resetForm();
          this.get('notification').showNotification('Branch Edited successfully!', 'success');

          Ember.run.later(() => {
           this.sendAction("toBranch");
           }, 2000);
        }).catch((error) => {
          console.error('Error updating branch:', error);
        });
      } else {

        let bankId= this.get('sharedData').get('bankId');
        let url = `http://localhost:8080/banker/api/v1/`;
        if(bankId!="*")
        {
          url=url +`banks/${bankId}`;
        }
        url=url+`/branches`;

        this.get('fetchService').fetch(url,methods.POST,branchData).then(() => {
          // console.log('Branch created successfully!');
          this.resetForm();
          this.get('notification').showNotification('Branch Created successfully!', 'success');

          Ember.run.later(() => {
           this.sendAction("toBranch");
           }, 2000);
        }).catch((error) => {
          console.error('Error creating branch:', error);
        });
      }
    },

    cancel() {
      this.resetForm();
      this.sendAction("toBranch");
    }
  },

  resetForm() {
    this.setProperties({
      name: '',
      address: '',
      manager_id: '',
      isEdit: false
    });
  }
});
