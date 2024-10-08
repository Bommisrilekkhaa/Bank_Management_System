import Ember from 'ember';

export default Ember.Component.extend({
  banksService: Ember.inject.service('banks'),
  accountsService: Ember.inject.service('accounts'),
  username: '',
  password: '',
  selectedRole: '',
  name: '',
  dob: '',
  addr: '',
  pno: '',
  confirmPassword: '',
  errorMessage: '',
  bank_name:'',
  BankNames:[],
  isSignup: false,
  BankId:'',
  init() {
    this._super(...arguments);
    this.loadBanks();
  }, 

  loadBanks() {
    this.get('banksService').fetchBanks().then((response) => {
      this.set('bankNames', response);
    }).catch((error) => {
      console.error("Failed to load banks:", error);
    });
  },

  setBankId()
  {
    let array=this.get('bankNames');
    for (let i = 0; i < array.length; i++) {
      let item = array[i];
      if(item['bank_name']==this.get('bank_name'))
      {
        this.BankId = item['bank_id'];
        break;
      }
    }
    
    
    
  },
  checkStorage()
  {
    if(localStorage.length!=0)
    {
      localStorage.clear();
    }

    localStorage.setItem('bankId', this.get('BankId'));
   
  },
  actions: {
    submitForm() {
      const username = this.get('username');
      const password = this.get('password');
      const selectedRole = this.get('selectedRole');
      
      if (!username || !password) {
        this.set('errorMessage', 'Username and password are required.');
        return;
      }
      
      if (password.length < 8) {
          this.set('errorMessage', 'Password must be at least 8 characters long.');
          return;
        }
        
        if (this.get('isSignup')) {
          const confirmPassword = this.get('confirmPassword');
          if (password !== confirmPassword) {
            this.set('errorMessage', 'Passwords do not match.');
            return;
          }
          
          if (!this.get('name') || !this.get('dob') || !this.get('addr') || !this.get('pno') || !selectedRole) {
            this.set('errorMessage', 'All fields are required for signup.');
            return;
          }
          
          if (this.get('pno').length !== 10 || isNaN(this.get('pno'))) {
            this.set('errorMessage', 'Please enter a valid 10-digit phone number.');
            return;
          }
        }
        
        this.set('errorMessage', ''); 
        
        const action = this.get('isSignup') ? 'onSignup' : 'onLogin';

        // console.log('Submit button pressed'+action);  
        
        const credentials={ 
          username: this.get('username'), 
          password: this.get('password'), 
          selectedRole: this.get('selectedRole'), 
          name: this.get('name'), 
          dob: this.get('dob'), 
        addr: this.get('addr'), 
        pno: this.get('pno')
      }

      this.setBankId();
      this.checkStorage();
        this.sendAction(action,credentials );
      },
      
      toggleMode() {
        const action = this.get('isSignup') ? 'toLogin' : 'toSignup';
        if(action == 'toLogin')
          this.set('isSignup',false);
        else
        this.set('isSignup',true);

      this.sendAction(action);
    }
    
  }
});
