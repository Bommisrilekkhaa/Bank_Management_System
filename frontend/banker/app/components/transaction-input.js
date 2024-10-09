import Ember from 'ember';

export default Ember.Component.extend({
  accountsService: Ember.inject.service('accounts'),
  transactionsService: Ember.inject.service('transactions'),
  errorMessage: '',
  statuses: ['pending','success'],
  types: ['debit','credit'],
  isDirect:false,
  accounts:[],
  bankId:localStorage.getItem('bankId'),
  init() {
    this._super(...arguments);
    console.log("Transaction form initialized...");
    if(this.get('isDirect'))
    {
      this.loadAccounts();

    }
  }, 

  loadAccounts() {
    this.get('accountsService').fetchAccounts(this.get('bankId')).then((response) => {
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
      if (!this.get('types').includes(this.get('transaction_type'))) {
        this.set("errorMessage", 'Please select a valid transaction type.');
        return;
      }

      

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
          this.sendAction("toTransaction");
        }).catch((error) => {
          console.error('Error creating transaction:', error);
        });
      
    },

    cancel() {
      this.resetForm();
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
