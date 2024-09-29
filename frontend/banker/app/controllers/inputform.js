import Ember from 'ember';

export default Ember.Controller.extend({

  accountsService: Ember.inject.service('accounts'),
  errorMessage: '',
  branchNames: [],
  statuses: ['active', 'pending', 'inactive'],
  types: ['savings','business'],


  init() {
    this._super(...arguments);
    this.loadBranches();
  }, 
  acc_no: '',
  acc_type: '',
  // acc_balance: '',
  acc_status: '',
  username: '',
  branch_name: '',
  isEdit: false,  

  loadBranches() {
    this.get('accountsService').fetchBranches().then((response) => {
      this.set('branchNames', response);
    }).catch((error) => {
      console.error("Failed to load branches:", error);
    });
  },
  isBranchSelected(branch) {
    return this.get('branch_name') === branch;
  },

  actions: {
    submitForm() {

    if (!this.get('types').includes(this.get('acc_type'))) {
      this.set("errorMessage",'Please select a valid account type.');
      return;
    }

    if (!this.get('statuses').includes(this.get('acc_status'))) {
      this.set("errorMessage","Please select a valid account status.");
      return;
    }

    if (!this.get('username') || this.get('username').trim() === '') {
      this.set("errorMessage",'Username cannot be empty.');
      return;
    }

    if (!this.get('branch_name') || this.get('branch_name').trim() === '') {
      this.set("errorMessage",'Please select a branch.');
      return;
    }


      const accountData = {
        acc_no: this.get('acc_no'),
        acc_type: this.get('acc_type'),
        // acc_balance: this.get('acc_balance'),
        acc_status: this.get('acc_status'),
        username: this.get('username'),
        branch_name: this.get('branch_name')
      };

      if (this.get('isEdit')) {
      
        this.get('accountsService').updateAccount(accountData).then(() => {
          // alert('Account updated successfully!');
          this.resetForm();
          this.transitionToRoute('accounts');
        }).catch((error) => {
          alert('Error updating account');
          console.error(error);
        });
      } else {
       
        this.get('accountsService').createAccount(accountData).then(() => {
          // alert('Account created successfully!');
          this.resetForm();
          this.transitionToRoute('accounts');
        }).catch((error) => {
          alert('Error creating account');
          console.error(error);
        });
      }
    },

    cancel() {
      this.resetForm();
      this.transitionToRoute('accounts'); 
    }
  },

  resetForm() {
    this.setProperties({
      acc_no: '',
      acc_type: '',
      // acc_balance: '',
      acc_status: '',
      username: '',
      branch_name: '',
      isEdit: false
    });
  }
});
