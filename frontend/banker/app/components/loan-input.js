import Ember from 'ember';

export default Ember.Component.extend({
  accountsService: Ember.inject.service('accounts'),
  loansService: Ember.inject.service('loans'),
  errorMessage: '',
  accounts:[],
  loan_id: '',
  loan_type: '',
  loan_amount: '',
  loan_interest: '',
  loan_duration: '',
  loan_status: '',
  loan_availed_date: '',
  isEdit: false,
  isDirect:false,
  accNo:'',
  bankId:localStorage.getItem("bankId"),
  statuses: ['approved','closed', 'pending', 'rejected'],
  types: ['businessloan', 'homeloan', 'educationloan'], 
  durations:['6 months','12 months','18 months','24 months'],
  init() {
    this._super(...arguments);
    console.log("Loan form initialized...");
    if(this.get('isDirect'))
    {
      this.loadAccounts();

    }
  }, 

  userId: Ember.computed(() => {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${'sessionData'}=`);
    if (parts.length === 2) {
      let cookieData = decodeURIComponent(parts.pop().split(';').shift());
      let sessionData = JSON.parse(cookieData);
      return sessionData.user_id; 
    }
  }),
  
  loadAccounts() {
    this.get('accountsService').fetchAccounts(this.get('bankId')).then((response) => {
      console.log(response);
      this.set('accounts', response);
    }).catch((error) => {
      console.error("Failed to load accounts:", error);
    });
  },
  actions: {
    submitForm() {

      if (!this.get('types').includes(this.get('loan_type'))) {
        this.set("errorMessage", 'Please select a valid loan type.');
        return;
      }

      if (!this.get('statuses').includes(this.get('loan_status'))) {
        this.set("errorMessage", "Please select a valid loan status.");
        return;
      }

      if (!this.get('loan_amount') || this.get('loan_amount') <= 0) {
        this.set("errorMessage", 'Loan amount must be a positive number.');
        return;
      }

      if (!this.get('loan_duration') || this.get('loan_duration') <= 0) {
        this.set("errorMessage", 'Loan duration must be a positive number.');
        return;
      }

      

      
      const loanData = {
        loan_id:this.get('loan_id'),
        loan_type: this.get('loan_type'),
        loan_amount: this.get('loan_amount'),
        loan_duration: this.get('loan_duration'),
        loan_status: this.get('loan_status'),
        userId: this.get('userId'),
        branchId:localStorage.getItem('branchId'),
        bankId:this.get('bankId'),
        accNo: (this.get('isDirect'))?this.get('accNo'):localStorage.getItem('accNo')
      };

      if (this.get('isEdit')) {
        this.get('loansService').updateLoan(loanData).then(() => {
          console.log('Loan updated successfully!');
          this.resetForm();
          this.sendAction("toLoan");
        }).catch((error) => {
          console.error('Error updating loan:', error);
        });

      } else {
        this.get('loansService').createLoan(loanData).then(() => {
          console.log('Loan created successfully!');
          this.resetForm();
          this.sendAction("toLoan");
        }).catch((error) => {
          console.error('Error creating loan:', error);
        });
      }
    },

    cancel() {
      this.resetForm();
    }
  },

  resetForm() {
    this.setProperties({
      loan_id: '',
      loan_type: '',
      loan_amount: '',
      loan_interest: '',
      loan_duration: '',
      loan_status: '',
      loan_availed_date: '',
      isEdit: false
    });
  }

});
