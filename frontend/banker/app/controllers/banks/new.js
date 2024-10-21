import Ember from 'ember';

export default Ember.Controller.extend({
  notification: Ember.inject.service('notify'),
  banksService: Ember.inject.service('banks'),
  usersService: Ember.inject.service('users'),
  errorMessage: '',


  init() {
    this._super(...arguments);
    console.log("init...");
  },

  loadAdmins() {

    this.get('usersService').fetchAdmins().then((response) => {
      this.set('admins', response);
    }).catch((error) => {
      console.error("Failed to load admins:", error);
    });
  },
  
 

  bankId: '',
  bank_name: '',
  bank_code: '',
  admin_name: '',
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
      if(!this.get('admin_name'))
      {
        this.set("errorMessage", 'Please select an admin');
        return;
      }

      const bankData = {
        bank_name: this.get('bank_name'),
        bank_code: this.get('bank_code'),
        admin_name: this.get('admin_name'),
      };

     
        this.get('banksService').createBank(bankData).then(() => {
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
      admin_name: '',
      isEdit: false
    });
  }
});
