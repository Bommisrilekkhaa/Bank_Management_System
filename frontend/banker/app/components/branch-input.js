import Ember from 'ember';

export default Ember.Component.extend({
  branchesService: Ember.inject.service('branches'),
  errorMessage: '',
  
  init() {
    this._super(...arguments);
    console.log("init...");
  },

  branchId: '',
  name: '',
  address: '',
  branch_number: '',
  manager_id: '',
  bankId: localStorage.getItem("bankId"),
  isEdit: false,  

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

      if (!this.get('branch_number') || this.get('branch_number').trim() === '') {
        this.set("errorMessage", 'Branch number cannot be empty.');
        return;
      }

      if (!this.get('manager_id') || this.get('manager_id').trim() === '') {
        this.set("errorMessage", 'Manager ID cannot be empty.');
        return;
      }

      const branchData = {
        branchId: this.get('branchId'),
        name: this.get('name'),
        address: this.get('address'),
        branch_number: this.get('branch_number'),
        manager_id: this.get('manager_id'),
        bankId: this.get('bankId'),
      };

      if (this.get('isEdit')) {
        this.get('branchesService').updateBranch(branchData).then(() => {
          console.log('Branch updated successfully!');
          this.resetForm();
          this.sendAction("toBranch");
        }).catch((error) => {
          console.error('Error updating branch:', error);
        });
      } else {
        this.get('branchesService').createBranch(branchData).then(() => {
          console.log('Branch created successfully!');
          this.resetForm();
          this.sendAction("toBranch");
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
      branchId: '',
      name: '',
      address: '',
      branch_number: '',
      manager_id: '',
      isEdit: false
    });
  }
});
