import Ember from 'ember';
import { loanStatus,loanType ,role,methods} from '../utils/util';
export default Ember.Component.extend({
  notification: Ember.inject.service('notify'),
  fetchService: Ember.inject.service('fetch'),
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
  let url = `http://localhost:8080/banker/api/v1/`;
  let branchId = localStorage.getItem("branchId");
  let bankId = localStorage.getItem('bankId');
  if(bankId!="*")
  {
    url=url +`banks/${bankId}`;
  }
  if(branchId!='*')
  {
    url=url+`/branches/${branchId}`;
  }
  url=url+`/accounts?acc_status=1`;

    this.get('fetchService').fetch(url,methods.GET).then((response) => {
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
        loan_type: (this.get('loan_type')==loanType.HOMELOAN)?0:((this.get('loan_type')==loanType.BUSINESSLOAN)?1:2),
        loan_amount: this.get('loan_amount'),
        loan_duration: this.get('loan_duration'),
        loan_status:(this.get('loan_status')=='')?0:((this.get('loan_status')==loanStatus.PENDING)?0:((this.get('loan_status')==loanStatus.APPROVED)?1:((this.get('loan_status')==loanStatus.CLOSED)?2:3))),
        acc_number: (this.get('isDirect'))?this.get('accNo'):localStorage.getItem('accNo')
      };

      let url = `http://localhost:8080/banker/api/v1/`;
      let bankId = localStorage.getItem("bankId");
      let branchid = localStorage.getItem("branchId");
      let accno = loanData.acc_number
      let loanId = localStorage.getItem("loanId");
      if(bankId!="*")
      {
        url=url +`banks/${bankId}`;
      }
      if(branchid!='*')
      {
        url=url+`/branches/${branchid}`;
      }
      if(accno!="*")
      {
        url = url+`/accounts/${accno}`;
      }
    
      if (this.get('isEdit')) {
        if(loanId!="*")
        {
          url=url+`/loans/${loanId}`;
        }
        this.get('fetchService').fetch(url,methods.PUT,loanData).then(() => {
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
        url=url+`/loans`;
        this.get('fetchService').fetch(url,methods.POST,loanData).then(() => {
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
