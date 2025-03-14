import Ember from 'ember';
import { transactionStatus,transactionType,methods, getSessionData } from '../utils/util';
export default Ember.Component.extend({
  notification: Ember.inject.service('notify'),
  fetchService: Ember.inject.service('fetch'),
  sharedData:Ember.inject.service('shared-data'),
  errorMessage: '',
  statuses: [transactionStatus.PENDING,transactionStatus.SUCCESS],
  types: [transactionType.CREDIT,transactionType.DEBIT],
  isDirect:false,
  accounts:[],
  isEmi: Ember.computed('transaction_type', function() {
    return this.get('transaction_type') == transactionType.EMI;
  }),
  init() {
    this._super(...arguments);
    // console.log("Transaction form initialized...");
    if(this.get('isDirect'))
    {
      this.loadAccounts();

    }
  }, 
  role:Ember.computed('accounts',()=>{
   
        return getSessionData().user_role;  
    
  }),
  
  loadAccounts() {
    let url = `http://localhost:8080/banker/api/v1/`;
    let branchId = this.get('sharedData').get("branchId");
    let bankId = this.get('sharedData').get('bankId');
    if(bankId!="*" && bankId)
    {
      url=url +`banks/${bankId}`;
    }
    if(branchId!='*')
    {
      url=url+`/branches/${branchId}`;
    }
    url=url+`/accounts?filter_status=active`;
  
    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      // console.log(response);
      this.set('accounts', response.data);
    }).catch((error) => {
      console.error("Failed to load accounts:", error);
    });
  },
  transaction_datetime: '',
  transaction_type: '',
  transaction_status: '',
  transaction_amount: '',
  accNo: '',

  actions: {
    submitForm() {
      if (!this.get('transaction_type')) {
        this.set("errorMessage", 'Transaction type is required.');
        return;
      }
  
      if (this.get('isDirect') && !this.get('accNo')) {
       this.set("errorMessage", 'Account number is required.');
       return;
      }
      if (!this.get('transaction_amount') || this.get('transaction_amount') <= 0) {
        this.set("errorMessage", 'Transaction amount must be greater than zero.');
        return;
      }
      let date = new Date();

      let year = date.getFullYear();
      let month = String(date.getMonth() + 1).padStart(2, '0'); 
      let day = String(date.getDate()).padStart(2, '0');
      
      let hours = String(date.getHours()).padStart(2, '0');
      let minutes = String(date.getMinutes()).padStart(2, '0');
      let seconds = String(date.getSeconds()).padStart(2, '0');
      
      let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      
      const transactionData = {
        transaction_datetime: new Date(formattedDate),
        transaction_type:  (this.get('transaction_type')==transactionType.CREDIT)?0:((this.get('transaction_type')==transactionType.DEBIT)?1:2),
        transaction_amount: this.get('transaction_amount'),
        acc_number: (this.get('isDirect'))?this.get('accNo'):this.get('sharedData').get('accNo'),
      };

      let url = `http://localhost:8080/banker/api/v1/`;
      let bankId = this.get('sharedData').get('bankId');
      let branchId =this.get('sharedData').get('branchId');
      let accno = transactionData.acc_number;
      if(bankId!="*" && bankId)
      {
        url=url +`banks/${bankId}`;
      }
      if(branchId!='*')
      {
        url=url+`/branches/${branchId}`;
      }
      if(accno!="*")
      {
        url = url+`/accounts/${accno}`;
      }
      url=url+`/transactions`;

        this.get('fetchService').fetch(url,methods.POST,transactionData).then(() => {
          // console.log('Transaction created successfully!');
          this.resetForm();
          this.get('notification').showNotification('Transaction Created successfully!', 'success');

          Ember.run.later(() => {
           this.sendAction("toTransaction");
           }, 2000);
        
        }).catch((error) => {
          console.error('Error creating transaction:', error);
          this.resetForm();
          this.sendAction("toTransaction");
        });
      
    },

    cancel() {
      this.resetForm();
      this.sendAction('toTransaction');
    }
  },

  resetForm() {
    this.setProperties({
      transaction_datetime: '',
      transaction_type: '',
      transaction_status: '',
      transaction_amount: '',
      accNo: '',
      isEdit: false
    });
  }

});
