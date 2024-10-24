import Ember from 'ember';

export default Ember.Component.extend({
  notification: Ember.inject.service('notify'),
  usersService: Ember.inject.service('users'),
  branchesService: Ember.inject.service('branches'),
  errorMessage: '',
  branchId: '',
  name: '',
  address: '',
  branch_number: '',
  bankId: localStorage.getItem("bankId"),
  manager_id: '',
  isEdit: false,  
  availableManagers:[],
  init() {
    this._super(...arguments);
    console.log("init...");
    this.loadManagers();
  },
  loadManagers() {
    // console.log(this.get('bankId'));
    this.get('usersService').fetchManagers().then((response) => {
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
        name: this.get('name'),
        address: this.get('address'),
        manager_id: this.get('manager_id'),
        bankId: this.get('bankId'),
        branchId:this.get('branchId')
      };

      if (this.get('isEdit')) {
        this.get('branchesService').updateBranch(branchData).then(() => {
         
          console.log('Branch updated successfully!');
          this.resetForm();
          this.get('notification').showNotification('Branch Edited successfully!', 'success');

          Ember.run.later(() => {
           this.sendAction("toBranch");
           }, 2000);
        }).catch((error) => {
          console.error('Error updating branch:', error);
        });
      } else {
        this.get('branchesService').createBranch(branchData).then(() => {
          console.log('Branch created successfully!');
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
