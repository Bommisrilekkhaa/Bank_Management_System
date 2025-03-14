import Ember from 'ember';
import {methods} from '../../utils/util';
export default Ember.Controller.extend({
  notification: Ember.inject.service('notify'),
  fetchService: Ember.inject.service('fetch'),
  sharedData:Ember.inject.service('sharedData'),
  errorMessage: '',


  init() {
    this._super(...arguments);
    // console.log("init...");
  },

  loadAdmins() {
    let bankId=this.get('sharedData').get('bankId');
    let url = `http://localhost:8080/banker/api/v1`;
    if(bankId!="*" && bankId)
    {
      url=url +`/banks/${bankId}`;
    }
   
    url=url+`/users?filter_admin=true`;

    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      this.set('admins', response);
    }).catch((error) => {
      console.error("Failed to load admins:", error);
    });
  },
  
 

  bankId: '',
  bank_name: '',
  bank_code: '',
  admin_id: '',
  isEdit: false,

  actions: {
    submitForm() {
      if (!this.get('bank_name') || this.get('bank_name').trim() === '') {
        this.set("errorMessage", 'Please provide a bank name.');
        return;
      }

      if (!this.get('bank_code') || this.get('bank_code').trim() === '') {
        this.set("errorMessage", 'Please provide a bank code.');
        return;
      }
      if(!this.get('admin_id'))
      {
        this.set("errorMessage", 'Please select an admin');
        return;
      }

      const bankData = {
        bank_name: this.get('bank_name'),
        bank_code: this.get('bank_code'),
        admin_id: this.get('admin_id'),
      };

      let url = `http://localhost:8080/banker/api/v1/banks`;

        this.get('fetchService').fetch(url,methods.POST,bankData).then(() => {
          this.resetForm();
          this.get('notification').showNotification('Bank created successfully!', 'success');
          Ember.run.later(() => {
            this.transitionToRoute('banks');
          }, 2000);
        }).catch((error) => {
          console.error('Error creating bank:', error);
        });
      
    },

    cancel() {
      this.resetForm();
    }
  },

  resetForm() {
    this.setProperties({
      bankId: '',
      bank_name: '',
      bank_code: '',
      bank_status: '',
      admin_id: '',
      isEdit: false
    });
  }
});
