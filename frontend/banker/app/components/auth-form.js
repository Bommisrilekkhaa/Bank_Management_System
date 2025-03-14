import Ember from 'ember';
import {methods,role} from '../utils/util';
export default Ember.Component.extend({
  fetchService: Ember.inject.service('fetch'),
  sharedData:Ember.inject.service('shared-data'),
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
  isPasswordVisible: false,

  passwordFieldType: Ember.computed('isPasswordVisible', function () {
    return this.get('isPasswordVisible') ? 'text' : 'password';
  }),
  init() {
    this._super(...arguments);
    this.loadBanks();
  },

  loadBanks() {
    let  url= `http://localhost:8080/banker/api/v1/banks`;
    // console.log(url);
    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      this.set('bankNames', response.data);
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
    this.get('sharedData').set('bankId', this.get('BankId'));
  },

  actions: {
    togglePassword() {
      this.toggleProperty('isPasswordVisible');
    },
    submitForm() {

      if( this.get('nameError')||this.get('dobError')||this.get('pnoError')||this.get('addrError')||this.get('usernameError')||this.get('passwordError')||this.get('confirmPasswordError')||
       this.get('roleError')||this.get('bankNameError')){
        return;
        }

      if (!this.get('username') || !this.get('password') || !this.get('bank_name')) {
          this.set('errorMessage', 'All fields are required.');
          return;
        }

      const password = this.get('password');
      const selectedRole = this.get('selectedRole');


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
      var dob = this.get('dob');
      var date = dob ? new Date(dob) : null;
      var formattedDate = date && !isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : 'Invalid Date';
      
      const credentials = {
        username: this.get('username'),
        password: this.get('password'),
        user_role: (this.get('selectedRole')==role.ADMIN)?0:((this.get('selectedRole')==role.MANAGER?1:2)),
        full_name: this.get('name'),
        date_of_birth: formattedDate,
        user_address: this.get('addr'),
        user_phonenumber: this.get('pno'),
        bank_id: this.get('BankId')
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
      let name = this.get('name') || '';

      let isValid = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/.test(name);
      
      if (!name.trim()) {
        this.set('nameError', 'Name is required.');
      } 
      else if (!isValid) {
        this.set('nameError', 'Name can only contain letters and numbers.');
      }
      else {
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
      let phoneStr = pno.toString();

      if (!pno || pno.length !== 10 || isNaN(pno)) {
          this.set('pnoError', 'Please enter a valid 10-digit phone number.');
        }  else if (!/^[1-9][0-9]{9}$/.test(phoneStr)) {
          this.set('pnoError', 'Phone number must be exactly 10 digits and cannot start with 0.');
        }else {
          this.set('pnoError', '');
        }
    },

    validateAddr() {
      let addr = this.get('addr') || '';

      let isValid = /^[a-zA-Z0-9.,-]+( [a-zA-Z0-9.,-]+)*$/.test(addr);

      if (!addr.trim()) {
        this.set('addrError', 'Address is required.');
      } else if (!isValid) {
        this.set('addrError', 'Address can only contain letters, numbers, ".", ",", "-", and single spaces.');
      } else {
        this.set('addrError', '');
      }
    },

    validateUsername() {
      let username = this.get('username') || '';
      
        let isValid = /^[a-zA-Z][a-zA-Z0-9._-]*$/.test(username) && !/[\._-]{2,}/.test(username);
      
        if (!username.trim()) {
          this.set('usernameError', 'Username is required.');
        } else if (!isValid) {
          this.set('usernameError', 'Username must start with a letter and contain only letters, numbers, ".", "_", or "-". No consecutive special characters allowed.');
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
