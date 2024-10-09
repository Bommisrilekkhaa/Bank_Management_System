import Ember from 'ember';

export default Ember.Component.extend({

  branchesService: Ember.inject.service('branches'),
  accountsService: Ember.inject.service('accounts'),
  errorMessage: '',
  branchNames: [],
  statuses: ['pending','active', 'inactive'],
  types: ['savings','business'],
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
    console.log("init...");
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
  bankId: localStorage.getItem("bankId"),
  isEdit: false,  
  branchId:'',
  loadBranches() {
    console.log(this.get('bankId'));
    this.get('branchesService').fetchBranches(this.get('bankId')).then((response) => {
      this.set('branchNames', response);
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

    // if (!this.get('statuses').includes(this.get('acc_status'))) {
    //   this.set("errorMessage","Please select a valid account status.");
    //   return;
    // }

    // if (!this.get('username') || this.get('username').trim() === '') {
    //   this.set("errorMessage",'Username cannot be empty.');
    //   return;
    // }

    if (!this.get('branch_name') || this.get('branch_name').trim() === '') {
      this.set("errorMessage",'Please select a branch.');
      return;
    }
    let array=this.get('branchNames');
    for (let i = 0; i < array.length; i++) {
      let item = array[i];
      if(item['branch_name']==this.get('branch_name'))
      {
        this.branchId = item['branch_id'];
      }
    }
        
       localStorage.setItem('branchId',this.get('branchId'));
        const userData={
          fullname:this.get('fullname'),
        }
        const accountData = {
          accNo: this.get('accNo'),
          acc_type: this.get('acc_type'),
          // acc_balance: this.get('acc_balance'),
          username:this.get('username'),
          acc_status: this.get('acc_status'),
          fullname: this.get('fullname'),
          bankId:this.get('bankId'),
          branch_name: this.get('branch_name'),
        };


    
    if (this.get('isEdit')) {
      
            this.get('accountsService').updateUser(userData).then(() => {
              console.log("fullname updated");
            }).catch((error) => {
              console.error(error);
            });        
       
        this.get('accountsService').updateAccount(accountData).then(() => {
          // alert('Account updated successfully!');
          this.resetForm();
          this.sendAction("toAccount");
        }).catch((error) => {
          // alert('Error updating account');
          console.error(error);
        });

        
      } else {
       
        this.get('accountsService').createAccount(accountData).then(() => {
          // alert('Account created successfully!');
          this.resetForm();
          this.sendAction("toAccount");
        }).catch((error) => {
          // alert('Error creating account');
          console.error(error);
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
