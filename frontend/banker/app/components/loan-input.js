import Ember from 'ember';
import { loanStatus,loanType ,role} from '../utils/util';
export default Ember.Component.extend({
  notification: Ember.inject.service('notify'),
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
  userRole:role,
  statuses: [loanStatus.PENDING,loanStatus.APPROVED,loanStatus.CLOSED,loanStatus.REJECTED],
  types: [loanType.BUSINESSLOAN,loanType.EDUCATIONLOAN,loanType.HOMELOAN], 
  durations:[6,12,18,24],
  init() {
    this._super(...arguments);
    console.log("Loan form initialized...");
    if(this.get('isDirect'))
    {
      this.loadAccounts();

    }
  }, 
  role:Ember.computed(()=>{
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${'sessionData'}=`);
    if (parts.length === 2) {
        let cookieData = decodeURIComponent(parts.pop().split(';').shift());
        let sessionData = JSON.parse(cookieData);  
        return sessionData.user_role;  
    }
  }),

  filteredStatuses: Ember.computed('loan_amount', function() {
    if (this.get('loan_amount') > 3000000) {
      return [loanStatus.REJECTED]; 
    } else {
      return [loanStatus.PENDING,loanStatus.APPROVED,loanStatus.CLOSED,loanStatus.REJECTED];
    }
  }),

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
    this.get('accountsService').fetchActiveAccounts(this.get('bankId')).then((response) => {
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

      if(this.get('role')!=this.userRole.CUSTOMER)
      {
        if (!this.get('statuses').includes(this.get('loan_status'))) {
          this.set("errorMessage", "Please select a valid loan status.");
          return;
        }

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
          this.get('notification').showNotification('Loan Edited successfully!', 'success');

          Ember.run.later(() => {
           this.sendAction("toLoan");
           }, 2000);
        }).catch((error) => {
          console.error('Error updating loan:', error);
        });

      } else {
        this.get('loansService').createLoan(loanData).then(() => {
          console.log('Loan created successfully!');
          this.resetForm();
          this.get('notification').showNotification('Loan Created successfully!', 'success');

          Ember.run.later(() => {
           this.sendAction("toLoan");
           }, 2000);
        }).catch((error) => {
          this.resetForm();
          this.sendAction("toLoan");
          console.error('Error creating loan:', error);
        });
      }
    },

    cancel() {
      this.resetForm();
      this.sendAction('toLoan');
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
