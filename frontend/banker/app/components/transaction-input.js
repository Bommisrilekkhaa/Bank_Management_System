import Ember from 'ember';
import { transactionStatus,transactionType } from '../utils/util';
export default Ember.Component.extend({
  notification: Ember.inject.service('notify'),
  accountsService: Ember.inject.service('accounts'),
  transactionsService: Ember.inject.service('transactions'),
  errorMessage: '',
  statuses: [transactionStatus.PENDING,transactionStatus.SUCCESS],
  types: [transactionType.CREDIT,transactionType.DEBIT],
  isDirect:false,
  accounts:[],
  bankId:localStorage.getItem('bankId'),
  isEmi: Ember.computed('transaction_type', function() {
    return this.get('transaction_type') == transactionType.EMI;
  }),
  init() {
    this._super(...arguments);
    console.log("Transaction form initialized...");
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
  
  loadAccounts() {
    this.get('accountsService').fetchActiveAccounts(this.get('bankId')).then((response) => {
      console.log(response);
      this.set('accounts', response);
    }).catch((error) => {
      console.error("Failed to load accounts:", error);
    });
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
  
  transaction_id: '',
  transaction_datetime: '',
  transaction_type: '',
  transaction_status: '',
  transaction_amount: '',
  accNo: '',

  actions: {
    submitForm() {
      
      if (!this.get('transaction_amount') || this.get('transaction_amount') <= 0) {
        this.set("errorMessage", 'Transaction amount must be a positive number.');
        return;
      }

      const transactionData = {
        transaction_id: this.get('transaction_id'),
        transaction_datetime: new Date(),
        transaction_type: this.get('transaction_type'),
        transaction_status: this.get('transaction_status'),
        transaction_amount: this.get('transaction_amount'),
        userId: this.get('userId'),
        accNo: (this.get('isDirect'))?this.get('accNo'):localStorage.getItem('accNo'),
        branchId: localStorage.getItem('branchId'),
        bankId: localStorage.getItem('bankId')
      };

      
        this.get('transactionsService').createTransaction(transactionData).then(() => {
          console.log('Transaction created successfully!');
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
      transaction_id: '',
      transaction_datetime: '',
      transaction_type: '',
      transaction_status: '',
      transaction_amount: '',
      accNo: '',
      isEdit: false
    });
  }

});
