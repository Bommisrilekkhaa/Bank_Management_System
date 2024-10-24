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
  bank_name: '',
  bankNames: [],
  isSignup: false,
  BankId: '',
  nameError: '',
  dobError: '',
  pnoError: '',
  addrError: '',
  usernameError: '',
  passwordError: '',
  confirmPasswordError: '',
  roleError: '',
  bankNameError: '',
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

  setBankId() {
    let array = this.get('bankNames');
    for (let i = 0; i < array.length; i++) {
      let item = array[i];
      if (item['bank_name'] === this.get('bank_name')) {
        this.set('BankId', item['bank_id']);
        break;
      }
    }
  },

  checkStorage() {
    if (localStorage.length !== 0) {
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

      if (!this.get('isSuper') && !this.get('isSignup') && !this.get('bank_name')) {
        this.set('errorMessage', 'Please select a bank');
        return;
      }

      if (password.length < 8) {
        this.set('errorMessage', 'Password must be at least 8 characters.');
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

      this.setBankId();
      this.checkStorage();
      
      const credentials = {
        username: this.get('username'),
        password: this.get('password'),
        selectedRole: this.get('selectedRole'),
        name: this.get('name'),
        dob: this.get('dob'),
        addr: this.get('addr'),
        pno: this.get('pno'),
        bankId: this.get('BankId')
      };

      this.sendAction(action, credentials);
      this.resetForm();
    },

    toggleMode() {
      this.toggleProperty('isSignup');
      this.sendAction(this.get('isSignup') ? 'toSignup' : 'toLogin');
    },

    superAdminForm() {
      if (!this.get('username') || !this.get('password')) {
        this.set('errorMessage', 'All fields are required.');
        return;
      }
      const credentials = {
        username: this.get('username'),
        password: this.get('password')
      };
      this.sendAction("toSuperAdmin", credentials);
    },

    validateName() {
      if (!this.get('name')) {
        this.set('nameError', 'Name is required.');
      } else {
        this.set('nameError', '');
      }
    },

    validateDob() {
      if (!this.get('dob')) {
        this.set('dobError', 'Date of birth is required.');
      } else {
        this.set('dobError', '');
      }
    },

    validatePno() {
      const pno = this.get('pno');
      if (!pno || pno.length !== 10 || isNaN(pno)) {
        this.set('pnoError', 'Please enter a valid 10-digit phone number.');
      } else {
        this.set('pnoError', '');
      }
    },

    validateAddr() {
      if (!this.get('addr')) {
        this.set('addrError', 'Address is required.');
      } else {
        this.set('addrError', '');
      }
    },

    validateUsername() {
      if (!this.get('username')) {
        this.set('usernameError', 'Username is required.');
      } else {
        this.set('usernameError', '');
      }
    },

    validatePassword() {
      const password = this.get('password');
      if (!password || password.length < 8) {
        this.set('passwordError', 'Password must be at least 8 characters.');
      } else {
        this.set('passwordError', '');
      }
    },
    validatePass() {
      const password = this.get('password');
      if (!password || password.length < 8) {
        this.set('passwordError', 'Invalid password');
      } else {
        this.set('passwordError', '');
      }
    },

    validateConfirmPassword() {
      if (!this.get('confirmPassword'))
      {
        this.set('confirmPasswordError', 'Confirm Password is required.');
      }
      else if (this.get('password') !== this.get('confirmPassword')) {
        this.set('confirmPasswordError', 'Passwords do not match.');
      } else {
        this.set('confirmPasswordError', '');
      }
    },

    validateRole() {
      if (!this.get('selectedRole')) {
        this.set('roleError', 'Please select a role.');
      } else {
        this.set('roleError', '');
      }
    },

    validateBankName() {
      if (!this.get('bank_name')) {
        this.set('bankNameError', 'Please select a bank.');
      } else {
        this.set('bankNameError', '');
      }
    }
  },
  resetForm() {
    this.setProperties({
      username: '',
      password: '',
      confirmPassword: '',
      selectedRole: '',
      name: '',
      dob: '',
      addr: '',
      pno: '',
      bank_name: '',
      BankId: '',
      nameError: '',
      dobError: '',
      pnoError: '',
      addrError: '',
      usernameError: '',
      passwordError: '',
      confirmPasswordError: '',
      roleError: '',
      bankNameError: '',
      errorMessage: ''
    });
  }
  
});
