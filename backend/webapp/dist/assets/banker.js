"use strict";



define('banker/app', ['exports', 'banker/resolver', 'ember-load-initializers', 'banker/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('banker/components/account-input', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    notification: Ember.inject.service('notify'),
    branchesService: Ember.inject.service('branches'),
    accountsService: Ember.inject.service('accounts'),
    errorMessage: '',
    branchNames: [],
    userRole: _util.role,
    statuses: [_util.status.ACTIVE, _util.status.INACTIVE, _util.status.PENDING],
    types: [_util.accountType.BUSINESS, _util.accountType.SAVINGS],
    role: Ember.computed(function () {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + 'sessionData' + '=');
      if (parts.length === 2) {
        var cookieData = decodeURIComponent(parts.pop().split(';').shift());
        var sessionData = JSON.parse(cookieData);
        return sessionData.user_role;
      }
    }),

    init: function init() {
      this._super.apply(this, arguments);
      console.log("init...");
      this.loadBranches();
    },

    userId: Ember.computed(function () {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + 'sessionData' + '=');
      if (parts.length === 2) {
        var cookieData = decodeURIComponent(parts.pop().split(';').shift());
        var sessionData = JSON.parse(cookieData);
        return sessionData.user_id;
      }
    }),

    accNo: '',
    acc_type: '',
    acc_balance: '',
    acc_status: '',
    username: '',
    fullname: '',
    branch_name: '',
    bankId: localStorage.getItem("bankId"),
    isEdit: false,
    branchId: '',
    loadBranches: function loadBranches() {
      var _this = this;

      // console.log(this.get('bankId'));
      this.get('branchesService').fetchBranches(this.get('bankId')).then(function (response) {
        _this.set('branchNames', response);
      }).catch(function (error) {
        console.error("Failed to load branches:", error);
      });
    },


    actions: {
      submitForm: function submitForm() {
        var _this2 = this;

        if (!this.get('types').includes(this.get('acc_type'))) {
          this.set("errorMessage", 'Please select a valid account type.');
          return;
        }

        if (!this.get('branch_name') || this.get('branch_name').trim() === '') {
          this.set("errorMessage", 'Please select a branch.');
          return;
        }
        var array = this.get('branchNames');
        for (var i = 0; i < array.length; i++) {
          var item = array[i];
          if (item['branch_name'] == this.get('branch_name')) {
            this.branchId = item['branch_id'];
          }
        }

        if (this.get('role') != 'MANAGER') {

          localStorage.setItem('branchId', this.get('branchId'));
        }
        var userData = {
          fullname: this.get('fullname'),
          userId: this.get('userId')
        };
        var accountData = {
          accNo: this.get('accNo'),
          acc_type: this.get('acc_type'),
          // acc_balance: this.get('acc_balance'),
          username: this.get('username'),
          acc_status: this.get('acc_status'),
          fullname: this.get('fullname'),
          bankId: this.get('bankId')
        };

        if (this.get('isEdit')) {

          this.get('accountsService').updateAccount(accountData).then(function () {
            // alert('Account updated successfully!');

            _this2.resetForm();
            _this2.get('notification').showNotification('Account Edited successfully!', 'success');

            Ember.run.later(function () {
              _this2.sendAction("toAccount");
            }, 2000);
          }).catch(function (error) {
            alert('Error updating account');
            console.error(error);
          });
        } else {

          this.get('accountsService').createAccount(accountData).then(function () {

            // alert('Account created successfully!');
            _this2.resetForm();

            _this2.get('notification').showNotification('Account Created successfully!', 'success');

            Ember.run.later(function () {
              _this2.sendAction("toAccount");
            }, 2000);
          }).catch(function (error) {
            // alert('Error creating account');
            console.error(error);
          });
        }
      },
      cancel: function cancel() {
        this.resetForm();
        // this.transitionToRoute('accounts'); 
      }
    },

    resetForm: function resetForm() {
      this.setProperties({
        accNo: '',
        acc_type: '',
        // acc_balance: '',
        fullname: '',
        acc_status: '',
        username: '',
        branch_name: '',
        isEdit: false
      });
    }
  });
});
define('banker/components/admin-dashboard', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({});
});
define('banker/components/auth-form', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
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
    init: function init() {
      this._super.apply(this, arguments);
      this.loadBanks();
    },
    loadBanks: function loadBanks() {
      var _this = this;

      this.get('banksService').fetchBanks().then(function (response) {
        _this.set('bankNames', response);
      }).catch(function (error) {
        console.error("Failed to load banks:", error);
      });
    },
    setBankId: function setBankId() {
      var array = this.get('bankNames');
      for (var i = 0; i < array.length; i++) {
        var item = array[i];
        if (item['bank_name'] === this.get('bank_name')) {
          this.set('BankId', item['bank_id']);
          break;
        }
      }
    },
    checkStorage: function checkStorage() {
      if (localStorage.length !== 0) {
        localStorage.clear();
      }
      localStorage.setItem('bankId', this.get('BankId'));
    },


    actions: {
      submitForm: function submitForm() {
        var username = this.get('username');
        var password = this.get('password');
        var selectedRole = this.get('selectedRole');

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
          var confirmPassword = this.get('confirmPassword');
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

        var action = this.get('isSignup') ? 'onSignup' : 'onLogin';

        this.setBankId();
        this.checkStorage();

        var credentials = {
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
      toggleMode: function toggleMode() {
        this.toggleProperty('isSignup');
        this.sendAction(this.get('isSignup') ? 'toSignup' : 'toLogin');
      },
      superAdminForm: function superAdminForm() {
        if (!this.get('username') || !this.get('password')) {
          this.set('errorMessage', 'All fields are required.');
          return;
        }
        var credentials = {
          username: this.get('username'),
          password: this.get('password')
        };
        this.sendAction("toSuperAdmin", credentials);
      },
      validateName: function validateName() {
        if (!this.get('name')) {
          this.set('nameError', 'Name is required.');
        } else {
          this.set('nameError', '');
        }
      },
      validateDob: function validateDob() {
        if (!this.get('dob')) {
          this.set('dobError', 'Date of birth is required.');
        } else {
          this.set('dobError', '');
        }
      },
      validatePno: function validatePno() {
        var pno = this.get('pno');
        if (!pno || pno.length !== 10 || isNaN(pno)) {
          this.set('pnoError', 'Please enter a valid 10-digit phone number.');
        } else {
          this.set('pnoError', '');
        }
      },
      validateAddr: function validateAddr() {
        if (!this.get('addr')) {
          this.set('addrError', 'Address is required.');
        } else {
          this.set('addrError', '');
        }
      },
      validateUsername: function validateUsername() {
        if (!this.get('username')) {
          this.set('usernameError', 'Username is required.');
        } else {
          this.set('usernameError', '');
        }
      },
      validatePassword: function validatePassword() {
        var password = this.get('password');
        if (!password || password.length < 8) {
          this.set('passwordError', 'Password must be at least 8 characters.');
        } else {
          this.set('passwordError', '');
        }
      },
      validatePass: function validatePass() {
        var password = this.get('password');
        if (!password || password.length < 8) {
          this.set('passwordError', 'Invalid password');
        } else {
          this.set('passwordError', '');
        }
      },
      validateConfirmPassword: function validateConfirmPassword() {
        if (!this.get('confirmPassword')) {
          this.set('confirmPasswordError', 'Confirm Password is required.');
        } else if (this.get('password') !== this.get('confirmPassword')) {
          this.set('confirmPasswordError', 'Passwords do not match.');
        } else {
          this.set('confirmPasswordError', '');
        }
      },
      validateRole: function validateRole() {
        if (!this.get('selectedRole')) {
          this.set('roleError', 'Please select a role.');
        } else {
          this.set('roleError', '');
        }
      },
      validateBankName: function validateBankName() {
        if (!this.get('bank_name')) {
          this.set('bankNameError', 'Please select a bank.');
        } else {
          this.set('bankNameError', '');
        }
      }
    },
    resetForm: function resetForm() {
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
});
define('banker/components/branch-input', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    notification: Ember.inject.service('notify'),
    usersService: Ember.inject.service('users'),
    branchesService: Ember.inject.service('branches'),
    errorMessage: '',
    branchId: '',
    name: '',
    address: '',
    branch_number: '',
    bankId: localStorage.getItem("bankId"),
    manager_id: '',
    isEdit: false,
    availableManagers: [],
    init: function init() {
      this._super.apply(this, arguments);
      console.log("init...");
      this.loadManagers();
    },
    loadManagers: function loadManagers() {
      var _this = this;

      // console.log(this.get('bankId'));
      this.get('usersService').fetchManagers().then(function (response) {
        _this.set('availableManagers', response);
      }).catch(function (error) {
        console.error("Failed to load managers:", error);
      });
    },


    actions: {
      submitForm: function submitForm() {
        var _this2 = this;

        if (!this.get('name') || this.get('name').trim() === '') {
          this.set("errorMessage", 'Branch name cannot be empty.');
          return;
        }

        if (!this.get('address') || this.get('address').trim() === '') {
          this.set("errorMessage", 'Branch address cannot be empty.');
          return;
        }

        if (!this.get('manager_id') || this.get('manager_id') <= 0) {
          this.set("errorMessage", 'Invalid Manager ID .');
          return;
        }

        var branchData = {
          name: this.get('name'),
          address: this.get('address'),
          manager_id: this.get('manager_id'),
          bankId: this.get('bankId'),
          branchId: this.get('branchId')
        };

        if (this.get('isEdit')) {
          this.get('branchesService').updateBranch(branchData).then(function () {

            console.log('Branch updated successfully!');
            _this2.resetForm();
            _this2.get('notification').showNotification('Branch Edited successfully!', 'success');

            Ember.run.later(function () {
              _this2.sendAction("toBranch");
            }, 2000);
          }).catch(function (error) {
            console.error('Error updating branch:', error);
          });
        } else {
          this.get('branchesService').createBranch(branchData).then(function () {
            console.log('Branch created successfully!');
            _this2.resetForm();
            _this2.get('notification').showNotification('Branch Created successfully!', 'success');

            Ember.run.later(function () {
              _this2.sendAction("toBranch");
            }, 2000);
          }).catch(function (error) {
            console.error('Error creating branch:', error);
          });
        }
      },
      cancel: function cancel() {
        this.resetForm();
        this.sendAction("toBranch");
      }
    },

    resetForm: function resetForm() {
      this.setProperties({
        name: '',
        address: '',
        manager_id: '',
        isEdit: false
      });
    }
  });
});
define('banker/components/customer-dashboard', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        calculateEMI: function calculateEMI(loanAmount, interestRate, tenureMonths, loanAvailedDate) {
            var monthlyInterestRate = interestRate / 12 / 100;
            var emiAmount = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths) / (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
            emiAmount = Math.round(emiAmount);
            var emiSchedule = [];
            var currentPaymentDate = new Date(loanAvailedDate);

            for (var i = 1; i <= tenureMonths; i++) {
                currentPaymentDate.setMonth(currentPaymentDate.getMonth() + 1);
                emiSchedule.push({
                    emiNumber: i,
                    toBePaidDate: new Date(currentPaymentDate),
                    actualPaidDate: null,
                    emiAmount: emiAmount
                });
            }

            return emiSchedule;
        },

        actions: {
            showEmiModal: function showEmiModal(loanId) {
                var account = this.get('accountList').find(function (accountItem) {
                    return accountItem.loan_details && accountItem.loan_details.loan_id === loanId;
                });

                if (account && account.loan_details) {
                    var loanDetails = account.loan_details;
                    var loanAmount = loanDetails.loan_amount;
                    var interestRate = loanDetails.loan_interest;
                    var tenureMonths = loanDetails.loan_duration;
                    var loanAvailedDate = loanDetails.loan_availed_date;

                    var emiSchedule = this.calculateEMI(loanAmount, interestRate, tenureMonths, loanAvailedDate);
                    this.set('emiSchedule', emiSchedule);
                    this.set('selectedLoanId', loanId);
                    this.set('emi', emiSchedule[0]);
                    document.getElementById('emiModal').style.display = 'flex';
                } else {
                    console.error("Loan details not found for the selected loan ID");
                }
            },
            closeEmiModal: function closeEmiModal() {
                document.getElementById('emiModal').style.display = 'none';
            }
        }

    });
});
define('banker/components/ember-notify', ['exports', 'ember-notify/components/ember-notify'], function (exports, _emberNotify) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberNotify.default;
});
define('banker/components/ember-notify/message', ['exports', 'ember-notify/components/ember-notify/message'], function (exports, _message) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _message.default;
});
define('banker/components/loan-input', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    notification: Ember.inject.service('notify'),
    accountsService: Ember.inject.service('accounts'),
    loansService: Ember.inject.service('loans'),
    errorMessage: '',
    accounts: [],
    loan_id: '',
    loan_type: '',
    loan_amount: '',
    loan_interest: '',
    loan_duration: '',
    loan_status: '',
    loan_availed_date: '',
    isEdit: false,
    isDirect: false,
    accNo: '',
    bankId: localStorage.getItem("bankId"),
    userRole: _util.role,
    statuses: [_util.loanStatus.PENDING, _util.loanStatus.APPROVED, _util.loanStatus.CLOSED, _util.loanStatus.REJECTED],
    types: [_util.loanType.BUSINESSLOAN, _util.loanType.EDUCATIONLOAN, _util.loanType.HOMELOAN],
    durations: [6, 12, 18, 24],
    init: function init() {
      this._super.apply(this, arguments);
      console.log("Loan form initialized...");
      if (this.get('isDirect')) {
        this.loadAccounts();
      }
    },

    role: Ember.computed(function () {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + 'sessionData' + '=');
      if (parts.length === 2) {
        var cookieData = decodeURIComponent(parts.pop().split(';').shift());
        var sessionData = JSON.parse(cookieData);
        return sessionData.user_role;
      }
    }),

    filteredStatuses: Ember.computed('loan_amount', function () {
      if (this.get('loan_amount') > 3000000) {
        return [_util.loanStatus.REJECTED];
      } else {
        return [_util.loanStatus.PENDING, _util.loanStatus.APPROVED, _util.loanStatus.CLOSED, _util.loanStatus.REJECTED];
      }
    }),

    userId: Ember.computed(function () {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + 'sessionData' + '=');
      if (parts.length === 2) {
        var cookieData = decodeURIComponent(parts.pop().split(';').shift());
        var sessionData = JSON.parse(cookieData);
        return sessionData.user_id;
      }
    }),

    loadAccounts: function loadAccounts() {
      var _this = this;

      this.get('accountsService').fetchActiveAccounts(this.get('bankId')).then(function (response) {
        console.log(response);
        _this.set('accounts', response);
      }).catch(function (error) {
        console.error("Failed to load accounts:", error);
      });
    },

    actions: {
      submitForm: function submitForm() {
        var _this2 = this;

        if (!this.get('types').includes(this.get('loan_type'))) {
          this.set("errorMessage", 'Please select a valid loan type.');
          return;
        }

        if (this.get('role') != this.userRole.CUSTOMER) {
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

        var loanData = {
          loan_id: this.get('loan_id'),
          loan_type: this.get('loan_type'),
          loan_amount: this.get('loan_amount'),
          loan_duration: this.get('loan_duration'),
          loan_status: this.get('loan_status'),
          userId: this.get('userId'),
          branchId: localStorage.getItem('branchId'),
          bankId: this.get('bankId'),
          accNo: this.get('isDirect') ? this.get('accNo') : localStorage.getItem('accNo')
        };

        if (this.get('isEdit')) {
          this.get('loansService').updateLoan(loanData).then(function () {
            console.log('Loan updated successfully!');
            _this2.resetForm();
            _this2.get('notification').showNotification('Loan Edited successfully!', 'success');

            Ember.run.later(function () {
              _this2.sendAction("toLoan");
            }, 2000);
          }).catch(function (error) {
            console.error('Error updating loan:', error);
          });
        } else {
          this.get('loansService').createLoan(loanData).then(function () {
            console.log('Loan created successfully!');
            _this2.resetForm();
            _this2.get('notification').showNotification('Loan Created successfully!', 'success');

            Ember.run.later(function () {
              _this2.sendAction("toLoan");
            }, 2000);
          }).catch(function (error) {
            _this2.resetForm();
            _this2.sendAction("toLoan");
            console.error('Error creating loan:', error);
          });
        }
      },
      cancel: function cancel() {
        this.resetForm();
        this.sendAction('toLoan');
      }
    },

    resetForm: function resetForm() {
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
});
define('banker/components/manager-dashboard', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({});
});
define('banker/components/nav-bar', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    branchSelection: Ember.inject.service('branch-select'),
    branchesService: Ember.inject.service('branches'),
    session: Ember.inject.service(),
    bankId: localStorage.getItem('bankId'),
    branches: [],
    userRole: _util.role,
    role: Ember.computed(function () {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + 'sessionData' + '=');
      if (parts.length === 2) {
        var cookieData = decodeURIComponent(parts.pop().split(';').shift());
        var sessionData = JSON.parse(cookieData);
        return sessionData.user_role;
      }
    }),
    init: function init() {
      this._super.apply(this, arguments);
      if (this.get('role') == _util.role.ADMIN || this.get('role') == _util.role.CUSTOMER) {
        this.loadBranches();
      }
      if (localStorage.getItem('branchId') == null) {
        localStorage.setItem('branchId', '*');
      }
      if (localStorage.getItem('accNo') == null) {
        localStorage.setItem('accNo', '*');
      }
      if (localStorage.getItem('loanId') == null) {
        localStorage.setItem('loanId', '*');
      }
    },
    loadBranches: function loadBranches() {
      var _this = this;

      console.log(this.get('bankId'));
      this.get('branchesService').fetchBranches(this.get('bankId')).then(function (response) {
        console.log(response);
        _this.set('branches', response);
      }).catch(function (error) {
        console.error("Failed to load branches:", error);
      });
    },
    changeBranch: function changeBranch(branchId) {

      this.get('branchSelection').changeBranch(branchId);
    },

    actions: {
      logout: function logout() {
        localStorage.clear();
        this.get('logout')();
      },
      toUsers: function toUsers() {
        this.get('toUsers')();
      },
      toBranch: function toBranch() {
        this.get('toBranch')();
      },
      todashboard: function todashboard() {
        this.set('branch_name', 'all');
        this.get('todashboard')();
      },
      toBanks: function toBanks() {
        this.get('toBanks')();
      },
      toBank: function toBank() {
        this.get('toBank')();
      },
      toBranches: function toBranches() {
        this.get('toBranches')();
      },
      toAccounts: function toAccounts() {
        this.get('toAccounts')();
      },
      toTransactions: function toTransactions() {
        this.get('toTransactions')();
      },
      toLoans: function toLoans() {
        this.get('toLoans')();
      },
      setbranch: function setbranch(branch_name) {
        var array = this.get('branches');

        if (!Array.isArray(array)) {
          console.error('branches is not defined or not an array');
          return;
        }
        if (branch_name == 'all') {
          localStorage.setItem('branchId', '*');
          this.get('branchesService').set('branchId', '*');
          this.changeBranch("*");
        } else {
          var selectedBranch = array.find(function (item) {
            return item.branch_name === branch_name;
          });

          if (selectedBranch) {
            localStorage.setItem('branchId', selectedBranch.branch_id);
            this.get('branchesService').set('branchId', selectedBranch.branch_id);
            this.changeBranch(selectedBranch.branch_id);
            // console.log('Branch ID set to:', selectedBranch.branch_id);
          } else {
            console.warn('Branch not found');
          }
        }
      }
    }
  });
});
define('banker/components/notify-box', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    message: '',
    type: '',

    classNameBindings: ['type', 'notification-top-right']

  });
});
define('banker/components/transaction-input', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    notification: Ember.inject.service('notify'),
    accountsService: Ember.inject.service('accounts'),
    transactionsService: Ember.inject.service('transactions'),
    errorMessage: '',
    statuses: [_util.transactionStatus.PENDING, _util.transactionStatus.SUCCESS],
    types: [_util.transactionType.CREDIT, _util.transactionType.DEBIT],
    isDirect: false,
    accounts: [],
    bankId: localStorage.getItem('bankId'),
    isEmi: Ember.computed('transaction_type', function () {
      return this.get('transaction_type') == _util.transactionType.EMI;
    }),
    init: function init() {
      this._super.apply(this, arguments);
      console.log("Transaction form initialized...");
      if (this.get('isDirect')) {
        this.loadAccounts();
      }
    },

    role: Ember.computed(function () {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + 'sessionData' + '=');
      if (parts.length === 2) {
        var cookieData = decodeURIComponent(parts.pop().split(';').shift());
        var sessionData = JSON.parse(cookieData);
        return sessionData.user_role;
      }
    }),

    loadAccounts: function loadAccounts() {
      var _this = this;

      this.get('accountsService').fetchActiveAccounts(this.get('bankId')).then(function (response) {
        console.log(response);
        _this.set('accounts', response);
      }).catch(function (error) {
        console.error("Failed to load accounts:", error);
      });
    },


    userId: Ember.computed(function () {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + 'sessionData' + '=');
      if (parts.length === 2) {
        var cookieData = decodeURIComponent(parts.pop().split(';').shift());
        var sessionData = JSON.parse(cookieData);
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
      submitForm: function submitForm() {
        var _this2 = this;

        if (!this.get('transaction_amount') || this.get('transaction_amount') <= 0) {
          this.set("errorMessage", 'Transaction amount must be a positive number.');
          return;
        }

        var transactionData = {
          transaction_id: this.get('transaction_id'),
          transaction_datetime: new Date(),
          transaction_type: this.get('transaction_type'),
          transaction_status: this.get('transaction_status'),
          transaction_amount: this.get('transaction_amount'),
          userId: this.get('userId'),
          accNo: this.get('isDirect') ? this.get('accNo') : localStorage.getItem('accNo'),
          branchId: localStorage.getItem('branchId'),
          bankId: localStorage.getItem('bankId')
        };

        this.get('transactionsService').createTransaction(transactionData).then(function () {
          console.log('Transaction created successfully!');
          _this2.resetForm();
          _this2.get('notification').showNotification('Transaction Created successfully!', 'success');

          Ember.run.later(function () {
            _this2.sendAction("toTransaction");
          }, 2000);
        }).catch(function (error) {
          console.error('Error creating transaction:', error);
          _this2.resetForm();
          _this2.sendAction("toTransaction");
        });
      },
      cancel: function cancel() {
        this.resetForm();
        this.sendAction('toTransaction');
      }
    },

    resetForm: function resetForm() {
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
});
define('banker/components/view-account', ['exports', 'banker/utils/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        accNo: localStorage.getItem("accNo"),
        status: _util.status,
        actions: {
            loans: function loans() {
                this.sendAction("toLoans", this.accNo);
            },
            transactions: function transactions() {
                this.sendAction("toTransactions", this.accNo);
            }
        }

    });
});
define('banker/components/view-accounts', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    accountssService: Ember.inject.service('accounts'),
    accounts: [],
    branchId: localStorage.getItem('branchId'),
    userRole: _util.role,
    role: Ember.computed(function () {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + 'sessionData' + '=');
      if (parts.length === 2) {
        var cookieData = decodeURIComponent(parts.pop().split(';').shift());
        var sessionData = JSON.parse(cookieData);
        return sessionData.user_role;
      }
    }),

    filteredAccounts: Ember.computed('accounts', 'selectedAccountType', 'selectedAccountStatus', function () {
      var accounts = this.get('accounts');
      var selectedAccountType = this.get('selectedAccountType');
      var selectedAccountStatus = this.get('selectedAccountStatus');

      if (selectedAccountType) {
        accounts = accounts.filter(function (account) {
          return account.acc_type === selectedAccountType;
        });
      }

      if (selectedAccountStatus) {
        accounts = accounts.filter(function (account) {
          return account.acc_status === selectedAccountStatus;
        });
      }

      return accounts;
    }),

    actions: {
      viewAccount: function viewAccount(account) {
        this.sendAction('viewaccount', account);
      },
      addNewAccount: function addNewAccount() {
        this.sendAction('toaddNewAccount');
      },
      editAccount: function editAccount(account) {
        this.sendAction('toeditAccount', true, account, account.branch_id);
      }
    }
  });
});
define('banker/components/view-loan', ['exports', 'banker/utils/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        status: _util.loanStatus,
        actions: {
            toEmis: function toEmis(loan) {
                var InterestRate = loan.loan_interest / 12 / 100;
                var emiAmount = loan.loan_amount * InterestRate * Math.pow(1 + InterestRate, loan.loan_duration) / (Math.pow(1 + InterestRate, loan.loan_duration) - 1);
                emiAmount = Math.round(emiAmount);
                this.sendAction("toEmis", loan, emiAmount);
            }
        }
    });
});
define('banker/components/view-loans', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    loansService: Ember.inject.service('loans'),
    loans: [],
    branchId: localStorage.getItem('branchId'),
    userRole: _util.role,
    role: Ember.computed(function () {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + 'sessionData' + '=');
      if (parts.length === 2) {
        var cookieData = decodeURIComponent(parts.pop().split(';').shift());
        var sessionData = JSON.parse(cookieData);
        return sessionData.user_role;
      }
    }),

    selectedLoanType: '',
    selectedLoanStatus: '',

    filteredLoans: Ember.computed('loans', 'selectedLoanType', 'selectedLoanStatus', function () {
      var loans = this.get('loans');
      var selectedLoanType = this.get('selectedLoanType');
      var selectedLoanStatus = this.get('selectedLoanStatus');

      if (selectedLoanType) {
        loans = loans.filter(function (loan) {
          return loan.loan_type === selectedLoanType;
        });
      }

      if (selectedLoanStatus) {
        loans = loans.filter(function (loan) {
          return loan.loan_status === selectedLoanStatus;
        });
      }

      return loans;
    }),

    actions: {
      viewLoan: function viewLoan(loan) {
        this.sendAction('viewLoan', loan, this.get('branchId'));
      },
      addNewLoan: function addNewLoan() {
        this.sendAction('toaddNewLoan', this.get('branchId'));
      },
      editLoan: function editLoan(loan) {
        this.sendAction('toeditLoan', true, loan, this.get('branchId'));
      }
    }
  });
});
define('banker/components/view-transaction', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({});
});
define('banker/components/view-transactions', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    transactionsService: Ember.inject.service('transactions'),
    transactions: [],
    branchId: localStorage.getItem('branchId'),
    userRole: _util.role,
    role: Ember.computed(function () {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + 'sessionData' + '=');
      if (parts.length === 2) {
        var cookieData = decodeURIComponent(parts.pop().split(';').shift());
        var sessionData = JSON.parse(cookieData);
        return sessionData.user_role;
      }
    }),

    selectedTransactionType: '',
    selectedTransactionStatus: '',

    filteredTransactions: Ember.computed('transactions', 'selectedTransactionType', 'selectedTransactionStatus', function () {
      var transactions = this.get('transactions');
      var selectedTransactionType = this.get('selectedTransactionType');
      var selectedTransactionStatus = this.get('selectedTransactionStatus');

      if (selectedTransactionType) {
        transactions = transactions.filter(function (transaction) {
          return transaction.transaction_type === selectedTransactionType;
        });
      }

      if (selectedTransactionStatus) {
        transactions = transactions.filter(function (transaction) {
          return transaction.transaction_status === selectedTransactionStatus;
        });
      }

      return transactions;
    }),

    actions: {
      viewTransaction: function viewTransaction(transaction) {
        this.sendAction('viewTransaction', transaction, this.get('branchId'));
      },
      addNewTransaction: function addNewTransaction() {
        this.sendAction('toaddNewTransaction', this.get('branchId'));
      }
    }
  });
});
define('banker/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('banker/controllers/application', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    session: Ember.inject.service('session'),
    branchesService: Ember.inject.service('branches'),
    userId: Ember.computed(function () {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + 'sessionData' + '=');
      if (parts.length === 2) {
        var cookieData = decodeURIComponent(parts.pop().split(';').shift());
        var sessionData = JSON.parse(cookieData);
        return sessionData.user_id;
      }
    }),
    isAuthRoute: Ember.computed('currentRouteName', function () {
      var authRoutes = ['login', 'register', 'index', 'super-admin-login'];
      return authRoutes.includes(this.get('currentRouteName'));
    }),
    getBranchId: function getBranchId(userId) {
      var _this = this;

      this.set('bankId', localStorage.getItem('bankId'));
      this.get('branchesService').fetchBranches(this.get('bankId')).then(function (response) {
        _this.set('branchNames', response);
      }).catch(function (error) {
        console.error("Failed to load branches:", error);
      });

      var array = this.get('branchNames');
      for (var i = 0; i < array.length; i++) {
        var item = array[i];
        if (item['manager_id'] == userId) {
          this.set('branch', item);
          this.set('branchId', item['branch_id']);
          break;
        }
      }
    },


    actions: {
      logout: function logout() {
        var _this2 = this;

        this.get('session').logout().then(function () {
          _this2.transitionToRoute('login');
        });
      },
      toUsers: function toUsers() {
        this.transitionToRoute('users');
      },
      toBank: function toBank() {
        this.set('bankId', localStorage.getItem('bankId'));
        this.transitionToRoute('banks.bank', this.get('bankId'));
      },
      toBanks: function toBanks() {
        this.transitionToRoute('banks');
      },
      toBranch: function toBranch() {
        var _this3 = this;

        this.set('bankId', localStorage.getItem('bankId'));
        var bankId = this.get('bankId');
        this.getBranchId(this.get('userId'));
        console.log(this.get('branchId'));
        this.transitionToRoute('banks.bank.branches.branch', bankId, this.get('branchId')).then(function (newRoute) {
          newRoute.controller.setProperties({
            bankId: bankId,
            Branch: _this3.get('branch')
          });
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      },
      toBranches: function toBranches() {
        this.set('bankId', localStorage.getItem('bankId'));
        this.transitionToRoute('banks.bank.branches', this.get('bankId'));
      },
      toAccounts: function toAccounts() {
        this.set('bankId', localStorage.getItem('bankId'));
        this.transitionToRoute('banks.bank.accounts', this.get('bankId'));
      },
      todashboard: function todashboard() {
        this.set('bankId', localStorage.getItem('bankId'));
        // console.log("bankId : "+this.get('bankId'));
        this.transitionToRoute('banks.bank.users.user.dashboard', this.get('bankId'), this.get('userId'));
      },
      toTransactions: function toTransactions() {
        this.set('bankId', localStorage.getItem('bankId'));
        this.transitionToRoute('banks.bank.transactions', this.get('bankId'));
      },
      toLoans: function toLoans() {
        this.set('bankId', localStorage.getItem('bankId'));
        this.transitionToRoute('banks.bank.loans', this.get('bankId'));
      }
    }
  });
});
define('banker/controllers/banks', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define('banker/controllers/banks/bank', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define('banker/controllers/banks/bank/accounts', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    // accountsService: Ember.inject.service('accounts'),
    // bankId: '',
    // init() {
    //   // console.log("controller");
    //   // this._super(...arguments);
    //   // console.log(this.get('model.id'));
    //   // this.loadAccounts();
    // },
    // accounts: [],

    // loadAccounts() {
    //   console.log(this.get('bankId'));
    //   this.get('accountsService').fetchAccounts(this.get('bankId')).then((response) => {
    //     console.log(response);
    //     this.set('accounts', response);
    //   }).catch((error) => {
    //     console.error("Failed to load accounts:", error);
    //   });
    // },

    // actions: {
    //   addNewAccount() {
    //     console.log(this.get('bankId'));
    //     this.transitionToRoute('banks.bank.accounts.new').then((newRoute)=>{

    //       newRoute.controller.setProperties({
    //         bankId:this.get('bankId')
    //       });
    //     }).catch((error) => {
    //       console.error("Transition failed", error);
    //     });

    //   },

    //   editAccount(account) {
    //     this.transitionToRoute('banks.bank.accounts.account.edit',this.get('bankId'),accountId).then((newRoute)=>{

    //       newRoute.controller.setProperties({
    //         isEdit: true,
    //         acc_no: account.acc_no,
    //         acc_type: account.acc_type,
    //         acc_balance: account.acc_balance,
    //         acc_status: account.acc_status,
    //         username:account.username,
    //         fullname: account.user_fullname,
    //         branch_name: account.branch_name,
    //         bankId:this.get('bankId')
    //       });
    //     }).catch((error) => {
    //       console.error("Transition failed", error);
    //     });
    //   }
    // }
  });
});
define('banker/controllers/banks/bank/accounts/account', ['exports'], function (exports) {
   'use strict';

   Object.defineProperty(exports, "__esModule", {
      value: true
   });
   exports.default = Ember.Controller.extend({});
});
define('banker/controllers/banks/bank/accounts/account/edit', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({

        actions: {
            toAccount: function toAccount() {
                this.transitionToRoute("banks.bank.accounts", this.get('bankId'));
            }
        }
    });
});
define('banker/controllers/banks/bank/accounts/account/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    acc: [],
    accountsService: Ember.inject.service('accounts'),
    loadAccount: function loadAccount() {
      var _this = this;

      this.get('accountsService').fetchAccount(this.get('bankId')).then(function (response) {
        console.log(response);
        _this.set('acc', response);
        _this.set('acc', _this.get('acc')[0]);
      }).catch(function (error) {
        console.error("Failed to load account:", error);
      });
    },

    actions: {
      toLoans: function toLoans() {
        this.transitionToRoute('banks.bank.accounts.account.loans', localStorage.getItem('accNo')).then(function (newRoute) {

          newRoute.controller.setProperties({
            bankId: localStorage.getItem('bankId'),
            branchId: localStorage.getItem('branchId')
          });
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      },
      toTransactions: function toTransactions() {
        this.transitionToRoute('banks.bank.accounts.account.transactions', localStorage.getItem('accNo')).then(function (newRoute) {

          newRoute.controller.setProperties({
            bankId: localStorage.getItem('bankId'),
            branchId: localStorage.getItem('branchId')
          });
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      }
    }
  });
});
define('banker/controllers/banks/bank/accounts/account/loans', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define('banker/controllers/banks/bank/accounts/account/loans/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    loansService: Ember.inject.service('loans'),
    loans: [],
    loadLoans: function loadLoans() {
      var _this = this;

      console.log(this.get('accNo'));
      this.get('loansService').fetchLoans(this.get('accNo'), this.get('bankId')).then(function (response) {
        console.log(response);
        _this.set('loans', response);
      }).catch(function (error) {
        console.error("Failed to load loans:", error);
      });
    },

    actions: {
      viewloan: function viewloan(loan) {
        var _this2 = this;

        // console.log("view...."+this.get('bankId'));
        this.transitionToRoute('banks.bank.accounts.account.loans.loan', loan.acc_number, loan.loan_id).then(function (newRoute) {

          localStorage.setItem('loanId', loan.loan_id);
          newRoute.controller.setProperties({
            bankId: _this2.get('bankId'),
            branchId: _this2.get('branchId')
          });
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      },
      addNewLoan: function addNewLoan(branchId) {
        var _this3 = this;

        console.log(branchId);
        this.transitionToRoute('banks.bank.accounts.account.loans.new').then(function (newRoute) {
          newRoute.controller.setProperties({
            accNo: _this3.get('accNo'),
            branchId: branchId,
            bankId: _this3.get('bankId')
          });
        }).catch(function (error) {
          console.error("Transition to edit loan page failed", error);
        });
      },
      editLoan: function editLoan(isEdit, loan, branchId) {
        var _this4 = this;

        this.transitionToRoute('banks.bank.accounts.account.loans.loan.edit', loan.loan_id).then(function (newRoute) {
          localStorage.setItem('loanId', loan.loan_id);
          newRoute.controller.setProperties({
            isEdit: isEdit,
            loan_id: loan.loan_id,
            loan_type: loan.loan_type,
            loan_amount: loan.loan_amount,
            loan_interest: loan.loan_interest,
            loan_duration: loan.loan_duration,
            loan_status: loan.loan_status,
            loan_availed_date: loan.loan_availed_date,
            accNo: _this4.get('accNo'),
            bankId: _this4.get('bankId'),
            branchId: branchId
          });
        }).catch(function (error) {
          console.error("Transition to edit loan page failed", error);
        });
      }
    }

  });
});
define('banker/controllers/banks/bank/accounts/account/loans/loan', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define('banker/controllers/banks/bank/accounts/account/loans/loan/edit', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({

        actions: {
            toLoan: function toLoan() {
                this.transitionToRoute("banks.bank.accounts.account.loans", localStorage.getItem('accNo'));
            }
        }
    });
});
define('banker/controllers/banks/bank/accounts/account/loans/loan/emi', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        emisService: Ember.inject.service('emis'),
        bankId: localStorage.getItem('bankId'),
        loanId: localStorage.getItem('loanId'),
        emis: [],
        generatedEmis: [],

        loadEmis: function loadEmis() {
            var _this = this;

            this.get('emisService').fetchEmis(this.get('loanId')).then(function (response) {
                _this.set('emis', response);
                _this.set('generatedEmis', _this.generateTable(_this.get('emis')));
            }).catch(function (error) {
                console.error("Failed to load EMIs:", error);
            });
        },
        generateTable: function generateTable(emis) {
            var emiSchedule = [];

            var totalEmis = this.get('loan').loan_duration;

            var loanAvailedDate = this.get('loan').length <= 0 ? new Date() : new Date(this.get('loan').loan_availed_date.replace(/-/g, '/'));

            var emisArray = this.get('emis');

            for (var i = 0; i < emisArray.length; i++) {
                var emi = emisArray[i];
                var emiNumber = emi.emi_number || '-';
                var transactionId = emi.transaction_id || '-';
                var actualPaidDate = emi.actual_paid_date ? new Date(emi.actual_paid_date.replace(/-/g, '/')) : '-';

                var toBePaidDate = new Date(loanAvailedDate);
                if (!isNaN(toBePaidDate.getTime())) {
                    toBePaidDate.setMonth(toBePaidDate.getMonth() + emiNumber);
                } else {
                    toBePaidDate = 'Invalid Date';
                }

                emiSchedule.push({
                    emiNumber: emiNumber,
                    transactionId: transactionId,
                    toBePaidDate: toBePaidDate instanceof Date ? toBePaidDate.toLocaleDateString() : toBePaidDate,
                    actualPaidDate: actualPaidDate instanceof Date ? actualPaidDate.toLocaleDateString() : actualPaidDate
                });
            }

            var nextEmiNumber = emis.length > 0 ? emis[emis.length - 1].emi_number + 1 : 1;
            if (nextEmiNumber <= totalEmis) {
                var nextToBePaidDate = new Date(loanAvailedDate);
                if (!isNaN(nextToBePaidDate.getTime())) {
                    nextToBePaidDate.setMonth(nextToBePaidDate.getMonth() + nextEmiNumber);
                } else {
                    nextToBePaidDate = 'Invalid Date';
                }

                emiSchedule.push({
                    emiNumber: nextEmiNumber,
                    transactionId: '-',
                    toBePaidDate: nextToBePaidDate instanceof Date ? nextToBePaidDate.toLocaleDateString() : nextToBePaidDate,
                    actualPaidDate: '-'
                });
            }

            if (emiSchedule.length === 0) {
                var firstEmiNumber = 1;
                var firstToBePaidDate = new Date(loanAvailedDate);
                if (!isNaN(firstToBePaidDate.getTime())) {
                    firstToBePaidDate.setMonth(firstToBePaidDate.getMonth() + firstEmiNumber);
                } else {
                    firstToBePaidDate = 'Invalid Date';
                }

                emiSchedule.push({
                    emiNumber: firstEmiNumber,
                    transactionId: '-',
                    toBePaidDate: firstToBePaidDate instanceof Date ? firstToBePaidDate.toLocaleDateString() : firstToBePaidDate,
                    actualPaidDate: '-'
                });
            }

            return emiSchedule;
        },


        actions: {
            addNewEmi: function addNewEmi() {
                var _this2 = this;

                this.transitionToRoute('banks.bank.accounts.account.transactions.new', this.get('bankId'), this.get('loan').acc_number).then(function (newRoute) {
                    newRoute.controller.setProperties({
                        transaction_type: 'emi',
                        transaction_amount: _this2.get('loanAmount'),
                        accNo: _this2.get('loan').acc_number
                    });
                }).catch(function (error) {
                    console.error("Transition failed", error);
                });
            }
        }

    });
});
define('banker/controllers/banks/bank/accounts/account/loans/loan/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    loansService: Ember.inject.service('loans'),
    loan: [],
    loadLoan: function loadLoan() {
      var _this = this;

      var accNo = localStorage.getItem('accNo');
      var bankId = localStorage.getItem('bankId');
      this.get('loansService').fetchLoan(accNo, bankId).then(function (response) {
        console.log(response);
        _this.set('loan', response);
        _this.set('loan', _this.get('loan')[0]);
      }).catch(function (error) {
        console.error("Failed to load loan:", error);
      });
    },


    actions: {
      toEmis: function toEmis(loan, emiAmount) {

        this.transitionToRoute("banks.bank.accounts.account.loans.loan.emi", localStorage.getItem('bankId'), loan.acc_number, loan.loan_id).then(function (newRoute) {

          newRoute.controller.setProperties({
            loan: loan,
            loanAmount: emiAmount
          });
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      }
    }
  });
});
define('banker/controllers/banks/bank/accounts/account/loans/new', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        actions: {
            toLoan: function toLoan() {
                this.transitionToRoute("banks.bank.accounts.account.loans", localStorage.getItem('accNo'));
            }
        }

    });
});
define('banker/controllers/banks/bank/accounts/account/transactions', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define('banker/controllers/banks/bank/accounts/account/transactions/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    transactionsService: Ember.inject.service('transactions'),
    transactions: [],
    bankId: localStorage.getItem('bankId'),
    loadTransactions: function loadTransactions() {
      var _this = this;

      this.get('transactionsService').fetchTransactions(localStorage.getItem('accNo'), this.get('bankId')).then(function (response) {
        console.log(response);
        _this.set('transactions', response);
      }).catch(function (error) {
        console.error("Failed to load transactions:", error);
        alert("Could not load transactions. Please try again later.");
      });
    },


    actions: {
      viewTransaction: function viewTransaction(transaction) {
        var _this2 = this;

        localStorage.setItem('transactionId', transaction.transaction_id);
        this.transitionToRoute('banks.bank.accounts.account.transactions.transaction', transaction.acc_number, transaction.transaction_id).then(function (newRoute) {
          newRoute.controller.setProperties({
            bankId: _this2.get('bankId'),
            branchId: _this2.get('branchId'),
            transactionId: transaction.transaction_id
          });
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      },
      addNewTransaction: function addNewTransaction(branchId) {
        var _this3 = this;

        console.log(branchId);
        this.transitionToRoute('banks.bank.accounts.account.transactions.new').then(function (newRoute) {
          newRoute.controller.setProperties({
            accNo: _this3.get('accNo'),
            branchId: branchId,
            bankId: _this3.get('bankId')
          });
        }).catch(function (error) {
          console.error("Transition to new transaction page failed", error);
        });
      }
    }
  });
});
define('banker/controllers/banks/bank/accounts/account/transactions/new', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        actions: {
            toTransaction: function toTransaction() {
                this.transitionToRoute("banks.bank.accounts.account.transactions", localStorage.getItem('accNo'));
            }
        }

    });
});
define('banker/controllers/banks/bank/accounts/account/transactions/transaction', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    transactionsService: Ember.inject.service('transactions'),
    transaction: [],
    bankId: localStorage.getItem('bankId'),
    loadTransaction: function loadTransaction() {
      var _this = this;

      this.get('transactionsService').fetchTransaction().then(function (response) {
        console.log(response);
        _this.set('transaction', response);
        _this.set('transaction', _this.get('transaction')[0]);
      }).catch(function (error) {
        console.error("Failed to load transaction:", error);
        alert("Could not load transaction. Please try again later.");
      });
    }
  });
});
define('banker/controllers/banks/bank/accounts/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    branchSelection: Ember.inject.service('branch-select'),
    branchesService: Ember.inject.service('branches'),
    accountsService: Ember.inject.service('accounts'),
    bankId: localStorage.getItem('bankId'),

    init: function init() {
      this._super.apply(this, arguments);

      this.get('branchSelection').on('branchChanged', this, this.handleBranchChange);
    },
    handleBranchChange: function handleBranchChange(newBranchId, currentRouteName) {
      console.log(currentRouteName);
      if (currentRouteName == 'banks.bank.accounts.index') {
        this.loadAccounts();
      }
    },

    accounts: [],

    loadAccounts: function loadAccounts() {
      var _this = this;

      this.get('accountsService').fetchAccounts(localStorage.getItem('bankId')).then(function (response) {
        console.log(response);
        _this.set('accounts', response);
      }).catch(function (error) {
        _this.set('accounts', []);
        console.error("Failed to load accounts:", error);
      });
    },


    actions: {
      viewaccount: function viewaccount(account) {
        var _this2 = this;

        localStorage.setItem('branchId', account.branch_id);
        localStorage.setItem('accNo', account.acc_no);
        // console.log("view...."+this.get('bankId'));

        this.transitionToRoute('banks.bank.accounts.account', this.get('bankId'), account.acc_no).then(function (newRoute) {
          newRoute.controller.setProperties({
            bankId: _this2.get('bankId'),
            branchId: account.branch_id,
            account: account
          });
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      },
      addNewAccount: function addNewAccount() {
        var _this3 = this;

        console.log(this.get('bankId'));
        this.transitionToRoute('banks.bank.accounts.new').then(function (newRoute) {

          newRoute.controller.setProperties({
            bankId: _this3.get('bankId')
          });
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      },
      editAccount: function editAccount(isEdit, account, branchId) {
        var _this4 = this;

        localStorage.setItem('branchId', branchId);
        localStorage.setItem('accNo', account.acc_no);
        this.transitionToRoute('banks.bank.accounts.account.edit', this.get('bankId'), account.acc_no).then(function (newRoute) {

          newRoute.controller.setProperties({
            isEdit: isEdit,
            accNo: account.acc_no,
            acc_type: account.acc_type,
            acc_balance: account.acc_balance,
            acc_status: account.acc_status,
            username: account.username,
            fullname: account.user_fullname,
            branch_name: account.branch_name,
            branch_Id: branchId,
            bankId: _this4.get('bankId'),
            userId: account.user_id
          });
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      }
    },
    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);
      this.get('branchSelection').off('branchChanged', this, this.handleBranchChange);
    }
  });
});
define('banker/controllers/banks/bank/accounts/new', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    actions: {
      toAccount: function toAccount() {
        this.transitionToRoute("banks.bank.accounts", this.get('bankId'));
      }
    }
  });
});
define('banker/controllers/banks/bank/branches', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define('banker/controllers/banks/bank/branches/branch', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define("banker/controllers/banks/bank/branches/branch/edit", ["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({

        actions: {
            toBranch: function toBranch() {
                this.transitionToRoute("banks.bank.branches", localStorage.getItem("bankId"));
            }
        }
    });
});
define('banker/controllers/banks/bank/branches/branch/index', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    branchesService: Ember.inject.service('branches'),
    branch: [],
    userRole: _util.role,
    role: Ember.computed(function () {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + 'sessionData' + '=');
      if (parts.length === 2) {
        var cookieData = decodeURIComponent(parts.pop().split(';').shift());
        var sessionData = JSON.parse(cookieData);
        return sessionData.user_role;
      }
    }),
    loadBranch: function loadBranch() {
      var _this = this;

      this.get('branchesService').fetchBranch(this.get('bankId')).then(function (response) {
        _this.set('branch', response);
        _this.set('branch', _this.get('branch')[0]);
        console.log(_this.get('branch'));
      }).catch(function (error) {
        console.error("Failed to load branch:", error);
      });
    },

    actions: {
      viewAccounts: function viewAccounts(branch) {
        var _this2 = this;

        localStorage.setItem("branchId", branch.branch_id);
        this.transitionToRoute('banks.bank.accounts', this.get('bankId')).then(function (newRoute) {
          newRoute.controller.setProperties({
            bankId: localStorage.getItem('bankId'),
            branchId: _this2.get('branchId')
          });
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      },
      delete: function _delete(branch) {
        if (confirm('Are you sure you want to delete the branch: ' + branch.branch_name + '?')) {
          this.get('branchesService').deleteBranch(this.get('bankId'), branch.branch_id).then(function () {
            console.log('Branch deleted successfully');
          }).catch(function (error) {
            console.error("Failed to delete branch:", error);
            alert('Error occurred while deleting the branch.');
          });
        }
      }
    }
  });
});
define('banker/controllers/banks/bank/branches/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    notification: Ember.inject.service('notify'),
    branchesService: Ember.inject.service('branches'),
    bankId: localStorage.getItem("bankId"),
    branches: [],

    loadBranches: function loadBranches() {
      var _this = this;

      console.log(this.get('bankId'));
      this.get('branchesService').fetchBranches(this.get('bankId')).then(function (response) {
        console.log(response);
        _this.set('branches', response);
      }).catch(function (error) {

        console.error("Failed to load branches:", error);
      });
    },


    actions: {
      viewBranch: function viewBranch(branch) {
        var _this2 = this;

        localStorage.setItem('branchId', branch.branch_id);
        this.transitionToRoute('banks.bank.branches.branch', this.get('bankId'), branch.branch_id).then(function (newRoute) {
          newRoute.controller.setProperties({
            bankId: _this2.get('bankId'),
            Branch: branch
          });
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      },
      addNewBranch: function addNewBranch() {
        var _this3 = this;

        console.log(this.get('bankId'));
        this.transitionToRoute('banks.bank.branches.new').then(function (newRoute) {
          newRoute.controller.setProperties({
            bankId: _this3.get('bankId')
          });
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      },
      editBranch: function editBranch(branch) {
        var _this4 = this;

        localStorage.setItem('branchId', branch.branch_id);
        this.transitionToRoute('banks.bank.branches.branch.edit', this.get('bankId'), branch.branch_id).then(function (newRoute) {
          newRoute.controller.setProperties({
            isEdit: true,
            branchId: branch.branch_id,
            branch_name: branch.branch_name,
            branch_address: branch.branch_address,
            branch_number: branch.branch_number,
            manager_id: branch.manager_id,
            manager_name: branch.manager_name,
            bankId: _this4.get('bankId')
          });
        }).catch(function (error) {

          console.error("Transition failed", error);
        });
      },
      deleteBranch: function deleteBranch(branch) {
        var _this5 = this;

        if (confirm('Are you sure you want to delete the branch: ' + branch.branch_name + '?')) {
          this.get('branchesService').deleteBranch(this.get('bankId'), branch.branch_id).then(function () {
            console.log('Branch deleted successfully');
            _this5.get('notification').showNotification('Branch Deleted successfully!', 'success');
            Ember.run.later(function () {
              _this5.transitionToRoute('banks.bank.branches', _this5.get('bankId'));
              _this5.loadBranches();
            }, 2000);
          }).catch(function (error) {
            console.error("Failed to delete branch:", error);
            // alert('Error occurred while deleting the branch.');
          });
        }
      }
    }
  });
});
define("banker/controllers/banks/bank/branches/new", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    actions: {
      toBranch: function toBranch() {
        this.transitionToRoute("banks.bank.branches", localStorage.getItem("bankId"));
      }
    }
  });
});
define('banker/controllers/banks/bank/edit', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    notification: Ember.inject.service('notify'),
    banksService: Ember.inject.service('banks'),
    branchesService: Ember.inject.service('branches'),
    branches: [],
    bankId: localStorage.getItem('bankId'),

    loadBranches: function loadBranches() {
      var _this = this;

      this.get('branchesService').fetchBranches(this.get('bankId')).then(function (response) {
        console.log(response);
        _this.set('branches', response);
      }).catch(function (error) {
        console.error("Failed to load accounts:", error);
      });
    },

    actions: {
      submitForm: function submitForm() {
        var _this2 = this;

        this.get('banksService').updateBank(this.get('branchId'), this.get('bank')).then(function () {
          // console.log("bank update successfully.");
          _this2.get('notification').showNotification('Bank Edited successfully!', 'success');

          Ember.run.later(function () {
            _this2.transitionToRoute('banks.bank', _this2.get('bankId'));
          }, 2000);
        }).catch(function (error) {
          console.error("Failed to load accounts:", error);
        });
      },
      cancel: function cancel() {
        this.transitionToRoute('banks.bank');
      }
    }

  });
});
define('banker/controllers/banks/bank/index', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    branchesService: Ember.inject.service('branches'),
    banksService: Ember.inject.service('banks'),
    bankId: localStorage.getItem('bankId'),
    branch: [],
    banks: [],
    userRole: _util.role,
    role: Ember.computed(function () {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + 'sessionData' + '=');
      if (parts.length === 2) {
        var cookieData = decodeURIComponent(parts.pop().split(';').shift());
        var sessionData = JSON.parse(cookieData);
        return sessionData.user_role;
      }
    }),
    loadBanks: function loadBanks() {
      var _this = this;

      this.get('banksService').fetchBank(localStorage.getItem('bankId')).then(function (response) {
        console.log(response);
        _this.set('banks', response);
        _this.set('branchId', localStorage.getItem('branchId'));
        localStorage.setItem('branchId', _this.get('banks')[0].main_branch_id);
        _this.get('branchesService').fetchBranch(_this.get('bankId')).then(function (response) {
          console.log(response);
          localStorage.setItem('branchId', _this.get('branchId'));
          _this.set('branch', response);
          _this.set('branch', _this.get('branch')[0]);
        }).catch(function (error) {
          console.error("Failed to load banks:", error);
        });
      }).catch(function (error) {
        console.error("Failed to load banks:", error);
      });
    },


    actions: {
      updateMainBranch: function updateMainBranch(bank) {
        this.transitionToRoute('banks.bank.edit', bank.bank_id).then(function (newRoute) {

          newRoute.controller.setProperties({
            bank: bank
          });
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      }
    }

  });
});
define('banker/controllers/banks/bank/loans', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define('banker/controllers/banks/bank/loans/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    branchSelection: Ember.inject.service('branch-select'),
    loansService: Ember.inject.service('loans'),

    init: function init() {
      this._super.apply(this, arguments);

      this.get('branchSelection').on('branchChanged', this, this.handleBranchChange);
    },
    handleBranchChange: function handleBranchChange(newBranchId, currentRouteName) {
      if (currentRouteName == 'banks.bank.loans.index') {
        this.loadLoans();
      }
    },


    loans: [],
    loadLoans: function loadLoans() {
      var _this = this;

      console.log(this.get('accNo'));
      this.get('loansService').fetchLoans(localStorage.getItem('accNo'), localStorage.getItem('bankId')).then(function (response) {
        console.log(response);
        _this.set('loans', response);
      }).catch(function (error) {
        console.error("Failed to load loans:", error);
        _this.set('loans', []);
      });
    },

    bankId: localStorage.getItem('bankId'),
    actions: {
      viewloan: function viewloan(loan) {
        var _this2 = this;

        localStorage.setItem("accNo", loan.acc_number);
        // console.log("view...."+this.get('bankId'));
        localStorage.setItem("loanId", loan.loan_id);
        this.transitionToRoute('banks.bank.loans.loan', this.get('bankId'), loan.loan_id).then(function (newRoute) {

          newRoute.controller.setProperties({
            bankId: _this2.get('bankId'),
            branchId: _this2.get('branchId')
          });
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      },
      addNewLoan: function addNewLoan(branchId) {
        var _this3 = this;

        console.log(branchId);
        this.transitionToRoute('banks.bank.loans.new').then(function (newRoute) {
          newRoute.controller.setProperties({
            accNo: _this3.get('accNo'),
            branchId: branchId,
            bankId: _this3.get('bankId')
          });
        }).catch(function (error) {
          console.error("Transition to edit loan page failed", error);
        });
      },
      editLoan: function editLoan(isEdit, loan, branchId) {
        var _this4 = this;

        localStorage.setItem("accNo", loan.acc_number);
        this.transitionToRoute('banks.bank.loans.loan.edit', loan.loan_id).then(function (newRoute) {
          newRoute.controller.setProperties({
            isEdit: isEdit,
            loan_id: loan.loan_id,
            loan_type: loan.loan_type,
            loan_amount: loan.loan_amount,
            loan_interest: loan.loan_interest,
            loan_duration: loan.loan_duration,
            loan_status: loan.loan_status,
            loan_availed_date: loan.loan_availed_date,
            accNo: loan.acc_number,
            bankId: _this4.get('bankId'),
            branchId: branchId
          });
        }).catch(function (error) {
          console.error("Transition to edit loan page failed", error);
        });
      }
    },
    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);
      this.get('branchSelection').off('branchChanged', this, this.handleBranchChange);
    }
  });
});
define('banker/controllers/banks/bank/loans/loan', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define('banker/controllers/banks/bank/loans/loan/edit', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        actions: {
            toLoan: function toLoan() {
                this.transitionToRoute("banks.bank.loans", localStorage.getItem('bankId'));
            }
        }
    });
});
define('banker/controllers/banks/bank/loans/loan/emi', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        emisService: Ember.inject.service('emis'),
        bankId: localStorage.getItem('bankId'),
        loanId: localStorage.getItem('loanId'),
        emis: [],
        generatedEmis: [],

        loadEmis: function loadEmis() {
            var _this = this;

            this.get('emisService').fetchEmis(this.get('loanId')).then(function (response) {
                _this.set('emis', response);
                _this.set('generatedEmis', _this.generateTable(_this.get('emis')));
            }).catch(function (error) {
                console.error("Failed to load EMIs:", error);
                _this.set('generatedEmis', _this.generateTable([]));
            });
        },
        generateTable: function generateTable(emis) {
            var emiSchedule = [];

            console.log(this.get('loan'));
            var totalEmis = this.get('loan').loan_duration;
            var loanAvailedDate = this.get('loan').length <= 0 ? new Date() : new Date(this.get('loan').loan_availed_date.replace(/-/g, '/'));

            var emisArray = this.get('emis');

            for (var i = 0; i < emisArray.length; i++) {
                var emi = emisArray[i];
                var emiNumber = emi.emi_number || '-';
                var transactionId = emi.transaction_id || '-';
                var actualPaidDate = emi.actual_paid_date ? new Date(emi.actual_paid_date.replace(/-/g, '/')) : '-';

                var toBePaidDate = new Date(loanAvailedDate);
                if (!isNaN(toBePaidDate.getTime())) {
                    toBePaidDate.setMonth(toBePaidDate.getMonth() + emiNumber);
                } else {
                    toBePaidDate = 'Invalid Date';
                }

                emiSchedule.push({
                    emiNumber: emiNumber,
                    transactionId: transactionId,
                    toBePaidDate: toBePaidDate instanceof Date ? toBePaidDate.toLocaleDateString() : toBePaidDate,
                    actualPaidDate: actualPaidDate instanceof Date ? actualPaidDate.toLocaleDateString() : actualPaidDate
                });
            }

            var nextEmiNumber = emis.length > 0 ? emis[emis.length - 1].emi_number + 1 : 1;
            if (nextEmiNumber <= totalEmis) {
                var nextToBePaidDate = new Date(loanAvailedDate);
                if (!isNaN(nextToBePaidDate.getTime())) {
                    nextToBePaidDate.setMonth(nextToBePaidDate.getMonth() + nextEmiNumber);
                } else {
                    nextToBePaidDate = 'Invalid Date';
                }

                emiSchedule.push({
                    emiNumber: nextEmiNumber,
                    transactionId: '-',
                    toBePaidDate: nextToBePaidDate instanceof Date ? nextToBePaidDate.toLocaleDateString() : nextToBePaidDate,
                    actualPaidDate: '-'
                });
            }

            if (emiSchedule.length === 0) {
                var firstEmiNumber = 1;
                var firstToBePaidDate = new Date(loanAvailedDate);
                if (!isNaN(firstToBePaidDate.getTime())) {
                    firstToBePaidDate.setMonth(firstToBePaidDate.getMonth() + firstEmiNumber);
                } else {
                    firstToBePaidDate = 'Invalid Date';
                }

                emiSchedule.push({
                    emiNumber: firstEmiNumber,
                    transactionId: '-',
                    toBePaidDate: firstToBePaidDate instanceof Date ? firstToBePaidDate.toLocaleDateString() : firstToBePaidDate,
                    actualPaidDate: '-'
                });
            }

            return emiSchedule;
        },


        actions: {
            addNewEmi: function addNewEmi() {
                var _this2 = this;

                this.transitionToRoute('banks.bank.accounts.account.transactions.new', this.get('bankId'), this.get('loan').acc_number).then(function (newRoute) {
                    newRoute.controller.setProperties({
                        transaction_type: 'emi',
                        transaction_amount: _this2.get('loanAmount'),
                        accNo: _this2.get('loan').acc_number
                    });
                }).catch(function (error) {
                    console.error("Transition failed", error);
                });
            }
        }

    });
});
define('banker/controllers/banks/bank/loans/loan/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    bankId: localStorage.getItem('bankId'),
    loansService: Ember.inject.service('loans'),
    loan: [],
    loadLoan: function loadLoan() {
      var _this = this;

      var accNo = localStorage.getItem('accNo');
      var bankId = localStorage.getItem('bankId');
      this.get('loansService').fetchLoan(accNo, bankId).then(function (response) {
        console.log(response);
        _this.set('loan', response);
        _this.set('loan', _this.get('loan')[0]);
      }).catch(function (error) {
        console.error("Failed to load loan:", error);
      });
    },

    actions: {
      toEmis: function toEmis(loan, emiAmount) {

        this.transitionToRoute("banks.bank.loans.loan.emi", this.get('bankId'), loan.loan_id).then(function (newRoute) {

          newRoute.controller.setProperties({
            loan: loan,
            loanAmount: emiAmount
          });
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      }
    }
  });
});
define('banker/controllers/banks/bank/loans/new', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        actions: {
            toLoan: function toLoan() {
                this.transitionToRoute("banks.bank.loans", localStorage.getItem('bankId'));
            }
        }
    });
});
define('banker/controllers/banks/bank/transactions', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define('banker/controllers/banks/bank/transactions/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    branchSelection: Ember.inject.service('branch-select'),
    transactionsService: Ember.inject.service('transactions'),
    transactions: [],
    bankId: localStorage.getItem('bankId'),
    accNo: localStorage.getItem('accNo'),

    init: function init() {
      this._super.apply(this, arguments);
      this.get('branchSelection').on('branchChanged', this, this.handleBranchChange);
    },
    handleBranchChange: function handleBranchChange(newBranchId, currentRouteName) {
      if (currentRouteName == 'banks.bank.transactions.index') {
        this.loadTransactions();
      }
    },
    loadTransactions: function loadTransactions() {
      var _this = this;

      console.log(this.get('accNo'));
      this.get('transactionsService').fetchTransactions(this.get('accNo'), this.get('bankId')).then(function (response) {
        console.log(response);
        _this.set('transactions', response);
      }).catch(function (error) {
        console.error("Failed to load transactions:", error);
        _this.set('transactions', []);
      });
    },


    actions: {
      viewTransaction: function viewTransaction(transaction) {
        var _this2 = this;

        localStorage.setItem('transactionId', transaction.transaction_id);
        this.transitionToRoute('banks.bank.transactions.transaction', this.get('bankId'), transaction.transaction_id).then(function (newRoute) {
          newRoute.controller.setProperties({
            bankId: _this2.get('bankId'),
            branchId: _this2.get('branchId'),
            transactionId: transaction.transaction_id
          });
          console.log("inner view transactions");
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      },
      addNewTransaction: function addNewTransaction(branchId) {
        var _this3 = this;

        console.log(branchId);
        this.transitionToRoute('banks.bank.transactions.new', this.get('bankId')).then(function (newRoute) {
          newRoute.controller.setProperties({
            accNo: _this3.get('accNo'),
            branchId: branchId,
            bankId: _this3.get('bankId')
          });
        }).catch(function (error) {
          console.error("Transition to new transaction page failed", error);
        });
      }
    },
    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);
      this.get('branchSelection').off('branchChanged', this, this.handleBranchChange);
    }
  });
});
define('banker/controllers/banks/bank/transactions/new', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        actions: {
            toTransaction: function toTransaction() {
                this.transitionToRoute("banks.bank.transactions", localStorage.getItem('bankId'));
            }
        }

    });
});
define('banker/controllers/banks/bank/transactions/transaction', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    transactionsService: Ember.inject.service('transactions'),
    transaction: [],
    bankId: localStorage.getItem('bankId'),

    loadTransaction: function loadTransaction() {
      var _this = this;

      this.get('transactionsService').fetchTransaction().then(function (response) {
        console.log(response);
        _this.set('transaction', response);
        _this.set('transaction', _this.get('transaction')[0]);
      }).catch(function (error) {
        console.error("Failed to load transaction:", error);
        alert("Could not load transaction. Please try again later.");
      });
    }
  });
});
define('banker/controllers/banks/bank/users', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define('banker/controllers/banks/bank/users/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define('banker/controllers/banks/bank/users/user', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define('banker/controllers/banks/bank/users/user/dashboard', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    dashboardService: Ember.inject.service('dashboard'),
    userRole: _util.role,
    getSessionData: function getSessionData() {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + 'sessionData' + '=');
      if (parts.length === 2) {
        var cookieData = decodeURIComponent(parts.pop().split(';').shift());
        var sessionData = JSON.parse(cookieData);
        this.set('sessionData', sessionData);
      }
    },
    fetchAdminDashboard: function fetchAdminDashboard() {
      var _this = this;

      this.getSessionData();
      this.get('dashboardService').fetchAdminDashboard().then(function (response) {
        _this.set('branches', response);
      }).catch(function (error) {
        console.error("Failed to load dashboard:", error);
      });
    },
    fetchManagerDashboard: function fetchManagerDashboard() {
      var _this2 = this;

      this.getSessionData();
      this.get('dashboardService').fetchManagerDashboard().then(function (response) {
        _this2.set('branches', response);
        var array = _this2.get('branches');
        for (var i = 0; i < array.length; i++) {
          var item = array[i];
          if (item['manager_id'] == _this2.get('sessionData').user_id) {
            _this2.set('branch', item);
            localStorage.setItem('branchId', _this2.get('branch').branch_id);
            // console.log(this.get('branch'));
            break;
          }
        }
      }).catch(function (error) {
        console.error("Failed to load dashboard:", error);
      });
    },
    fetchCustomerDashboard: function fetchCustomerDashboard() {
      var _this3 = this;

      this.getSessionData();
      this.get('dashboardService').fetchCustomerDashboard().then(function (response) {
        console.log(response);

        var accounts = [];
        for (var i = 0; i < response.length; i++) {
          var account = response[i];
          var accountData = {
            acc_no: account.acc_no,
            acc_type: account.acc_type,
            acc_balance: account.acc_balance,
            acc_status: account.acc_status
          };

          var loanDetails = account.loan_details || null;
          var transactions = account.transactions || [];

          accounts.push({
            account: accountData,
            loan_details: loanDetails,
            transactions: transactions
          });
        }

        _this3.set('accountList', accounts);
      }).catch(function (error) {
        console.error("Failed to load dashboard:", error);
      });
    }
  });
});
define('banker/controllers/banks/bank/users/user/edit', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define('banker/controllers/banks/bank/users/user/index', ['exports'], function (exports) {
   'use strict';

   Object.defineProperty(exports, "__esModule", {
      value: true
   });
   exports.default = Ember.Controller.extend({});
});
define('banker/controllers/banks/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    banksService: Ember.inject.service('banks'),
    bankId: localStorage.getItem("bankId"),

    banks: [],

    loadBanks: function loadBanks() {
      var _this = this;

      this.get('banksService').fetchBanks().then(function (response) {
        console.log(response);
        _this.set('banks', response);
      }).catch(function (error) {
        console.error("Failed to load banks:", error);
      });
    },


    actions: {
      viewBank: function viewBank(bank) {
        var _this2 = this;

        localStorage.setItem('bankId', bank.bank_id);
        this.transitionToRoute('banks.bank', bank.bank_id).then(function (newRoute) {
          newRoute.controller.setProperties({
            bankId: _this2.get('bankId')
          });
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      },
      addNewBank: function addNewBank() {
        this.transitionToRoute('banks.new').then(function () {}).catch(function (error) {
          console.error("Transition failed", error);
        });
      }
    }
  });
});
define('banker/controllers/banks/new', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    notification: Ember.inject.service('notify'),
    banksService: Ember.inject.service('banks'),
    usersService: Ember.inject.service('users'),
    errorMessage: '',

    init: function init() {
      this._super.apply(this, arguments);
      console.log("init...");
    },
    loadAdmins: function loadAdmins() {
      var _this = this;

      this.get('usersService').fetchAdmins().then(function (response) {
        _this.set('admins', response);
      }).catch(function (error) {
        console.error("Failed to load admins:", error);
      });
    },


    bankId: '',
    bank_name: '',
    bank_code: '',
    admin_id: '',
    isEdit: false,

    actions: {
      submitForm: function submitForm() {
        var _this2 = this;

        if (!this.get('bank_name') || this.get('bank_name').trim() === '') {
          this.set("errorMessage", 'Please provide a bank name.');
          return;
        }

        if (!this.get('bank_code') || this.get('bank_code').trim() === '') {
          this.set("errorMessage", 'Please provide a bank code.');
          return;
        }
        if (!this.get('admin_id')) {
          this.set("errorMessage", 'Please select an admin');
          return;
        }

        var bankData = {
          bank_name: this.get('bank_name'),
          bank_code: this.get('bank_code'),
          admin_id: this.get('admin_id')
        };

        this.get('banksService').createBank(bankData).then(function () {
          _this2.resetForm();
          _this2.get('notification').showNotification('Bank created successfully!', 'success');
          Ember.run.later(function () {
            _this2.transitionToRoute('banks');
          }, 2000);
        }).catch(function (error) {
          console.error('Error creating bank:', error);
        });
      },
      cancel: function cancel() {
        this.resetForm();
      }
    },

    resetForm: function resetForm() {
      this.setProperties({
        bankId: '',
        bank_name: '',
        bank_code: '',
        bank_status: '',
        admin_id: '',
        isEdit: false
      });
    }
  });
});
define('banker/controllers/login', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    session: Ember.inject.service(),
    username: '',
    password: '',
    selectedRole: '',
    name: '',
    dob: '',
    addr: '',
    pno: '',
    errorMessage: '',
    userId: '',
    getUserIdFromCookie: function getUserIdFromCookie() {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + 'sessionData' + '=');
      if (parts.length === 2) {
        var cookieData = decodeURIComponent(parts.pop().split(';').shift());
        var sessionData = JSON.parse(cookieData);
        return sessionData.user_id;
      }
    },

    actions: {
      login: function login(credentials) {
        var _this = this;

        // console.log('Login action triggered'); 
        // console.log(credentials);
        this.get('session').login(credentials).then(function () {
          _this.set('userId', _this.getUserIdFromCookie());
          if (_this.get('userId')) {

            _this.transitionToRoute('banks.bank.users.user.dashboard', localStorage.getItem('bankId'), _this.get('userId'));
          } else {
            _this.set('errorMessage', 'User ID not found in cookies');
          }
        }).catch(function (error) {
          _this.set('errorMessage', error.message || 'Login failed');
        });
      },
      signup: function signup(credentials) {
        var _this2 = this;

        // console.log('signup action triggered'); 

        this.get('session').signup(credentials).then(function () {
          _this2.transitionToRoute('login');
        }).catch(function (error) {
          _this2.set('errorMessage', error.message || 'Signup failed');
        });
      },
      toggleMode: function toggleMode() {
        // console.log(isSignup);

        this.transitionToRoute('register');
      }
    }
  });
});
define('banker/controllers/register', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    session: Ember.inject.service(),
    username: '',
    password: '',
    selectedRole: '',
    name: '',
    dob: '',
    addr: '',
    pno: '',
    errorMessage: '',
    actions: {
      signup: function signup(credentials) {
        var _this = this;

        // console.log('signup action triggered'); 

        this.get('session').signup(credentials).then(function () {
          _this.transitionToRoute('login');
        }).catch(function (error) {
          _this.set('errorMessage', error.message || 'Signup failed');
        });
      },
      toggleMode: function toggleMode() {
        // console.log(isSignup);
        this.transitionToRoute('login');
      }
    }
  });
});
define('banker/controllers/super-admin-login', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        session: Ember.inject.service(),
        actions: {
            SuperAdminLogin: function SuperAdminLogin(credentials) {
                var _this = this;

                credentials.isSuperAdmin = true;
                this.get('session').login(credentials).then(function () {

                    _this.transitionToRoute('users');
                }).catch(function (error) {
                    _this.set('errorMessage', error.message || 'Login failed');
                });
            }
        }

    });
});
define('banker/controllers/users', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define('banker/controllers/users/index', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    usersService: Ember.inject.service('users'),
    bankId: localStorage.getItem("bankId"),
    status: _util.status,
    notification: Ember.inject.service('notify'),
    users: [],
    selectedUserRole: '',
    selectedUserStatus: '',

    filteredUsers: Ember.computed('users', 'selectedUserRole', 'selectedUserStatus', function () {
      var users = this.get('users');
      var selectedUserRole = this.get('selectedUserRole');
      var selectedUserStatus = this.get('selectedUserStatus');

      if (selectedUserRole) {
        users = users.filter(function (user) {
          return user.user_role === selectedUserRole;
        });
      }

      if (selectedUserStatus) {
        users = users.filter(function (user) {
          return user.user_status === selectedUserStatus;
        });
      }

      return users;
    }),

    loadUsers: function loadUsers() {
      var _this = this;

      this.get('usersService').fetchUsers().then(function (response) {
        console.log(response);
        _this.set('users', response);
      }).catch(function (error) {
        console.error("Failed to load users:", error);
      });
    },


    actions: {
      viewUser: function viewUser(user) {
        var _this2 = this;

        localStorage.setItem('userId', user.user_id);
        this.transitionToRoute('users.user', user.user_id).then(function (newRoute) {
          newRoute.controller.setProperties({
            bankId: _this2.get('bankId')
          });
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      },
      editUser: function editUser(user) {
        var _this3 = this;

        localStorage.setItem('userId', user.user_id);
        this.transitionToRoute('users.user.edit', user.user_id).then(function (newRoute) {
          newRoute.controller.setProperties({
            isEdit: true,
            userId: user.user_id,
            fullname: user.fullname,
            username: user.username,
            user_role: user.user_role,
            date_of_birth: user.date_of_birth,
            user_phonenumber: user.user_phonenumber,
            user_address: user.user_address,
            user_status: user.user_status,
            bankId: _this3.get('bankId')
          });
        }).catch(function (error) {
          console.error("Failed to load users:", error);
        });
      },
      deleteUser: function deleteUser(user) {
        var _this4 = this;

        if (confirm('Are you sure you want to delete the user: ' + user.fullname + '?')) {
          this.get('usersService').deleteUser(user.user_id).then(function () {
            console.log('User deleted successfully');
            _this4.get('notification').showNotification('User Deleted successfully!', 'success');

            Ember.run.later(function () {
              _this4.transitionToRoute('users');
              _this4.loadUsers();
            }, 2000);
          }).catch(function (error) {
            console.error("Failed to load users:", error);
          });
        }
      },
      updateUserRole: function updateUserRole(role) {
        this.set('selectedUserRole', role);
      },
      updateUserStatus: function updateUserStatus(status) {
        this.set('selectedUserStatus', status);
      }
    }
  });
});
define('banker/controllers/users/user', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define('banker/controllers/users/user/edit', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    notification: Ember.inject.service('notify'),
    usersService: Ember.inject.service('users'),
    statuses: [_util.status.PENDING, _util.status.ACTIVE, _util.status.INACTIVE],

    actions: {
      submitForm: function submitForm() {
        var _this = this;

        var userData = {

          user_status: this.get('user_status')
        };

        this.get('usersService').updateUser(userData).then(function () {
          console.log("User updated successfully!");
          _this.resetForm();
          _this.get('notification').showNotification('User Edited successfully!', 'success');
          Ember.run.later(function () {
            _this.transitionToRoute('users');
          }, 2000);
        }).catch(function (error) {
          console.error('Error updating user:', error);
        });
      },
      toUsers: function toUsers() {
        this.transitionToRoute("banks.bank.users", localStorage.getItem("bankId"));
      }
    },
    resetForm: function resetForm() {
      this.setProperties({
        userId: '',
        user_status: '',
        isEdit: false
      });
    }
  });
});
define('banker/controllers/users/user/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    usersService: Ember.inject.service('users'),
    loadUser: function loadUser() {
      var _this = this;

      this.get('usersService').fetchUsers().then(function (response) {
        console.log(response);
        _this.set('user', response[0]);
      }).catch(function (error) {
        console.error("Failed to load users:", error);
      });
    }
  });
});
define('banker/helpers/app-version', ['exports', 'banker/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var version = _environment.default.APP.version;
    // e.g. 1.0.0-alpha.1+4jds75hf

    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility
    var versionOnly = hash.versionOnly || hash.hideSha;
    var shaOnly = hash.shaOnly || hash.hideVersion;

    var match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      }
      // Fallback to just version
      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define("banker/helpers/eq", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.eq = eq;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function eq(_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        param1 = _ref2[0],
        param2 = _ref2[1];

    console.log("eq" + param2);
    return param1 === param2;
  }

  exports.default = Ember.Helper.helper(eq);
});
define('banker/helpers/format-date', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.formatDate = formatDate;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function formatDate(_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        date = _ref2[0];

    if (!date) {
      return '';
    }
    return new Date(date).toLocaleDateString();
  }

  exports.default = Ember.Helper.helper(formatDate);
});
define('banker/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('banker/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('banker/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'banker/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var name = void 0,
      version = void 0;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('banker/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('banker/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('banker/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('banker/initializers/export-application-global', ['exports', 'banker/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('banker/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('banker/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('banker/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("banker/instance-initializers/ember-data", ["exports", "ember-data/instance-initializers/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('banker/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('banker/router', ['exports', 'banker/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('index', { path: "/banker" });
    this.route('login', { path: "/banker/login" });
    this.route('register', { path: "/banker/register" });

    this.route('users', { path: "/banker/users" }, function () {
      this.route('user', { path: "/:userId" }, function () {
        this.route('edit');
      });
    });

    this.route('super-admin-login', { path: "/banker/super-admin-login" });

    this.route('banks', { path: "/banker/banks" }, function () {
      this.route('bank', { path: "/:bankId" }, function () {
        this.route('accounts', function () {
          this.route('account', { path: "/:accNo" }, function () {
            this.route('transactions', function () {
              this.route('transaction', { path: "/:transactionId" });
              this.route('new');
            });
            this.route('loans', function () {
              this.route('loan', { path: "/:loanId" }, function () {
                this.route('edit');
                this.route('emi');
              });
              this.route('new');
            });
            this.route('edit');
          });
          this.route('new');
        });
        this.route('branches', function () {
          this.route('branch', { path: "/:branchId" }, function () {
            this.route('edit');
          });
          this.route('new');
        });
        this.route('loans', function () {
          this.route('loan', { path: "/:loanId" }, function () {
            this.route('edit');
            this.route('emi');
          });
          this.route('new');
        });
        this.route('transactions', function () {
          this.route('transaction', { path: "/:transactionId" });
          this.route('new');
        });
        this.route('users', { path: "/users" }, function () {
          this.route('user', { path: "/:userId" }, function () {
            this.route('dashboard');
          });
        });
        this.route('edit');
      });
      this.route('new');
    });
  });

  exports.default = Router;
});
define('banker/routes/banks', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('banker/routes/banks/bank', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('banker/routes/banks/bank/accounts', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({

        // model(params) {
        //     return this.modelFor('banks.bank'); // fetches the model from the parent route
        //   },
        //   setupController(controller, model) {
        //     controller.set('bankId', model.bankId); // sets the bankId in the controller
        //     this._super(controller, model);
        //     controller.loadAccounts();
        //   }

    });
});
define('banker/routes/banks/bank/accounts/account', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('banker/routes/banks/bank/accounts/account/edit', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {
      var bankId = localStorage.getItem('bankId');
      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userId = sessionData.user_id;
      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      } else if (userrole == _util.role.CUSTOMER) {
        this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
        return;
      }
    }
  });
});
define('banker/routes/banks/bank/accounts/account/index', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {
      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }
      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      }
      localStorage.setItem('loanId', '*');
      localStorage.setItem('transactionId', '*');
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.loadAccount();
    }
  });
});
define('banker/routes/banks/bank/accounts/account/loans', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('banker/routes/banks/bank/accounts/account/loans/index', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {
      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      }
      localStorage.setItem('transactionId', '*');
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.loadLoans();
    }
  });
});
define('banker/routes/banks/bank/accounts/account/loans/loan', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('banker/routes/banks/bank/accounts/account/loans/loan/edit', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {
      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userId = sessionData.user_id;
      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      } else if (userrole == _util.role.CUSTOMER) {
        this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
        return;
      }
    }
  });
});
define('banker/routes/banks/bank/accounts/account/loans/loan/emi', ['exports', 'banker/utils/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {
            var sessionData = (0, _util.getSessionData)();

            if (!sessionData) {
                this.transitionTo('login');
                return;
            }

            var userrole = sessionData.user_role;

            if (userrole == _util.role.SUPERADMIN) {
                this.transitionTo('users');
                return;
            }
        },
        setupController: function setupController(controller, model) {
            this._super(controller, model);
            controller.loadEmis();
        }
    });
});
define('banker/routes/banks/bank/accounts/account/loans/loan/index', ['exports', 'banker/utils/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {
            var sessionData = (0, _util.getSessionData)();

            if (!sessionData) {
                this.transitionTo('login');
                return;
            }

            var userrole = sessionData.user_role;

            if (userrole == _util.role.SUPERADMIN) {
                this.transitionTo('users');
                return;
            }
        },
        setupController: function setupController(controller, model) {
            this._super(controller, model);
            controller.loadLoan();
        }
    });
});
define('banker/routes/banks/bank/accounts/account/loans/new', ['exports', 'banker/utils/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {
            var sessionData = (0, _util.getSessionData)();

            if (!sessionData) {
                this.transitionTo('login');
                return;
            }

            var userrole = sessionData.user_role;

            if (userrole == _util.role.SUPERADMIN) {
                this.transitionTo('users');
                return;
            }
        }
    });
});
define('banker/routes/banks/bank/accounts/account/transactions', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('banker/routes/banks/bank/accounts/account/transactions/index', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {
      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      }
      localStorage.setItem('loanId', '*');
      localStorage.setItem('transactionId', '*');
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.loadTransactions();
    }
  });
});
define('banker/routes/banks/bank/accounts/account/transactions/new', ['exports', 'banker/utils/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {
            var sessionData = (0, _util.getSessionData)();

            if (!sessionData) {
                this.transitionTo('login');
                return;
            }

            var userrole = sessionData.user_role;

            if (userrole == _util.role.SUPERADMIN) {
                this.transitionTo('users');
                return;
            }
        }
    });
});
define('banker/routes/banks/bank/accounts/account/transactions/transaction', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {

      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      }
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.loadTransaction();
    }
  });
});
define('banker/routes/banks/bank/accounts/index', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    branchSelection: Ember.inject.service('branch-select'),
    beforeModel: function beforeModel() {
      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      }

      localStorage.setItem('transactionId', '*');
      localStorage.setItem('accNo', '*');
      if (userrole != _util.role.MANAGER) {
        localStorage.setItem('branchId', '*');
      }
      localStorage.setItem('loanId', '*');
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.loadAccounts();
    }
  });
});
define('banker/routes/banks/bank/accounts/new', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {

      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('super-admin-login');
        return;
      }

      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      }
    }
  });
});
define('banker/routes/banks/bank/branches', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('banker/routes/banks/bank/branches/branch', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('banker/routes/banks/bank/branches/branch/edit', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {
      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userId = sessionData.user_id;
      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      } else if (userrole == _util.role.CUSTOMER || userrole == _util.role.MANAGER) {

        this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
        return;
      }
    }
  });
});
define('banker/routes/banks/bank/branches/branch/index', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {
      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userId = sessionData.user_id;
      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      } else if (userrole == _util.role.CUSTOMER) {

        this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
        return;
      }
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.loadBranch();
    }
  });
});
define('banker/routes/banks/bank/branches/index', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {

      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userId = sessionData.user_id;
      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      } else if (userrole == _util.role.CUSTOMER || userrole == _util.role.MANAGER) {

        this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
        return;
      }

      localStorage.setItem('accNo', '*');
      localStorage.setItem('loanId', '*');
      localStorage.setItem('transactionId', '*');
      localStorage.setItem('branchId', '*');
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.loadBranches();
    }
  });
});
define('banker/routes/banks/bank/branches/new', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {
      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userId = sessionData.user_id;
      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      } else if (userrole == _util.role.CUSTOMER || userrole == _util.role.MANAGER) {

        this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
        return;
      }
    }
  });
});
define('banker/routes/banks/bank/edit', ['exports', 'banker/utils/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {
            var bankId = localStorage.getItem('bankId');

            var sessionData = (0, _util.getSessionData)();

            if (!sessionData) {
                this.transitionTo('login');
                return;
            }

            var userId = sessionData.user_id;
            var userrole = sessionData.user_role;

            if (userrole == _util.role.SUPERADMIN) {
                this.transitionTo('users');
                return;
            } else if (userrole == _util.role.CUSTOMER) {

                this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
                return;
            }
        },
        setupController: function setupController(controller, model) {
            controller.loadBranches();
        }
    });
});
define('banker/routes/banks/bank/index', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {

      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      localStorage.setItem('accNo', '*');
      localStorage.setItem('loanId', '*');
      localStorage.setItem('transactionId', '*');
      if (sessionData.user_role != _util.role.MANAGER) {
        localStorage.setItem('branchId', '*');
      }
    },
    setupController: function setupController(controller, model) {
      controller.loadBanks();
    }
  });
});
define('banker/routes/banks/bank/loans', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('banker/routes/banks/bank/loans/index', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {

      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      }

      localStorage.setItem('accNo', '*');
      localStorage.setItem('loanId', '*');
      localStorage.setItem('transactionId', '*');
      if (sessionData.user_role != 'MANAGER') {
        localStorage.setItem('branchId', '*');
      }
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.loadLoans();
    }
  });
});
define('banker/routes/banks/bank/loans/loan', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('banker/routes/banks/bank/loans/loan/edit', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {

      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userId = sessionData.user_id;
      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      } else if (userrole == _util.role.CUSTOMER) {

        this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
        return;
      }
    }
  });
});
define('banker/routes/banks/bank/loans/loan/emi', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {

      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      }
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.loadEmis();
    }
  });
});
define('banker/routes/banks/bank/loans/loan/index', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {

      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      }
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.loadLoan();
    }
  });
});
define('banker/routes/banks/bank/loans/new', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {

      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      }
    }
  });
});
define('banker/routes/banks/bank/transactions', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('banker/routes/banks/bank/transactions/index', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {

      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      }

      localStorage.setItem('accNo', '*');
      localStorage.setItem('loanId', '*');
      localStorage.setItem('transactionId', '*');
      if (sessionData.user_role != _util.role.MANAGER) {
        localStorage.setItem('branchId', '*');
      }
    },
    setupController: function setupController(controller, model) {

      this._super(controller, model);
      controller.loadTransactions();
    }
  });
});
define('banker/routes/banks/bank/transactions/new', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {

      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      }
    }
  });
});
define('banker/routes/banks/bank/transactions/transaction', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {

      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      }
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.loadTransaction();
    }
  });
});
define('banker/routes/banks/bank/users', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('banker/routes/banks/bank/users/index', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {
      var bankId = localStorage.getItem('bankId');

      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }
      var userId = sessionData.user_id;
      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      } else {
        this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
      }
    }
  });
});
define('banker/routes/banks/bank/users/user', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('banker/routes/banks/bank/users/user/dashboard', ['exports', 'banker/utils/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {

            var sessionData = (0, _util.getSessionData)();

            if (!sessionData) {
                this.transitionTo('login');
                return;
            }
            var userrole = sessionData.user_role;

            if (userrole == _util.role.SUPERADMIN) {
                this.transitionTo('users');
                return;
            }
        },
        setupController: function setupController(controller, model) {
            var userrole = (0, _util.getSessionData)().user_role;

            if (userrole == _util.role.ADMIN) {
                controller.fetchAdminDashboard();
            } else if (userrole == _util.role.MANAGER) {
                controller.fetchManagerDashboard();
            } else {
                controller.fetchCustomerDashboard();
            }
        }
    });
});
define('banker/routes/banks/bank/users/user/index', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {

      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('login');
        return;
      }

      var userId = sessionData.user_id;
      var userrole = sessionData.user_role;

      if (userrole == _util.role.SUPERADMIN) {
        this.transitionTo('users');
        return;
      } else {
        this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
      }
    }
  });
});
define('banker/routes/banks/index', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {
      var bankId = localStorage.getItem('bankId');

      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('super-admin-login');
        return;
      }

      var userId = sessionData.user_id;
      var userrole = sessionData.user_role;

      if (userrole !== _util.role.SUPERADMIN) {
        this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
        return;
      }

      localStorage.setItem('bankId', '*');
      localStorage.setItem('accNo', '*');
      localStorage.setItem('loanId', '*');
      localStorage.setItem('userId', '*');
      localStorage.setItem('transactionId', '*');
      localStorage.setItem('branchId', '*');
    },
    setupController: function setupController(controller, model) {
      controller.loadBanks();
    }
  });
});
define('banker/routes/banks/new', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {
      var bankId = localStorage.getItem('bankId');

      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('super-admin-login');
        return;
      }

      var userId = sessionData.user_id;
      var userrole = sessionData.user_role;

      if (userrole !== _util.role.SUPERADMIN) {
        this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
        return;
      }
    },
    setupController: function setupController(controller, model) {
      controller.loadAdmins();
    }
  });
});
define('banker/routes/login', ['exports', 'banker/utils/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {
            var sessionData = (0, _util.getSessionData)();
            if (document.cookie != '') {
                this.transitionTo('banks.bank.users.user.dashboard', localStorage.getItem('bankId'), sessionData.user_id);
            }
        }
    });
});
define('banker/routes/register', ['exports', 'banker/utils/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {
            var sessionData = (0, _util.getSessionData)();
            if (document.cookie != '') {
                this.transitionTo('banks.bank.users.user.dashboard', localStorage.getItem('bankId'), sessionData.user_id);
            }
        }
    });
});
define('banker/routes/super-admin-login', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {
            if (document.cookie != '') {
                this.transitionTo('users');
            }
            localStorage.setItem('bankId', "*");
        }
    });
});
define('banker/routes/users/index', ['exports', 'banker/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {
      var bankId = localStorage.getItem('bankId');

      var sessionData = (0, _util.getSessionData)();

      if (!sessionData) {
        this.transitionTo('super-admin-login');
        return;
      }

      var userId = sessionData.user_id;
      var userrole = sessionData.user_role;

      if (userrole !== _util.role.SUPERADMIN) {
        this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
        return;
      }

      localStorage.setItem('accNo', '*');
      localStorage.setItem('loanId', '*');
      localStorage.setItem('transactionId', '*');
      localStorage.setItem('branchId', '*');
      localStorage.setItem('bankId', "*");
      localStorage.setItem('userId', "*");
    },
    setupController: function setupController(controller, model) {
      controller.loadUsers();
    }
  });
});
define('banker/routes/users/user', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('banker/routes/users/user/edit', ['exports', 'banker/utils/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {

            var bankId = localStorage.getItem('bankId');

            var sessionData = (0, _util.getSessionData)();

            if (!sessionData) {
                this.transitionTo('super-admin-login');
                return;
            }

            var userId = sessionData.user_id;
            var userrole = sessionData.user_role;

            if (userrole !== _util.role.SUPERADMIN) {
                this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
                return;
            }
        }
    });
});
define('banker/routes/users/user/index', ['exports', 'banker/utils/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {

            var bankId = localStorage.getItem('bankId');

            var sessionData = (0, _util.getSessionData)();

            if (!sessionData) {
                this.transitionTo('super-admin-login');
                return;
            }

            var userId = sessionData.user_id;
            var userrole = sessionData.user_role;

            if (userrole !== _util.role.SUPERADMIN) {
                this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
                return;
            }
        },
        setupController: function setupController(controller, model) {
            controller.loadUser();
        }
    });
});
define('banker/services/accounts', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    ajax: Ember.inject.service(),

    fetchAccounts: function fetchAccounts(bankid) {
      var url = 'http://localhost:8080/banker/api/v1/';
      var branchId = localStorage.getItem("branchId");
      var bankId = localStorage.getItem('bankId');
      if (bankId != "*") {
        url = url + ('banks/' + bankId);
      }
      if (branchId != '*') {
        url = url + ('/branches/' + branchId);
      }
      url = url + '/accounts';

      return Ember.$.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          console.log("accounts");
          return response;
        },
        error: function error(_error) {

          console.error("Error fetching accounts:", _error);
          if (_error.responseJSON) {
            alert('Error: ' + _error.responseJSON.message);
          } else {
            alert("An error occurred while fetching accounts.");
          }
          throw _error.responseJSON || _error;
        }
      });
    },
    fetchActiveAccounts: function fetchActiveAccounts(bankid) {
      var url = 'http://localhost:8080/banker/api/v1/';
      var branchId = localStorage.getItem("branchId");
      var bankId = localStorage.getItem('bankId');
      if (bankId != "*") {
        url = url + ('banks/' + bankId);
      }
      if (branchId != '*') {
        url = url + ('/branches/' + branchId);
      }
      url = url + '/accounts?acc_status=1';

      return Ember.$.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          console.log("accounts");
          return response;
        },
        error: function error(_error2) {
          console.error("Error fetching accounts:", _error2);
          if (_error2.responseJSON) {
            alert('Error: ' + _error2.responseJSON.message);
          } else {
            alert("An error occurred while fetching accounts.");
          }
          throw _error2.responseJSON || _error2;
        }
      });
    },
    fetchAccount: function fetchAccount(bankid) {
      var url = 'http://localhost:8080/banker/api/v1/';
      var bankId = localStorage.getItem('bankId');
      var branchId = localStorage.getItem("branchId");
      var accNo = localStorage.getItem('accNo');
      if (bankId != "*") {
        url = url + ('banks/' + bankId);
      }
      if (branchId != '*') {
        url = url + ('/branches/' + branchId);
      }
      if (accNo != "*") {
        url = url + ('/accounts/' + accNo);
      }

      return Ember.$.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          return response;
        },
        error: function error(_error3) {
          console.error("Error fetching account:", _error3);
          if (_error3.responseJSON) {
            alert('Error: ' + _error3.responseJSON.message);
          } else {
            alert("An error occurred while fetching account.");
          }
          throw _error3.responseJSON || _error3;
        }
      });
    },
    createAccount: function createAccount(accountDetails) {
      var bankId = localStorage.getItem('bankId');
      var acc_type = accountDetails.acc_type,
          acc_status = accountDetails.acc_status,
          username = accountDetails.username;

      var url = 'http://localhost:8080/banker/api/v1/';
      var branchId = localStorage.getItem("branchId");
      if (bankId != "*") {
        url = url + ('banks/' + bankId);
      }
      if (branchId != '*') {
        url = url + ('/branches/' + branchId);
      }
      url = url + '/accounts';

      return Ember.$.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          acc_type: acc_type,
          username: username,
          acc_status: acc_status
        }),

        success: function success(response) {
          return response;
        },
        error: function error(_error4) {
          // console.log("insert...err");
          if (_error4.responseJSON) {
            alert('Error: ' + _error4.responseJSON.message);
          } else {
            alert("An error occurred while creating account.");
          }
          throw _error4.responseJSON || _error4;
        }
      });
    },
    updateAccount: function updateAccount(accountDetails) {
      var acc_type = accountDetails.acc_type,
          acc_status = accountDetails.acc_status,
          fullname = accountDetails.fullname,
          username = accountDetails.username;


      var url = 'http://localhost:8080/banker/api/v1/';
      var bankId = localStorage.getItem('bankId');
      var branchId = localStorage.getItem("branchId");
      var accNo = localStorage.getItem('accNo');
      if (bankId != "*") {
        url = url + ('banks/' + bankId);
      }
      if (branchId != '*') {
        url = url + ('/branches/' + branchId);
      }
      if (accNo != "*") {
        url = url + ('/accounts/' + accNo);
      }

      return Ember.$.ajax({
        url: url,
        type: 'PUT',
        contentType: 'application/json',

        data: JSON.stringify({

          acc_type: acc_type,
          fullname: fullname,
          acc_status: acc_status,
          username: username
        }),
        success: function success(response) {
          return response;
        },
        error: function error(_error5) {
          if (_error5.responseJSON) {
            alert('Error: ' + _error5.responseJSON.message);
          } else {
            alert("An error occurred while updating account.");
          }
          throw _error5.responseJSON || _error5;
        }
      });
    }
  });
});
define('banker/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define('banker/services/banks', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    ajax: Ember.inject.service(),
    fetchBanks: function fetchBanks() {

      return Ember.$.ajax({
        url: 'http://localhost:8080/banker/api/v1/banks',
        type: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          // console.log("banks");
          return response;
        },
        error: function error(_error) {
          console.error("Error fetching banks:", _error);
          if (_error.responseJSON) {
            alert('Error: ' + _error.responseJSON.message);
          } else {
            alert("An error occurred while fetching banks.");
          }
          throw _error.responseJSON || _error;
        }
      });
    },
    fetchBank: function fetchBank(bankid) {
      var bankId = localStorage.getItem('bankId');
      var url = 'http://localhost:8080/banker/api/v1/';
      if (bankId != "*") {
        url = url + ('banks/' + bankId);
      }

      return Ember.$.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          // console.log("banks");
          return response;
        },
        error: function error(_error2) {
          console.error("Error fetching banks:", _error2);
          if (_error2.responseJSON) {
            alert('Error: ' + _error2.responseJSON.message);
          } else {
            alert("An error occurred while fetching banks.");
          }
          throw _error2.responseJSON || _error2;
        }
      });
    },
    updateBank: function updateBank(main_branch_id, bankData) {
      var bankId = localStorage.getItem("bankId");
      var url = 'http://localhost:8080/banker/api/v1/';
      if (bankId != '*') {
        url = url + ('banks/' + bankId);
      }
      return Ember.$.ajax({
        url: url,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
          bank_name: bankData.bank_name,
          admin_id: bankData.admin_id,
          main_branch_id: main_branch_id

        }),
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          // alert('Bank updated successfully!');
          return response;
        },
        error: function error(_error3) {
          console.error("Error updating bank:", _error3);
          if (_error3.responseJSON) {
            alert('Error: ' + _error3.responseJSON.message);
          } else {
            alert("An error occurred while updating the bank.");
          }
          throw _error3.responseJSON || _error3;
        }
      });
    },
    createBank: function createBank(bankDetails) {
      var bank_name = bankDetails.bank_name,
          bank_code = bankDetails.bank_code,
          admin_id = bankDetails.admin_id;

      var url = 'http://localhost:8080/banker/api/v1/banks';
      // console.log("insert...");
      return Ember.$.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          bank_name: bank_name,
          bank_code: bank_code,
          admin_id: admin_id
        }),
        success: function success(response) {
          return response;
        },
        error: function error(_error4) {
          console.log("insert...err");
          throw _error4.responseJSON || _error4;
        }
      });
    }
  });
});
define('banker/services/branch-select', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend(Ember.Evented, {
    selectedBranchId: null,

    init: function init() {
      this._super.apply(this, arguments);
      this.set('selectedBranchId', localStorage.getItem('branchId') || this.getDefaultBranchId());
    },
    changeBranch: function changeBranch(branchId) {
      this.set('selectedBranchId', branchId);
      localStorage.setItem('branchId', branchId);
      var router = Ember.getOwner(this).lookup('router:main');
      var currentRouteName = router.get('currentRouteName');
      // console.log(currentRouteName);
      this.trigger('branchChanged', branchId, currentRouteName);
    },
    getDefaultBranchId: function getDefaultBranchId() {
      return '-1';
    }
  });
});
define('banker/services/branches', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    ajax: Ember.inject.service(),
    branchId: '',

    fetchBranches: function fetchBranches(bankid) {
      var bankId = localStorage.getItem('bankId');
      var url = 'http://localhost:8080/banker/api/v1/';
      if (bankId != "*") {
        url = url + ('banks/' + bankId);
      }

      url = url + '/branches';
      return Ember.$.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          console.log("branches");
          return response;
        },
        error: function error(_error) {
          console.error("Error fetching branches:", _error);
          if (_error.responseJSON) {
            alert('Error: ' + _error.responseJSON.message);
          } else {
            alert("An error occurred while fetching branches.");
          }
          throw _error.responseJSON || _error;
        }
      });
    },
    fetchBranch: function fetchBranch(bankid) {
      var bankId = localStorage.getItem('bankId');
      var url = 'http://localhost:8080/banker/api/v1/';
      var branchId = localStorage.getItem('branchId');
      if (bankId != "*") {
        url = url + ('banks/' + bankId);
      }
      if (branchId != "*") {
        url = url + ('/branches/' + branchId);
      }

      return Ember.$.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          return response;
        },
        error: function error(_error2) {
          console.error("Error fetching branch:", _error2);
          if (_error2.responseJSON) {
            alert('Error: ' + _error2.responseJSON.message);
          } else {
            alert("An error occurred while fetching branch.");
          }
          throw _error2.responseJSON || _error2;
        }
      });
    },
    createBranch: function createBranch(branchDetails) {
      var bankId = localStorage.getItem('bankId');
      var name = branchDetails.name,
          address = branchDetails.address,
          manager_id = branchDetails.manager_id;

      var url = 'http://localhost:8080/banker/api/v1/';
      if (bankId != "*") {
        url = url + ('banks/' + bankId);
      }

      url = url + '/branches';
      console.log("insert...");
      return Ember.$.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          branch_name: name,
          branch_address: address,
          manager_id: manager_id
        }),
        success: function success(response) {
          return response;
        },
        error: function error(_error3) {
          console.log("insert...err");
          throw _error3.responseJSON || _error3;
        }
      });
    },
    updateBranch: function updateBranch(branchDetails) {
      var bankId = localStorage.getItem('bankId');
      var branchId = branchDetails.branchId,
          name = branchDetails.name,
          address = branchDetails.address,
          manager_id = branchDetails.manager_id;

      var url = 'http://localhost:8080/banker/api/v1/';
      if (bankId != "*") {
        url = url + ('banks/' + bankId);
      }

      if (branchId != '*') {
        url = url + ('/branches/' + branchId);
      }
      return Ember.$.ajax({
        url: url,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
          branch_name: name,
          branch_address: address,
          manager_id: manager_id
        }),
        success: function success(response) {
          return response;
        },
        error: function error(_error4) {
          throw _error4.responseJSON || _error4;
        }
      });
    },
    deleteBranch: function deleteBranch(bankid, branch_id) {
      var bankId = localStorage.getItem('bankId');
      var url = 'http://localhost:8080/banker/api/v1/';
      if (bankId != "*") {
        url = url + ('banks/' + bankId);
      }

      if (branch_id != '*') {
        url = url + ('/branches/' + branch_id);
      }
      return Ember.$.ajax({
        url: url,
        type: 'DELETE',
        contentType: 'application/json',
        success: function success(response) {
          console.log("Branch deleted successfully");
          return response;
        },
        error: function error(_error5) {
          console.error("Error deleting branch:", _error5);
          throw _error5.responseJSON || _error5;
        }
      });
    }
  });
});
define('banker/services/dashboard', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    ajax: Ember.inject.service(),

    getSessionData: function getSessionData() {
      var value = '; ' + document.cookie;
      var parts = value.split('; sessionData=');
      if (parts.length === 2) {
        var cookieData = decodeURIComponent(parts.pop().split(';').shift());
        return JSON.parse(cookieData);
      }
      return null;
    },
    fetchCustomerDashboard: function fetchCustomerDashboard() {
      var sessionData = this.getSessionData();
      var bankId = localStorage.getItem('bankId');
      var url = 'http://localhost:8080/banker/api/v1/banks/' + bankId + '/users/' + sessionData.user_id + '/dashboard';

      return Ember.$.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          return response;
        },
        error: function error(_error) {
          console.error("Error fetching dashboard:", _error);
          if (_error.responseJSON) {
            alert('Error: ' + _error.responseJSON.message);
          } else {
            alert("An error occurred while fetching dashboard.");
          }
          throw _error.responseJSON || _error;
        }
      });
    },
    fetchAdminDashboard: function fetchAdminDashboard() {
      var sessionData = this.getSessionData();
      var bankId = localStorage.getItem('bankId');
      var url = 'http://localhost:8080/banker/api/v1/banks/' + bankId + '/users/' + sessionData.user_id + '/dashboard';

      return Ember.$.ajax({
        url: url,
        method: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          return response;
        },
        error: function error(_error2) {
          console.error("Error fetching dashboard:", _error2);
          if (_error2.responseJSON) {
            alert('Error: ' + _error2.responseJSON.message);
          } else {
            alert("An error occurred while fetching dashboard.");
          }
          throw _error2.responseJSON || _error2;
        }
      });
    },
    fetchManagerDashboard: function fetchManagerDashboard() {
      var sessionData = this.getSessionData();
      var bankId = localStorage.getItem('bankId');
      var url = 'http://localhost:8080/banker/api/v1/banks/' + bankId + '/users/' + sessionData.user_id + '/dashboard';

      return Ember.$.ajax({
        url: url,
        method: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          return response;
        },
        error: function error(_error3) {
          console.error("Error fetching dashboard:", _error3);
          if (_error3.responseJSON) {
            alert('Error: ' + _error3.responseJSON.message);
          } else {
            alert("An error occurred while fetching dashboard.");
          }
          throw _error3.responseJSON || _error3;
        }
      });
    }
  });
});
define('banker/services/emis', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Service.extend({
        ajax: Ember.inject.service(),

        fetchEmis: function fetchEmis(loanId) {
            var bankId = localStorage.getItem('bankId');
            var url = 'http://localhost:8080/banker/api/v1/';

            if (bankId != "*") {
                url = url + ('banks/' + bankId);
            }

            if (loanId != '*') {
                url = url + ('/loans/' + loanId);
            }
            url = url + '/emis';
            return Ember.$.ajax({
                url: url,
                type: 'GET',
                contentType: 'application/json',
                credentials: 'include',
                xhrFields: {
                    withCredentials: true
                },
                success: function success(response) {
                    return response;
                },
                error: function error(_error) {
                    console.error("Error fetching EMIs:", _error);
                    if (_error.responseJSON) {
                        alert('Error: ' + _error.responseJSON.message);
                    } else {
                        alert("An error occurred while fetching EMIs.");
                    }
                    throw _error.responseJSON || _error;
                }
            });
        },
        makePayment: function makePayment(emiId) {
            var bankId = localStorage.getItem('bankId');
            var loanId = localStorage.getItem('loanId');
            var url = 'http://localhost:8080/banker/api/v1/';

            if (bankId != "*") {
                url = url + ('banks/' + bankId);
            }

            if (loanId != '*') {
                url = url + ('/loans/' + loanId + '/emis');
            }
            return Ember.$.ajax({
                url: url,
                type: 'POST',
                contentType: 'application/json',
                credentials: 'include',
                xhrFields: {
                    withCredentials: true
                },
                success: function success(response) {
                    return response;
                },
                error: function error(_error2) {
                    console.error("Error making payment:", _error2);
                    if (_error2.responseJSON) {
                        alert('Error: ' + _error2.responseJSON.message);
                    } else {
                        alert("An error occurred while making the payment.");
                    }
                    throw _error2.responseJSON || _error2;
                }
            });
        }
    });
});
define('banker/services/loans', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({

    ajax: Ember.inject.service(),

    fetchLoans: function fetchLoans(accNo, bankid) {
      var url = 'http://localhost:8080/banker/api/v1/';
      var bankId = localStorage.getItem("bankId");
      var branchId = localStorage.getItem("branchId");
      var accno = localStorage.getItem('accNo');
      if (bankId != "*") {
        url = url + ('banks/' + bankId);
      }
      if (branchId != '*') {
        url = url + ('/branches/' + branchId);
      }
      if (accno != "*") {
        url = url + ('/accounts/' + accno);
      }
      url = url + '/loans';
      return Ember.$.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          console.log("loans");
          return response;
        },
        error: function error(_error) {
          console.error("Error fetching loans:", _error);
          if (_error.responseJSON) {
            alert('Error: ' + _error.responseJSON.message);
          } else {
            alert("An error occurred while fetching loans.");
          }
          throw _error.responseJSON || _error;
        }
      });
    },
    fetchLoan: function fetchLoan(accNo, bankid) {
      var bankId = localStorage.getItem("bankId");
      var url = 'http://localhost:8080/banker/api/v1/';
      var branchId = localStorage.getItem("branchId");
      var accno = localStorage.getItem('accNo');
      var loanId = localStorage.getItem('loanId');
      if (bankId != "*") {
        url = url + ('banks/' + bankId);
      }
      if (branchId != '*') {
        url = url + ('/branches/' + branchId);
      }
      if (accno != "*") {
        url = url + ('/accounts/' + accno);
      }
      if (loanId != "*") {
        url = url + ('/loans/' + loanId);
      }
      return Ember.$.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          return response;
        },
        error: function error(_error2) {
          console.error("Error fetching loan:", _error2);
          if (_error2.responseJSON) {
            alert('Error: ' + _error2.responseJSON.message);
          } else {
            alert("An error occurred while fetching loan.");
          }
          throw _error2.responseJSON || _error2;
        }
      });
    },
    createLoan: function createLoan(Details) {
      var loan_type = Details.loan_type,
          loan_status = Details.loan_status,
          loan_duration = Details.loan_duration,
          loan_amount = Details.loan_amount;

      var url = 'http://localhost:8080/banker/api/v1/';
      var bankId = localStorage.getItem("bankId");
      var branchid = localStorage.getItem("branchId");
      var accno = Details.accNo;
      if (bankId != "*") {
        url = url + ('banks/' + bankId);
      }
      if (branchid != '*') {
        url = url + ('/branches/' + branchid);
      }
      if (accno != "*") {
        url = url + ('/accounts/' + accno);
      }
      url = url + '/loans';
      console.log("insert...");
      return Ember.$.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({

          loan_type: loan_type,
          loan_amount: loan_amount,
          loan_duration: loan_duration,
          loan_status: loan_status

        }),

        success: function success(response) {
          return response;
        },
        error: function error(_error3) {
          // console.log("insert...err");
          if (_error3.responseJSON) {
            alert('Error: ' + _error3.responseJSON.message);
          } else {
            alert("An error occurred while creating loan.");
          }
          throw _error3.responseJSON || _error3;
        }
      });
    },
    updateLoan: function updateLoan(loanDetails) {
      var loan_type = loanDetails.loan_type,
          loan_status = loanDetails.loan_status,
          loan_duration = loanDetails.loan_duration,
          loan_amount = loanDetails.loan_amount,
          loan_id = loanDetails.loan_id;

      var url = 'http://localhost:8080/banker/api/v1/';
      var bankId = localStorage.getItem("bankId");
      var branchid = localStorage.getItem("branchId");
      var accno = localStorage.getItem('accNo');
      if (bankId != "*") {
        url = url + ('banks/' + bankId);
      }
      if (branchid != '*') {
        url = url + ('/branches/' + branchid);
      }
      if (accno != "*") {
        url = url + ('/accounts/' + accno);
      }
      if (loan_id != "*") {

        url = url + ('/loans/' + loan_id);
      }
      return Ember.$.ajax({
        url: url,
        type: 'PUT',
        contentType: 'application/json',

        data: JSON.stringify({

          loan_type: loan_type,
          loan_amount: loan_amount,
          loan_duration: loan_duration,
          loan_status: loan_status
        }),
        success: function success(response) {
          return response;
        },
        error: function error(_error4) {
          if (_error4.responseJSON) {
            alert('Error: ' + _error4.responseJSON.message);
          } else {
            alert("An error occurred while updating loan.");
          }
          throw _error4.responseJSON || _error4;
        }
      });
    }
  });
});
define('banker/services/notify', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    message: '',
    type: '',
    isNotificationVisible: false,

    showNotification: function showNotification(message, type) {
      this.set('message', message);
      this.set('type', type);
      this.set('isNotificationVisible', true);

      Ember.run.later(this, function () {
        this.clearNotification();
      }, 2000);
    },
    clearNotification: function clearNotification() {
      this.set('isNotificationVisible', false);
      this.set('message', '');
      this.set('type', '');
    }
  });
});
define('banker/services/session', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    ajax: Ember.inject.service(),

    login: function login(credentials) {
      var bankId = localStorage.getItem('bankId');
      var username = credentials.username,
          password = credentials.password,
          isSuperAdmin = credentials.isSuperAdmin;

      // console.log(credentials);

      var url = 'http://localhost:8080/banker/api/v1/auth?action=login';
      if (isSuperAdmin) {
        url = url + '&isSuperAdmin=true';
      }
      return Ember.$.ajax({
        url: url,
        type: 'POST',
        credentials: 'include',
        contentType: 'application/json',
        data: JSON.stringify({ username: username, password: password, bank_id: bankId }),
        xhrFields: {
          withCredentials: true
        },
        success: function success(response, txtStatus, xhr) {
          console.log(xhr);
          return response;
        },
        error: function error(_error) {
          alert("Invalid credentials!!");
          throw _error.responseJSON || _error;
        }
      });
    },
    signup: function signup(credentials) {
      var username = credentials.username,
          password = credentials.password,
          selectedRole = credentials.selectedRole,
          name = credentials.name,
          dob = credentials.dob,
          pno = credentials.pno,
          addr = credentials.addr;

      // console.log(credentials+'signup');

      return Ember.$.ajax({
        url: 'http://localhost:8080/banker/api/v1/auth?action=register',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          username: username,
          password: password,
          user_role: selectedRole,
          full_name: name,
          date_of_birth: dob,
          user_phonenumber: pno,
          user_address: addr
        }),
        success: function success(response) {
          return response;
        },
        error: function error(_error2) {
          alert("Error:" + _error2.responseJSON.message);
          throw _error2.responseJSON || _error2;
        }
      });
    },
    logout: function logout() {

      return Ember.$.ajax({
        url: 'http://localhost:8080/banker/api/v1/auth?action=logout',
        type: 'GET',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          document.cookie = document.cookie + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          return response;
        },
        error: function error(_error3) {
          throw _error3.responseJSON || _error3;
        }
      });
    }
  });
});
define('banker/services/transactions', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({

    ajax: Ember.inject.service(),

    fetchTransactions: function fetchTransactions(accNo, bankid) {
      var url = 'http://localhost:8080/banker/api/v1/';
      var bankId = localStorage.getItem('bankId');
      var branchId = localStorage.getItem("branchId");
      var accno = localStorage.getItem('accNo');
      if (bankId != "*") {
        url = url + ('banks/' + bankId);
      }
      if (branchId != '*') {
        url = url + ('/branches/' + branchId);
      }
      if (accno != "*") {
        url = url + ('/accounts/' + accno);
      }
      url = url + '/transactions';

      return Ember.$.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          console.log("transactions");
          return response;
        },
        error: function error(_error) {
          console.error("Error fetching transactions:", _error);
          if (_error.responseJSON) {
            alert('Error: ' + _error.responseJSON.message);
          } else {
            alert("An error occurred while fetching transactions.");
          }
          throw _error.responseJSON || _error;
        }
      });
    },
    fetchTransaction: function fetchTransaction() {
      var transactionId = localStorage.getItem("transactionId");
      var url = 'http://localhost:8080/banker/api/v1/';
      var bankId = localStorage.getItem('bankId');
      var branchId = localStorage.getItem("branchId");
      var accno = localStorage.getItem('accNo');
      if (bankId != "*") {
        url = url + ('banks/' + bankId);
      }
      if (branchId != '*') {
        url = url + ('/branches/' + branchId);
      }
      if (accno != "*") {
        url = url + ('/accounts/' + accno);
      }
      if (transactionId != "*") {

        url = url + ('/transactions/' + transactionId);
      }

      return Ember.$.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          console.log("transactions");
          return response;
        },
        error: function error(_error2) {
          console.error("Error fetching transactions:", _error2);
          if (_error2.responseJSON) {
            alert('Error: ' + _error2.responseJSON.message);
          } else {
            alert("An error occurred while fetching transactions.");
          }
          throw _error2.responseJSON || _error2;
        }
      });
    },
    createTransaction: function createTransaction(details) {

      var url = 'http://localhost:8080/banker/api/v1/';
      var bankId = details.bankId;
      var branchId = details.branchId;
      var accno = details.accNo;
      if (bankId != "*") {
        url = url + ('banks/' + bankId);
      }
      if (branchId != '*') {
        url = url + ('/branches/' + branchId);
      }
      if (accno != "*") {
        url = url + ('/accounts/' + accno);
      }
      url = url + '/transactions';

      return Ember.$.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          transaction_type: details.transaction_type,
          transaction_amount: details.transaction_amount,
          acc_number: details.accNo
        }),
        success: function success(response) {
          console.log("transactions");
          return response;
        },
        error: function error(_error3) {
          // console.log("insert...err");
          if (_error3.responseJSON) {
            alert('Error: ' + _error3.responseJSON.message);
          } else {
            alert("An error occurred while inserting transactions.");
          }
          throw _error3.responseJSON || _error3;
        }
      });
    }
  });
});
define('banker/services/users', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    ajax: Ember.inject.service(),
    fetchUsers: function fetchUsers(bankid) {
      var bankId = localStorage.getItem('bankId');
      var userId = localStorage.getItem('userId');
      var url = 'http://localhost:8080/banker/api/v1';
      if (bankId != "*") {
        url = url + ('/banks/' + bankId);
      }

      url = url + '/users';
      if (userId != "*") {
        url = url + ('/' + userId);
      }

      return Ember.$.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          return response;
        },
        error: function error(_error) {
          console.error("Error fetching users:", _error);
          if (_error.responseJSON) {
            alert('Error: ' + _error.responseJSON.message);
          } else {
            alert("An error occurred while fetching users.");
          }
          throw _error.responseJSON || _error;
        }
      });
    },
    fetchManagers: function fetchManagers() {
      var bankId = localStorage.getItem('bankId');
      var url = 'http://localhost:8080/banker/api/v1';
      if (bankId != "*") {
        url = url + ('/banks/' + bankId);
      }

      url = url + '/users?filter_manager=true';

      return Ember.$.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          return response;
        },
        error: function error(_error2) {
          console.error("Error fetching managers:", _error2);
          if (_error2.responseJSON) {
            alert('Error: ' + _error2.responseJSON.message);
          } else {
            alert("An error occurred while fetching managers.");
          }
          throw _error2.responseJSON || _error2;
        }
      });
    },
    fetchAdmins: function fetchAdmins() {
      var bankId = localStorage.getItem('bankId');
      var url = 'http://localhost:8080/banker/api/v1';
      if (bankId != "*") {
        url = url + ('/banks/' + bankId);
      }

      url = url + '/users?filter_admin=true';

      return Ember.$.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          return response;
        },
        error: function error(_error3) {
          console.error("Error fetching admins:", _error3);
          if (_error3.responseJSON) {
            alert('Error: ' + _error3.responseJSON.message);
          } else {
            alert("An error occurred while fetching admins.");
          }
          throw _error3.responseJSON || _error3;
        }
      });
    },
    deleteUser: function deleteUser(userId) {
      var bankId = localStorage.getItem('bankId');
      var url = 'http://localhost:8080/banker/api/v1';
      if (bankId != "*") {
        url = url + ('/banks/' + bankId);
      }
      if (userId != "*") {
        url = url + ('/users/' + userId);
      }

      return Ember.$.ajax({
        url: url,
        type: 'DELETE',
        contentType: 'application/json',
        success: function success(response) {
          console.log("user deleted successfully");
          return response;
        },
        error: function error(_error4) {
          console.error("Error deleting user:", _error4);
          throw _error4.responseJSON || _error4;
        }
      });
    },
    updateUser: function updateUser(userData) {
      var userId = localStorage.getItem('userId');
      var url = 'http://localhost:8080/banker/api/v1';
      var bankId = localStorage.getItem('bankId');
      if (bankId != "*") {
        url = url + ('/banks/' + bankId);
      }
      if (userId != "*") {
        url = url + ('/users/' + userId);
      }
      return Ember.$.ajax({
        url: url,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({

          user_status: userData.user_status
        }),
        success: function success(response) {
          return response;
        },
        error: function error(_error5) {
          throw _error5.responseJSON || _error5;
        }
      });
    }
  });
});
define("banker/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "nxILoI70", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"container\"],[13],[0,\"\\n\"],[6,[\"unless\"],[[28,[\"isAuthRoute\"]]],null,{\"statements\":[[0,\"\\n    \"],[1,[33,[\"nav-bar\"],null,[[\"logout\",\"toAccounts\",\"todashboard\",\"toBranch\",\"toBranches\",\"toTransactions\",\"toLoans\",\"toBank\",\"toBanks\",\"toUsers\"],[[33,[\"action\"],[[28,[null]],\"logout\"],null],[33,[\"action\"],[[28,[null]],\"toAccounts\"],null],[33,[\"action\"],[[28,[null]],\"todashboard\"],null],[33,[\"action\"],[[28,[null]],\"toBranch\"],null],[33,[\"action\"],[[28,[null]],\"toBranches\"],null],[33,[\"action\"],[[28,[null]],\"toTransactions\"],null],[33,[\"action\"],[[28,[null]],\"toLoans\"],null],[33,[\"action\"],[[28,[null]],\"toBank\"],null],[33,[\"action\"],[[28,[null]],\"toBanks\"],null],[33,[\"action\"],[[28,[null]],\"toUsers\"],null]]]],false],[0,\"\\n\"]],\"locals\":[]},null],[0,\"  \"],[1,[26,[\"outlet\"]],false],[0,\"\\n\"],[14],[0,\"\\n\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/application.hbs" } });
});
define("banker/templates/banks", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "BM7BMKZk", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks.hbs" } });
});
define("banker/templates/banks/bank", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "xZPdNM0D", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank.hbs" } });
});
define("banker/templates/banks/bank/accounts", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "fK6faTLW", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/accounts.hbs" } });
});
define("banker/templates/banks/bank/accounts/account", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "VALQHMq6", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/accounts/account.hbs" } });
});
define("banker/templates/banks/bank/accounts/account/edit", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "s5FOMDG5", "block": "{\"statements\":[[1,[33,[\"account-input\"],null,[[\"isEdit\",\"accNo\",\"acc_type\",\"acc_balance\",\"acc_status\",\"username\",\"fullname\",\"branch_name\",\"branch_Id\",\"bankId\",\"userId\",\"toAccount\"],[true,[28,[null,\"accNo\"]],[28,[null,\"acc_type\"]],[28,[null,\"acc_balance\"]],[28,[null,\"acc_status\"]],[28,[null,\"username\"]],[28,[null,\"fullname\"]],[28,[null,\"branch_name\"]],[28,[null,\"branch_Id\"]],[28,[null,\"bankId\"]],[28,[null,\"userId\"]],[33,[\"action\"],[[28,[null]],\"toAccount\"],null]]]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/accounts/account/edit.hbs" } });
});
define("banker/templates/banks/bank/accounts/account/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "mtE1scgJ", "block": "{\"statements\":[[1,[33,[\"view-account\"],null,[[\"bankId\",\"branchId\",\"acc\",\"accNo\",\"toLoans\",\"toTransactions\"],[[28,[null,\"bankId\"]],[28,[\"branchId\"]],[28,[null,\"acc\"]],[28,[null,\"accNo\"]],[33,[\"action\"],[[28,[null]],\"toLoans\"],null],[33,[\"action\"],[[28,[null]],\"toTransactions\"],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/accounts/account/index.hbs" } });
});
define("banker/templates/banks/bank/accounts/account/loans", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "6GvgTOdB", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/accounts/account/loans.hbs" } });
});
define("banker/templates/banks/bank/accounts/account/loans/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "shXIbO3f", "block": "{\"statements\":[[1,[33,[\"view-loans\"],null,[[\"accNo\",\"bankId\",\"loans\",\"branchId\",\"loanId\",\"viewLoan\",\"toaddNewLoan\",\"toeditLoan\"],[[28,[\"accNo\"]],[28,[null,\"bankId\"]],[28,[null,\"loans\"]],[28,[null,\"branchId\"]],[28,[null,\"loanId\"]],[33,[\"action\"],[[28,[null]],\"viewloan\"],null],[33,[\"action\"],[[28,[null]],\"addNewLoan\"],null],[33,[\"action\"],[[28,[null]],\"editLoan\"],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/accounts/account/loans/index.hbs" } });
});
define("banker/templates/banks/bank/accounts/account/loans/loan", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "JPkaz3Fx", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/accounts/account/loans/loan.hbs" } });
});
define("banker/templates/banks/bank/accounts/account/loans/loan/edit", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "CazRpE6K", "block": "{\"statements\":[[1,[33,[\"loan-input\"],null,[[\"isEdit\",\"loan_id\",\"loan_type\",\"loan_amount\",\"loan_interest\",\"loan_duration\",\"loan_status\",\"loan_availed_date\",\"accNo\",\"branchId\",\"bankId\",\"isDirect\",\"toLoan\"],[true,[28,[null,\"loan_id\"]],[28,[null,\"loan_type\"]],[28,[null,\"loan_amount\"]],[28,[null,\"loan_interest\"]],[28,[null,\"loan_duration\"]],[28,[null,\"loan_status\"]],[28,[null,\"loan_availed_date\"]],[28,[null,\"accNo\"]],[28,[null,\"branchId\"]],[28,[null,\"bankId\"]],false,[33,[\"action\"],[[28,[null]],\"toLoan\"],null]]]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/accounts/account/loans/loan/edit.hbs" } });
});
define("banker/templates/banks/bank/accounts/account/loans/loan/emi", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "FsALyvBv", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"emi-list\"],[13],[0,\"\\n  \"],[11,\"button\",[]],[15,\"class\",\"new-emi-btn\"],[5,[\"action\"],[[28,[null]],\"addNewEmi\"]],[13],[0,\"Make Payment\"],[14],[0,\"\\n  \\n  \"],[11,\"table\",[]],[15,\"class\",\"emi-table\"],[13],[0,\"\\n    \"],[11,\"thead\",[]],[13],[0,\"\\n      \"],[11,\"tr\",[]],[13],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"EMI Number\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Transaction ID\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"To Be Paid Date\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Actual Paid Date\"],[14],[0,\"\\n      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"generatedEmis\"]]],null,{\"statements\":[[0,\"        \"],[11,\"tr\",[]],[13],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"emi\",\"emiNumber\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"emi\",\"transactionId\"]],false],[0,\"\\n           \"],[11,\"div\",[]],[16,\"class\",[34,[\"status-box \",[33,[\"if\"],[[33,[\"eq\"],[[28,[\"emi\",\"transactionId\"]],\"-\"],null],\"to-be-paid\",\"paid\"],null]]]],[13],[1,[33,[\"if\"],[[33,[\"eq\"],[[28,[\"emi\",\"transactionId\"]],\"-\"],null],\"To Be Paid\",\"Paid\"],null],false],[14],[0,\"\\n         \"],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"emi\",\"toBePaidDate\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"emi\",\"actualPaidDate\"]],false],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[\"emi\"]},null],[0,\"    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/accounts/account/loans/loan/emi.hbs" } });
});
define("banker/templates/banks/bank/accounts/account/loans/loan/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "9YlKNVZ5", "block": "{\"statements\":[[1,[33,[\"view-loan\"],null,[[\"bankId\",\"branchId\",\"loan\",\"toEmis\"],[[28,[null,\"bankId\"]],[28,[\"branchId\"]],[28,[null,\"loan\"]],[33,[\"action\"],[[28,[null]],\"toEmis\"],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/accounts/account/loans/loan/index.hbs" } });
});
define("banker/templates/banks/bank/accounts/account/loans/new", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "3GL06aX+", "block": "{\"statements\":[[1,[33,[\"loan-input\"],null,[[\"accNo\",\"branchId\",\"bankId\",\"isDirect\",\"toLoan\"],[[28,[null,\"accNo\"]],[28,[null,\"branchId\"]],[28,[null,\"bankId\"]],false,[33,[\"action\"],[[28,[null]],\"toLoan\"],null]]]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/accounts/account/loans/new.hbs" } });
});
define("banker/templates/banks/bank/accounts/account/transactions", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "H1qcN2hg", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/accounts/account/transactions.hbs" } });
});
define("banker/templates/banks/bank/accounts/account/transactions/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "RvlXeyVa", "block": "{\"statements\":[[1,[33,[\"view-transactions\"],null,[[\"accNo\",\"bankId\",\"transactions\",\"branchId\",\"transactionId\",\"viewTransaction\",\"toaddNewTransaction\"],[[28,[\"accNo\"]],[28,[null,\"bankId\"]],[28,[null,\"transactions\"]],[28,[null,\"branchId\"]],[28,[null,\"transactionId\"]],[33,[\"action\"],[[28,[null]],\"viewTransaction\"],null],[33,[\"action\"],[[28,[null]],\"addNewTransaction\"],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/accounts/account/transactions/index.hbs" } });
});
define("banker/templates/banks/bank/accounts/account/transactions/new", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "X/O9WhnA", "block": "{\"statements\":[[1,[33,[\"transaction-input\"],null,[[\"accNo\",\"branchId\",\"bankId\",\"isDirect\",\"transaction_type\",\"transaction_amount\",\"toTransaction\"],[[28,[null,\"accNo\"]],[28,[null,\"branchId\"]],[28,[null,\"bankId\"]],false,[28,[null,\"transaction_type\"]],[28,[null,\"transaction_amount\"]],[33,[\"action\"],[[28,[null]],\"toTransaction\"],null]]]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/accounts/account/transactions/new.hbs" } });
});
define("banker/templates/banks/bank/accounts/account/transactions/transaction", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "raFJWroW", "block": "{\"statements\":[[1,[33,[\"view-transaction\"],null,[[\"bankId\",\"branchId\",\"transaction\"],[[28,[null,\"bankId\"]],[28,[null,\"branchId\"]],[28,[null,\"transaction\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/accounts/account/transactions/transaction.hbs" } });
});
define("banker/templates/banks/bank/accounts/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "OtnXICsj", "block": "{\"statements\":[[1,[33,[\"view-accounts\"],null,[[\"bankId\",\"accounts\",\"branchId\",\"viewaccount\",\"toaddNewAccount\",\"toeditAccount\"],[[28,[null,\"bankId\"]],[28,[null,\"accounts\"]],[28,[null,\"branchId\"]],[33,[\"action\"],[[28,[null]],\"viewaccount\"],null],[33,[\"action\"],[[28,[null]],\"addNewAccount\"],null],[33,[\"action\"],[[28,[null]],\"editAccount\"],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/accounts/index.hbs" } });
});
define("banker/templates/banks/bank/accounts/new", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "wVRUmXlh", "block": "{\"statements\":[[1,[33,[\"account-input\"],null,[[\"bankId\",\"toAccount\"],[[28,[null,\"bankId\"]],[33,[\"action\"],[[28,[null]],\"toAccount\"],null]]]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/accounts/new.hbs" } });
});
define("banker/templates/banks/bank/branches", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "cf/KS/cW", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/branches.hbs" } });
});
define("banker/templates/banks/bank/branches/branch", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "D9WRcHTI", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/branches/branch.hbs" } });
});
define("banker/templates/banks/bank/branches/branch/edit", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Fj9VYQfC", "block": "{\"statements\":[[1,[33,[\"branch-input\"],null,[[\"isEdit\",\"address\",\"name\",\"branchId\",\"bankId\",\"branch_number\",\"manager_id\",\"manager_name\",\"toBranch\"],[true,[28,[null,\"branch_address\"]],[28,[null,\"branch_name\"]],[28,[null,\"branchId\"]],[28,[null,\"bankId\"]],[28,[null,\"branch_number\"]],[28,[null,\"manager_id\"]],[28,[null,\"manager_name\"]],[33,[\"action\"],[[28,[null]],\"toBranch\"],null]]]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/branches/branch/edit.hbs" } });
});
define("banker/templates/banks/bank/branches/branch/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "eWCCeIap", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"branch-card-wrapper\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"branch-card\"],[13],[0,\"\\n    \"],[11,\"h2\",[]],[13],[0,\"Branch Details\"],[14],[0,\"\\n   \\n    \"],[11,\"div\",[]],[15,\"class\",\"branch-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Branch Name:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"branch\",\"branch_name\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"branch-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Branch Number:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"branch\",\"branch_number\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"branch-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Address:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"branch\",\"branch_address\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"branch-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Bank Name:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"branch\",\"bank_name\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"branch-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Manager Name:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"branch\",\"manager_name\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"view-wrap\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[13],[0,\"\\n            \"],[11,\"button\",[]],[15,\"class\",\"view-btn\"],[5,[\"action\"],[[28,[null]],\"viewAccounts\",[28,[\"branch\"]]]],[13],[0,\"View Accounts\"],[14],[0,\"\\n        \"],[14],[0,\"\\n\"],[6,[\"unless\"],[[33,[\"eq\"],[[28,[\"branch\",\"branch_id\"]],[28,[\"branch\",\"main_branch_id\"]]],null]],null,{\"statements\":[[6,[\"if\"],[[33,[\"eq\"],[[28,[\"role\"]],[28,[\"userRole\",\"MANAGER\"]]],null]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[13],[0,\"\\n            \"],[11,\"button\",[]],[15,\"class\",\"view-btn\"],[5,[\"action\"],[[28,[null]],\"delete\",[28,[\"branch\"]]]],[13],[0,\"delete Branch\"],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[]},null],[0,\"    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/branches/branch/index.hbs" } });
});
define("banker/templates/banks/bank/branches/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "R3jBACKv", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"branches-list\"],[13],[0,\"\\n  \"],[11,\"button\",[]],[15,\"class\",\"new-branch-btn\"],[5,[\"action\"],[[28,[null]],\"addNewBranch\"]],[13],[0,\"New Branch\"],[14],[0,\"\\n  \\n  \"],[11,\"table\",[]],[15,\"class\",\"branches-table\"],[13],[0,\"\\n    \"],[11,\"thead\",[]],[13],[0,\"\\n      \"],[11,\"tr\",[]],[13],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Branch Name\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Branch Number\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Manager Name\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Actions\"],[14],[0,\"\\n      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"branches\"]]],null,{\"statements\":[[0,\"        \"],[11,\"tr\",[]],[13],[0,\"\\n          \"],[11,\"td\",[]],[5,[\"action\"],[[28,[null]],\"viewBranch\",[28,[\"branch\"]]]],[13],[1,[28,[\"branch\",\"branch_name\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[5,[\"action\"],[[28,[null]],\"viewBranch\",[28,[\"branch\"]]]],[13],[1,[28,[\"branch\",\"branch_number\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[5,[\"action\"],[[28,[null]],\"viewBranch\",[28,[\"branch\"]]]],[13],[1,[28,[\"branch\",\"manager_name\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[0,\"\\n            \"],[11,\"button\",[]],[5,[\"action\"],[[28,[null]],\"editBranch\",[28,[\"branch\"]]]],[13],[0,\"Edit\"],[14],[0,\"\\n\"],[6,[\"unless\"],[[33,[\"eq\"],[[28,[\"branch\",\"branch_id\"]],[28,[\"branch\",\"main_branch_id\"]]],null]],null,{\"statements\":[[0,\"            \"],[11,\"button\",[]],[5,[\"action\"],[[28,[null]],\"deleteBranch\",[28,[\"branch\"]]]],[13],[0,\"Delete\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"          \"],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[\"branch\"]},null],[0,\"    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n \"],[1,[33,[\"notify-box\"],null,[[\"message\",\"type\"],[[28,[\"notification\",\"message\"]],[28,[\"notification\",\"type\"]]]]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/branches/index.hbs" } });
});
define("banker/templates/banks/bank/branches/new", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Nbyrqh5x", "block": "{\"statements\":[[1,[33,[\"branch-input\"],null,[[\"bankId\",\"toBranch\"],[[28,[null,\"bankId\"]],[33,[\"action\"],[[28,[null]],\"toBranch\"],null]]]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/branches/new.hbs" } });
});
define("banker/templates/banks/bank/edit", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "hewm89bW", "block": "{\"statements\":[[11,\"body\",[]],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"bank-form\"],[13],[0,\"\\n    \"],[11,\"h2\",[]],[13],[0,\"Edit Bank\"],[14],[0,\"\\n    \\n    \"],[11,\"form\",[]],[5,[\"action\"],[[28,[null]],\"submitForm\"],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"bankId\"],[13],[0,\"Bank ID\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n        \"],[11,\"input\",[]],[15,\"type\",\"text\"],[15,\"id\",\"bankId\"],[16,\"value\",[26,[\"bankId\"]],null],[15,\"class\",\"form-control\"],[15,\"disabled\",\"\"],[13],[14],[0,\"\\n      \"],[14],[0,\"\\n\\n      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"branchId\"],[13],[0,\"Branch ID\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n        \"],[11,\"select\",[]],[15,\"id\",\"branchId\"],[15,\"class\",\"form-control\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"branchId\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n          \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"Select Branch\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"branches\"]]],null,{\"statements\":[[0,\"            \"],[11,\"option\",[]],[16,\"value\",[28,[\"branch\",\"branch_id\"]],null],[16,\"selected\",[33,[\"if\"],[[33,[\"eq\"],[[28,[\"branch\",\"branch_id\"]],[28,[\"bank\",\"main_branch_id\"]]],null],\"selected\"],null],null],[13],[1,[28,[\"branch\",\"branch_name\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"branch\"]},null],[0,\"        \"],[14],[0,\"\\n      \"],[14],[0,\"\\n      \\n      \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn-primary\"],[13],[0,\"Update Bank\"],[14],[0,\"\\n      \"],[11,\"button\",[]],[15,\"class\",\"btn-secondary\"],[5,[\"action\"],[[28,[null]],\"cancel\"]],[13],[0,\"Cancel\"],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[1,[33,[\"notify-box\"],null,[[\"message\",\"type\"],[[28,[\"notification\",\"message\"]],[28,[\"notification\",\"type\"]]]]],false],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/edit.hbs" } });
});
define("banker/templates/banks/bank/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "n3AwBqhR", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"bank-card-wrapper\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"bank-card\"],[13],[0,\"\\n    \"],[11,\"h2\",[]],[13],[0,\"Bank Details\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"banks\"]]],null,{\"statements\":[[0,\"     \\n    \"],[11,\"div\",[]],[15,\"class\",\"bank-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Bank Name:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"bank\",\"bank_name\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"bank-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Bank Code:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"bank\",\"bank_code\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n     \"],[11,\"div\",[]],[15,\"class\",\"bank-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Bank Admin:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"bank\",\"admin_name\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n   \\n     \"],[11,\"div\",[]],[15,\"class\",\"bank-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Main Branch Name:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"branch\",\"branch_name\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n     \"],[11,\"div\",[]],[15,\"class\",\"bank-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Main Branch Address:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"branch\",\"branch_address\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n\"],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"role\"]],[28,[\"userRole\",\"ADMIN\"]]],null]],null,{\"statements\":[[0,\"    \\n      \"],[11,\"div\",[]],[15,\"class\",\"view-wrap\"],[13],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"view-btn\"],[5,[\"action\"],[[28,[null]],\"updateMainBranch\",[28,[\"bank\"]]]],[13],[0,\"Update Main Branch\"],[14],[0,\"\\n      \"],[14],[0,\"\\n    \\n\"]],\"locals\":[]},null]],\"locals\":[\"bank\"]},null],[0,\"  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/index.hbs" } });
});
define("banker/templates/banks/bank/loans", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "xKCT9FUw", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/loans.hbs" } });
});
define("banker/templates/banks/bank/loans/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "wTjJa3bq", "block": "{\"statements\":[[1,[33,[\"view-loans\"],null,[[\"accNo\",\"bankId\",\"loans\",\"branchId\",\"loanId\",\"viewLoan\",\"toaddNewLoan\",\"toeditLoan\"],[[28,[\"accNo\"]],[28,[null,\"bankId\"]],[28,[null,\"loans\"]],[28,[null,\"branchId\"]],[28,[null,\"loanId\"]],[33,[\"action\"],[[28,[null]],\"viewloan\"],null],[33,[\"action\"],[[28,[null]],\"addNewLoan\"],null],[33,[\"action\"],[[28,[null]],\"editLoan\"],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/loans/index.hbs" } });
});
define("banker/templates/banks/bank/loans/loan", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "6v9/r6Fn", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/loans/loan.hbs" } });
});
define("banker/templates/banks/bank/loans/loan/edit", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "VLHqbdEf", "block": "{\"statements\":[[1,[33,[\"loan-input\"],null,[[\"isEdit\",\"loan_id\",\"loan_type\",\"loan_amount\",\"loan_interest\",\"loan_duration\",\"loan_status\",\"loan_availed_date\",\"accNo\",\"branchId\",\"bankId\",\"toLoan\"],[true,[28,[null,\"loan_id\"]],[28,[null,\"loan_type\"]],[28,[null,\"loan_amount\"]],[28,[null,\"loan_interest\"]],[28,[null,\"loan_duration\"]],[28,[null,\"loan_status\"]],[28,[null,\"loan_availed_date\"]],[28,[null,\"accNo\"]],[28,[null,\"branchId\"]],[28,[null,\"bankId\"]],[33,[\"action\"],[[28,[null]],\"toLoan\"],null]]]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/loans/loan/edit.hbs" } });
});
define("banker/templates/banks/bank/loans/loan/emi", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "nfWE8SNt", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"emi-list\"],[13],[0,\"\\n  \"],[11,\"button\",[]],[15,\"class\",\"new-emi-btn\"],[5,[\"action\"],[[28,[null]],\"addNewEmi\"]],[13],[0,\"Make Payment\"],[14],[0,\"\\n  \\n  \"],[11,\"table\",[]],[15,\"class\",\"emi-table\"],[13],[0,\"\\n    \"],[11,\"thead\",[]],[13],[0,\"\\n      \"],[11,\"tr\",[]],[13],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"EMI Number\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Transaction ID\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"To Be Paid Date\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Actual Paid Date\"],[14],[0,\"\\n      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"generatedEmis\"]]],null,{\"statements\":[[0,\"        \"],[11,\"tr\",[]],[13],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"emi\",\"emiNumber\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"emi\",\"transactionId\"]],false],[0,\"\\n           \"],[11,\"div\",[]],[16,\"class\",[34,[\"status-box \",[33,[\"if\"],[[33,[\"eq\"],[[28,[\"emi\",\"transactionId\"]],\"-\"],null],\"to-be-paid\",\"paid\"],null]]]],[13],[1,[33,[\"if\"],[[33,[\"eq\"],[[28,[\"emi\",\"transactionId\"]],\"-\"],null],\"To Be Paid\",\"Paid\"],null],false],[14],[0,\"\\n         \"],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"emi\",\"toBePaidDate\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"emi\",\"actualPaidDate\"]],false],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[\"emi\"]},null],[0,\"    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/loans/loan/emi.hbs" } });
});
define("banker/templates/banks/bank/loans/loan/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "zPaLWao/", "block": "{\"statements\":[[1,[33,[\"view-loan\"],null,[[\"bankId\",\"branchId\",\"loan\",\"toEmis\"],[[28,[null,\"bankId\"]],[28,[\"branchId\"]],[28,[null,\"loan\"]],[33,[\"action\"],[[28,[null]],\"toEmis\"],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/loans/loan/index.hbs" } });
});
define("banker/templates/banks/bank/loans/new", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "kRoVUad9", "block": "{\"statements\":[[1,[33,[\"loan-input\"],null,[[\"accNo\",\"branchId\",\"bankId\",\"isDirect\",\"toLoan\"],[[28,[null,\"accNo\"]],[28,[null,\"branchId\"]],[28,[null,\"bankId\"]],true,[33,[\"action\"],[[28,[null]],\"toLoan\"],null]]]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/loans/new.hbs" } });
});
define("banker/templates/banks/bank/transactions", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "lG1GKROB", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/transactions.hbs" } });
});
define("banker/templates/banks/bank/transactions/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "5KlPlxxu", "block": "{\"statements\":[[1,[33,[\"view-transactions\"],null,[[\"accNo\",\"bankId\",\"transactions\",\"branchId\",\"transactionId\",\"viewTransaction\",\"toaddNewTransaction\"],[[28,[null,\"accNo\"]],[28,[null,\"bankId\"]],[28,[null,\"transactions\"]],[28,[null,\"branchId\"]],[28,[null,\"transactionId\"]],[33,[\"action\"],[[28,[null]],\"viewTransaction\"],null],[33,[\"action\"],[[28,[null]],\"addNewTransaction\"],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/transactions/index.hbs" } });
});
define("banker/templates/banks/bank/transactions/new", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "GMOrPfW0", "block": "{\"statements\":[[1,[33,[\"transaction-input\"],null,[[\"accNo\",\"branchId\",\"bankId\",\"isDirect\",\"toTransaction\"],[[28,[null,\"accNo\"]],[28,[null,\"branchId\"]],[28,[null,\"bankId\"]],true,[33,[\"action\"],[[28,[null]],\"toTransaction\"],null]]]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/transactions/new.hbs" } });
});
define("banker/templates/banks/bank/transactions/transaction", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "gYHi6pv3", "block": "{\"statements\":[[0,\"\\n\"],[1,[33,[\"view-transaction\"],null,[[\"bankId\",\"branchId\",\"transaction\"],[[28,[null,\"bankId\"]],[28,[null,\"branchId\"]],[28,[null,\"transaction\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/transactions/transaction.hbs" } });
});
define("banker/templates/banks/bank/users", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "j0SLfskV", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/users.hbs" } });
});
define("banker/templates/banks/bank/users/user", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "poyFvRzi", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/users/user.hbs" } });
});
define("banker/templates/banks/bank/users/user/dashboard", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "7WQ/wb1e", "block": "{\"statements\":[[6,[\"if\"],[[33,[\"eq\"],[[28,[\"sessionData\",\"user_role\"]],[28,[\"userRole\",\"ADMIN\"]]],null]],null,{\"statements\":[[11,\"div\",[]],[15,\"class\",\"card-container\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"branches\"]]],null,{\"statements\":[[0,\"   \"],[1,[33,[\"admin-dashboard\"],null,[[\"branchName\",\"accountCount\",\"loansAvailed\",\"totalDeposits\"],[[28,[\"branch\",\"branchName\"]],[28,[\"branch\",\"accountCount\"]],[28,[\"branch\",\"loansAvailed\"]],[28,[\"branch\",\"totalDeposits\"]]]]],false],[0,\"\\n\"]],\"locals\":[\"branch\"]},null],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"sessionData\",\"user_role\"]],[28,[\"userRole\",\"MANAGER\"]]],null]],null,{\"statements\":[[0,\"    \"],[1,[33,[\"manager-dashboard\"],null,[[\"branch\"],[[28,[\"branch\"]]]]],false],[0,\"\\n\\n\"]],\"locals\":[]},null],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"sessionData\",\"user_role\"]],[28,[\"userRole\",\"CUSTOMER\"]]],null]],null,{\"statements\":[[0,\"    \"],[1,[33,[\"customer-dashboard\"],null,[[\"accountList\"],[[28,[\"accountList\"]]]]],false],[0,\"\\n\\n\"]],\"locals\":[]},null],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/bank/users/user/dashboard.hbs" } });
});
define("banker/templates/banks/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "klSaYWIH", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"banks-list\"],[13],[0,\"\\n  \"],[11,\"button\",[]],[15,\"class\",\"new-bank-btn\"],[5,[\"action\"],[[28,[null]],\"addNewBank\"]],[13],[0,\"New Bank\"],[14],[0,\"\\n  \"],[11,\"table\",[]],[15,\"class\",\"banks-table\"],[13],[0,\"\\n    \"],[11,\"thead\",[]],[13],[0,\"\\n      \"],[11,\"tr\",[]],[13],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Bank Name\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Bank Code\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Admin Name\"],[14],[0,\"\\n      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"banks\"]]],null,{\"statements\":[[0,\"        \"],[11,\"tr\",[]],[5,[\"action\"],[[28,[null]],\"viewBank\",[28,[\"bank\"]]]],[13],[0,\" \\n          \"],[11,\"td\",[]],[13],[1,[28,[\"bank\",\"bank_name\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"bank\",\"bank_code\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"bank\",\"admin_name\"]],false],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[\"bank\"]},null],[0,\"    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/index.hbs" } });
});
define("banker/templates/banks/new", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "tjhNXFfW", "block": "{\"statements\":[[11,\"body\",[]],[13],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"bank-form\"],[13],[0,\"\\n  \"],[11,\"h2\",[]],[13],[0,\"Create New Bank\"],[14],[0,\"\\n  \\n  \"],[11,\"form\",[]],[5,[\"action\"],[[28,[null]],\"submitForm\"],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n   \\n\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"bank_name\"],[13],[0,\"Bank Name\"],[14],[0,\"\\n      \"],[11,\"input\",[]],[15,\"type\",\"text\"],[15,\"id\",\"bank_name\"],[16,\"value\",[26,[\"bank_name\"]],null],[15,\"class\",\"form-control\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"bank_name\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"bank_code\"],[13],[0,\"Bank Code\"],[14],[0,\"\\n      \"],[11,\"input\",[]],[15,\"type\",\"text\"],[15,\"id\",\"bank_code\"],[16,\"value\",[26,[\"bank_code\"]],null],[15,\"class\",\"form-control\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"bank_code\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n   \\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n    \"],[11,\"label\",[]],[15,\"for\",\"admin_name\"],[13],[0,\"Admin Name\"],[14],[0,\"\\n    \"],[11,\"select\",[]],[15,\"id\",\"admin_name\"],[15,\"class\",\"form-control\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"admin_id\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n        \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"Select Admin\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"admins\"]]],null,{\"statements\":[[0,\"        \"],[11,\"option\",[]],[16,\"value\",[28,[\"admin\",\"admin_id\"]],null],[13],[1,[28,[\"admin\",\"admin_name\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"admin\"]},null],[0,\"    \"],[14],[0,\"\\n    \"],[14],[0,\"\\n \\n\\n    \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn-primary\"],[13],[0,\"Create Bank\"],[14],[0,\"\\n   \\n\"],[6,[\"link-to\"],[\"banks\"],null,{\"statements\":[[0,\"    \"],[11,\"button\",[]],[15,\"class\",\"btn-secondary\"],[5,[\"action\"],[[28,[null]],\"cancel\"]],[13],[0,\"Cancel\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"errorMessage\"]]],null,{\"statements\":[[0,\"      \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[0,\"* \"],[1,[26,[\"errorMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"],[1,[33,[\"notify-box\"],null,[[\"message\",\"type\"],[[28,[\"notification\",\"message\"]],[28,[\"notification\",\"type\"]]]]],false],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/banks/new.hbs" } });
});
define("banker/templates/components/account-input", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "rMhqOyyw", "block": "{\"statements\":[[11,\"body\",[]],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"account-form\"],[13],[0,\"\\n    \"],[11,\"h2\",[]],[13],[1,[33,[\"if\"],[[28,[\"isEdit\"]],\"Edit Account\",\"Create New Account\"],null],false],[14],[0,\"\\n\\n    \"],[11,\"form\",[]],[5,[\"action\"],[[28,[null]],\"submitForm\"],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isEdit\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"accNo\"],[13],[0,\"Account Number\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n          \"],[11,\"input\",[]],[15,\"type\",\"text\"],[15,\"id\",\"accNo\"],[16,\"value\",[26,[\"accNo\"]],null],[15,\"class\",\"form-control\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"accNo\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[16,\"disabled\",[26,[\"isEdit\"]],null],[13],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"acc_type\"],[13],[0,\"Account Type\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n        \"],[11,\"select\",[]],[15,\"id\",\"acc_type\"],[15,\"class\",\"form-control\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"acc_type\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n          \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"Select type\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"types\"]]],null,{\"statements\":[[0,\"            \"],[11,\"option\",[]],[16,\"value\",[28,[\"type\"]],null],[16,\"selected\",[33,[\"if\"],[[33,[\"eq\"],[[28,[\"type\"]],[28,[\"acc_type\"]]],null],\"selected\"],null],null],[13],[1,[28,[\"type\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"type\"]},null],[0,\"        \"],[14],[0,\"\\n      \"],[14],[0,\"\\n\\n\"],[6,[\"unless\"],[[33,[\"eq\"],[[28,[\"role\"]],[28,[\"userRole\",\"CUSTOMER\"]]],null]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"acc_status\"],[13],[0,\"Account Status\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n          \"],[11,\"select\",[]],[15,\"id\",\"acc_status\"],[15,\"class\",\"form-control\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"acc_status\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n            \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"Select Status\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"statuses\"]]],null,{\"statements\":[[0,\"              \"],[11,\"option\",[]],[16,\"value\",[28,[\"status\"]],null],[16,\"selected\",[33,[\"if\"],[[33,[\"eq\"],[[28,[\"status\"]],[28,[\"acc_status\"]]],null],\"selected\"],null],null],[13],[1,[28,[\"status\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"status\"]},null],[0,\"          \"],[14],[0,\"\\n        \"],[14],[0,\"\\n\\n        \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"username\"],[13],[0,\"Username\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n          \"],[11,\"input\",[]],[15,\"type\",\"text\"],[15,\"id\",\"username\"],[16,\"value\",[26,[\"username\"]],null],[15,\"class\",\"form-control\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"username\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[16,\"disabled\",[26,[\"isEdit\"]],null],[13],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"branch_name\"],[13],[0,\"Branch Name\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n        \"],[11,\"select\",[]],[15,\"id\",\"branch_name\"],[15,\"class\",\"form-control\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"branch_name\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n          \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"Select branch\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"branchNames\"]]],null,{\"statements\":[[0,\"            \"],[11,\"option\",[]],[16,\"value\",[28,[\"branch\",\"branch_name\"]],null],[16,\"selected\",[33,[\"if\"],[[33,[\"eq\"],[[28,[\"branch\",\"branch_name\"]],[28,[\"branch_name\"]]],null],\"selected\"],null],null],[13],[1,[28,[\"branch\",\"branch_name\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"branch\"]},null],[0,\"        \"],[14],[0,\"\\n      \"],[14],[0,\"\\n\\n      \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn-primary\"],[13],[1,[33,[\"if\"],[[28,[\"isEdit\"]],\"Update Account\",\"Create Account\"],null],false],[14],[0,\"\\n\\n\"],[6,[\"link-to\"],[\"banks.bank.accounts\",[28,[\"bankId\"]]],null,{\"statements\":[[0,\"        \"],[11,\"button\",[]],[15,\"class\",\"btn-secondary\"],[5,[\"action\"],[[28,[null]],\"cancel\"]],[13],[0,\"Cancel\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"errorMessage\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[0,\"* \"],[1,[26,[\"errorMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[1,[33,[\"notify-box\"],null,[[\"message\",\"type\"],[[28,[\"notification\",\"message\"]],[28,[\"notification\",\"type\"]]]]],false],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/account-input.hbs" } });
});
define("banker/templates/components/admin-dashboard", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "tRVvGpsA", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"branch-card\"],[13],[0,\"\\n  \"],[11,\"h2\",[]],[15,\"class\",\"branch-name\"],[13],[1,[26,[\"branchName\"]],false],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"branch-field\"],[13],[0,\"\\n    \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Accounts:\"],[14],[0,\"\\n    \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[26,[\"accountCount\"]],false],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"branch-field\"],[13],[0,\"\\n    \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Loans:\"],[14],[0,\"\\n    \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[26,[\"loansAvailed\"]],false],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"branch-field\"],[13],[0,\"\\n    \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Total Deposits:\"],[14],[0,\"\\n    \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[0,\"Rs. \"],[1,[26,[\"totalDeposits\"]],false],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/admin-dashboard.hbs" } });
});
define("banker/templates/components/auth-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "nvGsDfnT", "block": "{\"statements\":[[11,\"body\",[]],[15,\"class\",\"auth-body\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"auth-form\"],[13],[0,\"\\n    \"],[11,\"h2\",[]],[13],[1,[33,[\"if\"],[[28,[\"isSignup\"]],\"Register\",\"Login\"],null],false],[14],[0,\"\\n    \"],[11,\"form\",[]],[5,[\"action\"],[[28,[null]],[33,[\"if\"],[[28,[\"isSuper\"]],\"superAdminForm\",\"submitForm\"],null]],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isSignup\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"name\"],[13],[0,\"Name\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n          \"],[11,\"input\",[]],[15,\"id\",\"name\"],[15,\"type\",\"text\"],[16,\"value\",[26,[\"name\"]],null],[15,\"class\",\"form-control\"],[15,\"placeholder\",\"Enter your full name\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"name\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[16,\"onblur\",[33,[\"action\"],[[28,[null]],\"validateName\"],null],null],[13],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"nameError\"]]],null,{\"statements\":[[0,\"            \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[1,[26,[\"nameError\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"        \"],[14],[0,\"\\n\\n        \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"dob\"],[13],[0,\"Date of Birth\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n          \"],[11,\"input\",[]],[15,\"id\",\"dob\"],[15,\"type\",\"date\"],[16,\"value\",[26,[\"dob\"]],null],[15,\"class\",\"form-control\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"dob\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[16,\"onblur\",[33,[\"action\"],[[28,[null]],\"validateDob\"],null],null],[13],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"dobError\"]]],null,{\"statements\":[[0,\"            \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[1,[26,[\"dobError\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"        \"],[14],[0,\"\\n\\n        \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"pno\"],[13],[0,\"Phone Number\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n          \"],[11,\"input\",[]],[15,\"id\",\"pno\"],[15,\"type\",\"number\"],[16,\"value\",[26,[\"pno\"]],null],[15,\"class\",\"form-control\"],[15,\"placeholder\",\"Enter your phone number\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"pno\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[16,\"onblur\",[33,[\"action\"],[[28,[null]],\"validatePno\"],null],null],[13],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"pnoError\"]]],null,{\"statements\":[[0,\"            \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[1,[26,[\"pnoError\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"        \"],[14],[0,\"\\n\\n        \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"addr\"],[13],[0,\"Address\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n          \"],[11,\"textarea\",[]],[15,\"id\",\"addr\"],[16,\"value\",[26,[\"addr\"]],null],[15,\"class\",\"form-control\"],[15,\"placeholder\",\"Enter your address\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"addr\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[16,\"onblur\",[33,[\"action\"],[[28,[null]],\"validateAddr\"],null],null],[13],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"addrError\"]]],null,{\"statements\":[[0,\"            \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[1,[26,[\"addrError\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"        \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"username\"],[13],[0,\"Username\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n        \"],[11,\"input\",[]],[15,\"id\",\"username\"],[15,\"type\",\"text\"],[16,\"value\",[26,[\"username\"]],null],[15,\"class\",\"form-control\"],[15,\"placeholder\",\"Enter your username\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"username\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[16,\"onblur\",[33,[\"action\"],[[28,[null]],\"validateUsername\"],null],null],[13],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"usernameError\"]]],null,{\"statements\":[[0,\"          \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[1,[26,[\"usernameError\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"      \"],[14],[0,\"\\n\\n      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"password\"],[13],[0,\"Password\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n        \"],[11,\"input\",[]],[15,\"id\",\"password\"],[15,\"type\",\"password\"],[16,\"value\",[26,[\"password\"]],null],[15,\"class\",\"form-control\"],[15,\"placeholder\",\"Enter your password\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"password\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[16,\"onblur\",[33,[\"action\"],[[28,[null]],[33,[\"if\"],[[28,[\"isSignup\"]],\"validatePassword\",\"validatePass\"],null]],null],null],[13],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"passwordError\"]]],null,{\"statements\":[[0,\"          \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[1,[26,[\"passwordError\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"      \"],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"isSignup\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"confirmPassword\"],[13],[0,\"Confirm Password\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n          \"],[11,\"input\",[]],[15,\"id\",\"confirmPassword\"],[15,\"type\",\"password\"],[16,\"value\",[26,[\"confirmPassword\"]],null],[15,\"class\",\"form-control\"],[15,\"placeholder\",\"Confirm your password\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"confirmPassword\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[16,\"onblur\",[33,[\"action\"],[[28,[null]],\"validateConfirmPassword\"],null],null],[13],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"confirmPasswordError\"]]],null,{\"statements\":[[0,\"            \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[1,[26,[\"confirmPasswordError\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"        \"],[14],[0,\"\\n\\n        \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"role\"],[13],[0,\"Register as\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n          \"],[11,\"select\",[]],[15,\"id\",\"role\"],[16,\"value\",[26,[\"selectedRole\"]],null],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"selectedRole\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[15,\"class\",\"form-control\"],[16,\"onblur\",[33,[\"action\"],[[28,[null]],\"validateRole\"],null],null],[13],[0,\"\\n            \"],[11,\"option\",[]],[15,\"value\",\"\"],[15,\"disabled\",\"\"],[15,\"selected\",\"\"],[13],[0,\"Select a role\"],[14],[0,\"\\n            \"],[11,\"option\",[]],[15,\"value\",\"manager\"],[13],[0,\"Manager\"],[14],[0,\"\\n            \"],[11,\"option\",[]],[15,\"value\",\"customer\"],[13],[0,\"Customer\"],[14],[0,\"\\n            \"],[11,\"option\",[]],[15,\"value\",\"admin\"],[13],[0,\"Admin\"],[14],[0,\"\\n          \"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"roleError\"]]],null,{\"statements\":[[0,\"            \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[1,[26,[\"roleError\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"        \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"unless\"],[[28,[\"isSignup\"]]],null,{\"statements\":[[6,[\"unless\"],[[28,[\"isSuper\"]]],null,{\"statements\":[[0,\"          \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n            \"],[11,\"label\",[]],[15,\"for\",\"bank_name\"],[13],[0,\"Bank Name\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n            \"],[11,\"select\",[]],[15,\"id\",\"bank_name\"],[15,\"class\",\"form-control\"],[16,\"value\",[26,[\"bank_name\"]],null],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"bank_name\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[16,\"onblur\",[33,[\"action\"],[[28,[null]],\"validateBankName\"],null],null],[13],[0,\"\\n              \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"Select bank\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"bankNames\"]]],null,{\"statements\":[[0,\"                \"],[11,\"option\",[]],[16,\"value\",[28,[\"bank\",\"bank_name\"]],null],[13],[1,[28,[\"bank\",\"bank_name\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"bank\"]},null],[0,\"            \"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"bankNameError\"]]],null,{\"statements\":[[0,\"              \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[1,[26,[\"bankNameError\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"          \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[]},null],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn-primary\"],[13],[1,[33,[\"if\"],[[28,[\"isSignup\"]],\"Register\",\"Login\"],null],false],[14],[0,\"\\n      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"],[6,[\"unless\"],[[28,[\"isSuper\"]]],null,{\"statements\":[[0,\"      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"switch\"],[5,[\"action\"],[[28,[null]],\"toggleMode\"]],[13],[1,[33,[\"if\"],[[28,[\"isSignup\"]],\"Switch to Login\",\"Switch to Register\"],null],false],[14],[0,\"\\n      \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"if\"],[[28,[\"errorMessage\"]]],null,{\"statements\":[[0,\"      \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[0,\"* \"],[1,[26,[\"errorMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/auth-form.hbs" } });
});
define("banker/templates/components/branch-input", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ZKdllFLe", "block": "{\"statements\":[[11,\"body\",[]],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"branch-form\"],[13],[0,\"\\n    \"],[11,\"h2\",[]],[13],[1,[33,[\"if\"],[[28,[\"isEdit\"]],\"Edit Branch\",\"Create New Branch\"],null],false],[14],[0,\"\\n    \\n    \"],[11,\"form\",[]],[5,[\"action\"],[[28,[null]],\"submitForm\"],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isEdit\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"branchId\"],[13],[0,\"Branch ID\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n          \"],[11,\"input\",[]],[15,\"type\",\"text\"],[15,\"id\",\"branchId\"],[16,\"value\",[26,[\"branchId\"]],null],[15,\"class\",\"form-control\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"branchId\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[15,\"disabled\",\"\"],[13],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"  \\n      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"name\"],[13],[0,\"Branch Name\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n        \"],[11,\"input\",[]],[15,\"type\",\"text\"],[15,\"id\",\"name\"],[16,\"value\",[26,[\"name\"]],null],[15,\"class\",\"form-control\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"name\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n      \"],[14],[0,\"\\n  \\n      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"address\"],[13],[0,\"Branch Address\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n        \"],[11,\"input\",[]],[15,\"type\",\"text\"],[15,\"id\",\"address\"],[16,\"value\",[26,[\"address\"]],null],[15,\"class\",\"form-control\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"address\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n      \"],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"isEdit\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"branch_number\"],[13],[0,\"Branch Number\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n          \"],[11,\"input\",[]],[15,\"type\",\"text\"],[15,\"id\",\"branch_number\"],[16,\"value\",[26,[\"branch_number\"]],null],[15,\"class\",\"form-control\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"branch_number\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[15,\"disabled\",\"\"],[13],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"manager_id\"],[13],[0,\"Manager Name\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n        \"],[11,\"select\",[]],[15,\"id\",\"manager_id\"],[15,\"class\",\"form-control\"],[16,\"value\",[26,[\"manager_id\"]],null],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"manager_id\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isEdit\"]]],null,{\"statements\":[[0,\"            \"],[11,\"option\",[]],[16,\"value\",[26,[\"manager_id\"]],null],[13],[1,[26,[\"manager_name\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"            \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"Select Manager\"],[14],[0,\"\\n\"]],\"locals\":[]}],[6,[\"each\"],[[28,[\"availableManagers\"]]],null,{\"statements\":[[0,\"            \"],[11,\"option\",[]],[16,\"value\",[28,[\"manager\",\"manager_id\"]],null],[13],[1,[28,[\"manager\",\"manager_name\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"manager\"]},null],[0,\"        \"],[14],[0,\"\\n      \"],[14],[0,\"\\n  \\n      \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn-primary\"],[13],[1,[33,[\"if\"],[[28,[\"isEdit\"]],\"Update Branch\",\"Create Branch\"],null],false],[14],[0,\"\\n      \\n\"],[6,[\"link-to\"],[\"banks.bank.branches\",[28,[\"bankId\"]]],null,{\"statements\":[[0,\"        \"],[11,\"button\",[]],[15,\"class\",\"btn-secondary\"],[5,[\"action\"],[[28,[null]],\"cancel\"]],[13],[0,\"Cancel\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"errorMessage\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[0,\"* \"],[1,[26,[\"errorMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[1,[33,[\"notify-box\"],null,[[\"message\",\"type\"],[[28,[\"notification\",\"message\"]],[28,[\"notification\",\"type\"]]]]],false],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/branch-input.hbs" } });
});
define("banker/templates/components/customer-dashboard", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "zYhQF2ZV", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"dashboard-container\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"dashboard-section section-1\"],[13],[0,\"\\n        \"],[11,\"h2\",[]],[13],[0,\"Loans Overview\"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"loan-card-container\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"accountList\"]]],null,{\"statements\":[[6,[\"if\"],[[28,[\"item\",\"loan_details\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"loan-card-dash\"],[13],[0,\"\\n                        \"],[11,\"h3\",[]],[13],[0,\"Loan ID: \"],[1,[28,[\"item\",\"loan_details\",\"loan_id\"]],false],[14],[0,\"\\n                        \"],[11,\"div\",[]],[15,\"class\",\"loan-field\"],[13],[0,\"\\n                            \"],[11,\"span\",[]],[15,\"class\",\"field-label-dash\"],[13],[0,\"Loan Type:\"],[14],[0,\"\\n                            \"],[11,\"span\",[]],[15,\"class\",\"field-value-dash\"],[13],[1,[28,[\"item\",\"loan_details\",\"loan_type\"]],false],[14],[0,\"\\n                        \"],[14],[0,\"\\n                        \"],[11,\"div\",[]],[15,\"class\",\"loan-field\"],[13],[0,\"\\n                            \"],[11,\"span\",[]],[15,\"class\",\"field-label-dash\"],[13],[0,\"Loan Amount:\"],[14],[0,\"\\n                            \"],[11,\"span\",[]],[15,\"class\",\"field-value-dash\"],[13],[0,\"Rs.\"],[1,[28,[\"item\",\"loan_details\",\"loan_amount\"]],false],[14],[0,\"\\n                        \"],[14],[0,\"\\n                        \"],[11,\"div\",[]],[15,\"class\",\"loan-field\"],[13],[0,\"\\n                            \"],[11,\"span\",[]],[15,\"class\",\"field-label-dash\"],[13],[0,\"Loan Duration:\"],[14],[0,\"\\n                            \"],[11,\"span\",[]],[15,\"class\",\"field-value-dash\"],[13],[1,[28,[\"item\",\"loan_details\",\"loan_duration\"]],false],[0,\" months\"],[14],[0,\"\\n                        \"],[14],[0,\"\\n                        \"],[11,\"div\",[]],[15,\"class\",\"loan-field\"],[13],[0,\"\\n                            \"],[11,\"span\",[]],[15,\"class\",\"field-label-dash\"],[13],[0,\"Availed Date:\"],[14],[0,\"\\n                            \"],[11,\"span\",[]],[15,\"class\",\"field-value-dash\"],[13],[1,[28,[\"item\",\"loan_details\",\"loan_availed_date\"]],false],[14],[0,\"\\n                        \"],[14],[0,\"\\n                        \"],[11,\"div\",[]],[15,\"class\",\"view-wrap\"],[13],[0,\"\\n                            \"],[11,\"button\",[]],[15,\"class\",\"view-btn\"],[5,[\"action\"],[[28,[null]],\"showEmiModal\",[28,[\"item\",\"loan_details\",\"loan_id\"]]]],[13],[0,\"Emi Schedule\"],[14],[0,\"\\n                        \"],[14],[0,\"\\n                    \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[\"item\"]},null],[0,\"        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"div\",[]],[15,\"class\",\"right-container\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"dashboard-section section-2\"],[13],[0,\"\\n            \"],[11,\"h2\",[]],[13],[0,\"Transactions Overview\"],[14],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"transaction-card-container\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"accountList\"]]],null,{\"statements\":[[6,[\"each\"],[[28,[\"item\",\"transactions\"]]],null,{\"statements\":[[0,\"                        \"],[11,\"div\",[]],[15,\"class\",\"transaction-card-dash\"],[13],[0,\"\\n                            \"],[11,\"h3\",[]],[13],[0,\"Transaction ID: \"],[1,[28,[\"transaction\",\"transaction_id\"]],false],[14],[0,\"\\n                            \"],[11,\"div\",[]],[15,\"class\",\"transaction-field\"],[13],[0,\"\\n                                \"],[11,\"span\",[]],[15,\"class\",\"field-label-dash\"],[13],[0,\"Type:\"],[14],[0,\"\\n                                \"],[11,\"span\",[]],[15,\"class\",\"field-value-dash\"],[13],[1,[28,[\"transaction\",\"transaction_type\"]],false],[14],[0,\"\\n                            \"],[14],[0,\"\\n                            \"],[11,\"div\",[]],[15,\"class\",\"transaction-field\"],[13],[0,\"\\n                                \"],[11,\"span\",[]],[15,\"class\",\"field-label-dash\"],[13],[0,\"Date:\"],[14],[0,\"\\n                                \"],[11,\"span\",[]],[15,\"class\",\"field-value-dash\"],[13],[1,[28,[\"transaction\",\"transaction_datetime\"]],false],[14],[0,\"\\n                            \"],[14],[0,\"\\n                        \"],[14],[0,\"\\n\"]],\"locals\":[\"transaction\"]},null]],\"locals\":[\"item\"]},null],[0,\"            \"],[14],[0,\"\\n        \"],[14],[0,\"\\n\\n        \"],[11,\"div\",[]],[15,\"class\",\"dashboard-section section-3\"],[13],[0,\"\\n            \"],[11,\"h2\",[]],[13],[0,\"Accounts Overview\"],[14],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"account-card-container\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"accountList\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"account-card-dash\"],[13],[0,\"\\n                        \"],[11,\"h3\",[]],[13],[0,\"Account Number: \"],[1,[28,[\"item\",\"account\",\"acc_no\"]],false],[14],[0,\"\\n                        \"],[11,\"div\",[]],[15,\"class\",\"account-field\"],[13],[0,\"\\n                            \"],[11,\"span\",[]],[15,\"class\",\"field-label-dash\"],[13],[0,\"Balance:\"],[14],[0,\"\\n                            \"],[11,\"span\",[]],[15,\"class\",\"field-value-dash\"],[13],[0,\"Rs.\"],[1,[28,[\"item\",\"account\",\"acc_balance\"]],false],[14],[0,\"\\n                        \"],[14],[0,\"\\n                    \"],[14],[0,\"\\n\"]],\"locals\":[\"item\"]},null],[0,\"            \"],[14],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"emi-modal\"],[15,\"id\",\"emiModal\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"emi-modal-content\"],[13],[0,\"\\n        \"],[11,\"span\",[]],[15,\"class\",\"close-btn\"],[5,[\"action\"],[[28,[null]],\"closeEmiModal\"]],[13],[0,\"×\"],[14],[0,\"\\n        \"],[11,\"h3\",[]],[13],[0,\"EMI Schedule for Loan ID: Rs.\"],[1,[26,[\"selectedLoanId\"]],false],[14],[11,\"span\",[]],[13],[0,\"EMI Amount: Rs.\"],[1,[28,[\"emi\",\"emiAmount\"]],false],[14],[0,\"\\n\\n        \"],[11,\"table\",[]],[15,\"class\",\"emi-table\"],[13],[0,\"\\n            \"],[11,\"thead\",[]],[13],[0,\"\\n                \"],[11,\"tr\",[]],[13],[0,\"\\n                    \"],[11,\"th\",[]],[13],[0,\"EMI Number\"],[14],[0,\"\\n                    \"],[11,\"th\",[]],[13],[0,\"To-Be Paid Date\"],[14],[0,\"\\n                \"],[14],[0,\"\\n            \"],[14],[0,\"\\n            \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"emiSchedule\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"tr\",[]],[13],[0,\"\\n                        \"],[11,\"td\",[]],[13],[1,[28,[\"emi\",\"emiNumber\"]],false],[14],[0,\"\\n                        \"],[11,\"td\",[]],[13],[1,[33,[\"format-date\"],[[28,[\"emi\",\"toBePaidDate\"]]],null],false],[14],[0,\"\\n                    \"],[14],[0,\"\\n\"]],\"locals\":[\"emi\"]},null],[0,\"            \"],[14],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/customer-dashboard.hbs" } });
});
define("banker/templates/components/loan-input", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "bwF9zMUQ", "block": "{\"statements\":[[11,\"body\",[]],[13],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"auth-form\"],[13],[0,\"\\n  \"],[11,\"h2\",[]],[13],[1,[33,[\"if\"],[[28,[\"isEdit\"]],\"Edit Loan\",\"Create New Loan\"],null],false],[14],[0,\"\\n  \\n  \"],[11,\"form\",[]],[5,[\"action\"],[[28,[null]],\"submitForm\"],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"isEdit\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"loan_id\"],[13],[0,\"Loan ID\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n      \"],[11,\"input\",[]],[15,\"type\",\"text\"],[15,\"id\",\"loan_id\"],[16,\"value\",[26,[\"loan_id\"]],null],[15,\"class\",\"form-control\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"loan_id\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[16,\"disabled\",[26,[\"isEdit\"]],null],[13],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"loan_type\"],[13],[0,\"Loan Type\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n      \"],[11,\"select\",[]],[15,\"id\",\"loan_type\"],[15,\"class\",\"form-control\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"loan_type\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n        \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"Select type\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"types\"]]],null,{\"statements\":[[0,\"          \"],[11,\"option\",[]],[16,\"value\",[28,[\"type\"]],null],[16,\"selected\",[33,[\"if\"],[[33,[\"eq\"],[[28,[\"type\"]],[28,[\"loan_type\"]]],null],\"selected\"],null],null],[13],[1,[28,[\"type\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"type\"]},null],[0,\"      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"isDirect\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"accNo\"],[13],[0,\"Account Number\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n      \"],[11,\"select\",[]],[15,\"id\",\"accNo\"],[15,\"class\",\"form-control\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"accNo\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n        \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"Select Account Number\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"accounts\"]]],null,{\"statements\":[[0,\"          \"],[11,\"option\",[]],[16,\"value\",[28,[\"account\",\"acc_no\"]],null],[13],[1,[28,[\"account\",\"acc_no\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"account\"]},null],[0,\"      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"loan_amount\"],[13],[0,\"Loan Amount\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n      \"],[11,\"input\",[]],[15,\"type\",\"number\"],[15,\"id\",\"loan_amount\"],[16,\"value\",[26,[\"loan_amount\"]],null],[15,\"class\",\"form-control\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"loan_amount\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"loan_duration\"],[13],[0,\"Loan Duration\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n      \"],[11,\"select\",[]],[15,\"id\",\"loan_duration\"],[15,\"class\",\"form-control\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"loan_duration\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n        \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"Select duration\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"durations\"]]],null,{\"statements\":[[0,\"          \"],[11,\"option\",[]],[16,\"value\",[28,[\"duration\"]],null],[16,\"selected\",[33,[\"if\"],[[33,[\"eq\"],[[28,[\"duration\"]],[28,[\"loan_duration\"]]],null],\"selected\"],null],null],[13],[1,[28,[\"duration\"]],false],[0,\" Months\"],[14],[0,\"\\n\"]],\"locals\":[\"duration\"]},null],[0,\"      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n\"],[6,[\"unless\"],[[33,[\"eq\"],[[28,[\"role\"]],[28,[\"userRole\",\"CUSTOMER\"]]],null]],null,{\"statements\":[[6,[\"unless\"],[[28,[\"isEdit\"]]],null,{\"statements\":[[0,\"      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"loan_status\"],[13],[0,\"Loan Status\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n        \"],[11,\"select\",[]],[15,\"id\",\"loan_status\"],[15,\"class\",\"form-control\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"loan_status\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n          \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"Select Status\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"statuses\"]]],null,{\"statements\":[[0,\"            \"],[11,\"option\",[]],[16,\"value\",[28,[\"status\"]],null],[16,\"selected\",[33,[\"if\"],[[33,[\"eq\"],[[28,[\"status\"]],[28,[\"loan_status\"]]],null],\"selected\"],null],null],[13],[1,[28,[\"status\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"status\"]},null],[0,\"        \"],[14],[0,\"\\n      \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"if\"],[[28,[\"isEdit\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"loan_status\"],[13],[0,\"Loan Status\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n      \"],[11,\"select\",[]],[15,\"id\",\"loan_status\"],[15,\"class\",\"form-control\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"loan_status\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n        \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"Select Status\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"filteredStatuses\"]]],null,{\"statements\":[[0,\"          \"],[11,\"option\",[]],[16,\"value\",[28,[\"status\"]],null],[16,\"selected\",[33,[\"if\"],[[33,[\"eq\"],[[28,[\"status\"]],[28,[\"loan_status\"]]],null],\"selected\"],null],null],[13],[1,[28,[\"status\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"status\"]},null],[0,\"      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[]},null],[0,\"\\n    \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn-primary\"],[13],[1,[33,[\"if\"],[[28,[\"isEdit\"]],\"Update Loan\",\"Create Loan\"],null],false],[14],[0,\"\\n   \\n\"],[6,[\"if\"],[[28,[\"isDirect\"]]],null,{\"statements\":[[6,[\"link-to\"],[\"banks.bank.loans\",[28,[\"bankId\"]]],null,{\"statements\":[[0,\"          \"],[11,\"button\",[]],[15,\"class\",\"btn-secondary\"],[5,[\"action\"],[[28,[null]],\"cancel\"]],[13],[0,\"Cancel\"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[]},null],[6,[\"unless\"],[[28,[\"isDirect\"]]],null,{\"statements\":[[6,[\"link-to\"],[\"banks.bank.accounts.account.loans\",[28,[\"bankId\"]],[28,[\"accNo\"]]],null,{\"statements\":[[0,\"      \"],[11,\"button\",[]],[15,\"class\",\"btn-secondary\"],[5,[\"action\"],[[28,[null]],\"cancel\"]],[13],[0,\"Cancel\"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"errorMessage\"]]],null,{\"statements\":[[0,\"      \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[0,\"* \"],[1,[26,[\"errorMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"],[1,[33,[\"notify-box\"],null,[[\"message\",\"type\"],[[28,[\"notification\",\"message\"]],[28,[\"notification\",\"type\"]]]]],false],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/loan-input.hbs" } });
});
define("banker/templates/components/manager-dashboard", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "JtA9hxs9", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"card-container\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"card account-card\"],[13],[0,\"\\n    \"],[11,\"h3\",[]],[15,\"class\",\"card-title\"],[13],[0,\"Accounts\"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"branch-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Savings Accounts:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"branch\",\"savingsAccountCount\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"branch-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Business Accounts:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"branch\",\"businessAccountCount\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\\n  \"],[11,\"div\",[]],[15,\"class\",\"card deposit-card\"],[13],[0,\"\\n    \"],[11,\"h3\",[]],[15,\"class\",\"card-title\"],[13],[0,\"Deposits\"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"branch-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Savings Deposits:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[0,\"Rs. \"],[1,[28,[\"branch\",\"totalSavingsDeposits\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"branch-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Business Deposits:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[0,\"Rs. \"],[1,[28,[\"branch\",\"totalBusinessDeposits\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\\n  \"],[11,\"div\",[]],[15,\"class\",\"card loan-card\"],[13],[0,\"\\n    \"],[11,\"h3\",[]],[15,\"class\",\"card-title\"],[13],[0,\"Loans\"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"branch-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Home Loans:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"branch\",\"homeLoanCount\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"branch-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Education Loans:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"branch\",\"educationLoanCount\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"branch-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Business Loans:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"branch\",\"businessLoanCount\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/manager-dashboard.hbs" } });
});
define("banker/templates/components/nav-bar", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "nQzup5y9", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"navbar\"],[13],[0,\"\\n  \"],[11,\"ul\",[]],[15,\"class\",\"nav-items\"],[13],[0,\"\\n\"],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"role\"]],[28,[\"userRole\",\"SUPERADMIN\"]]],null]],null,{\"statements\":[[0,\"      \"],[11,\"li\",[]],[5,[\"action\"],[[28,[null]],\"toUsers\"]],[13],[11,\"a\",[]],[13],[0,\"Users\"],[14],[14],[0,\"\\n      \"],[11,\"li\",[]],[5,[\"action\"],[[28,[null]],\"toBanks\"]],[13],[11,\"a\",[]],[13],[0,\"Banks\"],[14],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"unless\"],[[33,[\"eq\"],[[28,[\"role\"]],[28,[\"userRole\",\"SUPERADMIN\"]]],null]],null,{\"statements\":[[0,\"      \"],[11,\"li\",[]],[5,[\"action\"],[[28,[null]],\"todashboard\"]],[13],[11,\"a\",[]],[13],[0,\"DashBoard\"],[14],[14],[0,\"\\n      \"],[11,\"li\",[]],[5,[\"action\"],[[28,[null]],\"toBank\"]],[13],[11,\"a\",[]],[13],[0,\"Bank\"],[14],[14],[0,\"\\n\"],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"role\"]],[28,[\"userRole\",\"ADMIN\"]]],null]],null,{\"statements\":[[0,\"        \"],[11,\"li\",[]],[5,[\"action\"],[[28,[null]],\"toBranches\"]],[13],[11,\"a\",[]],[13],[0,\"Branches\"],[14],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"role\"]],[28,[\"userRole\",\"MANAGER\"]]],null]],null,{\"statements\":[[0,\"        \"],[11,\"li\",[]],[5,[\"action\"],[[28,[null]],\"toBranch\"]],[13],[11,\"a\",[]],[13],[0,\"Branch\"],[14],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"      \"],[11,\"li\",[]],[5,[\"action\"],[[28,[null]],\"toAccounts\"]],[13],[11,\"a\",[]],[13],[0,\"Accounts\"],[14],[14],[0,\"\\n      \"],[11,\"li\",[]],[5,[\"action\"],[[28,[null]],\"toTransactions\"]],[13],[11,\"a\",[]],[13],[0,\"Transactions\"],[14],[14],[0,\"\\n      \"],[11,\"li\",[]],[5,[\"action\"],[[28,[null]],\"toLoans\"]],[13],[11,\"a\",[]],[13],[0,\"Loans\"],[14],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"    \"],[14],[0,\"\\n\"],[6,[\"unless\"],[[33,[\"eq\"],[[28,[\"role\"]],[28,[\"userRole\",\"SUPERADMIN\"]]],null]],null,{\"statements\":[[6,[\"unless\"],[[33,[\"eq\"],[[28,[\"role\"]],[28,[\"userRole\",\"MANAGER\"]]],null]],null,{\"statements\":[[0,\"      \"],[11,\"div\",[]],[15,\"class\",\"branch-dropdown\"],[13],[0,\"\\n        \"],[11,\"select\",[]],[15,\"id\",\"branch\"],[16,\"value\",[26,[\"branch_name\"]],null],[16,\"onchange\",[33,[\"action\"],[[28,[null]],\"setbranch\"],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n          \"],[11,\"option\",[]],[15,\"value\",\"all\"],[13],[0,\"All Branches\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"branches\"]]],null,{\"statements\":[[0,\"            \"],[11,\"option\",[]],[16,\"value\",[28,[\"branch\",\"branch_name\"]],null],[13],[1,[28,[\"branch\",\"branch_name\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"branch\"]},null],[0,\"        \"],[14],[0,\"\\n      \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[]},null],[0,\"  \"],[11,\"button\",[]],[15,\"class\",\"logout\"],[5,[\"action\"],[[28,[null]],\"logout\"]],[13],[0,\"Logout\"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/nav-bar.hbs" } });
});
define("banker/templates/components/notify-box", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "x9D31usa", "block": "{\"statements\":[[11,\"div\",[]],[16,\"class\",[34,[\"notification-top-right \",[26,[\"type\"]]]]],[13],[0,\"\\n  \"],[1,[26,[\"message\"]],false],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/notify-box.hbs" } });
});
define("banker/templates/components/transaction-input", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "AwdyDvI3", "block": "{\"statements\":[[11,\"body\",[]],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"auth-form\"],[13],[0,\"\\n    \"],[11,\"h2\",[]],[13],[0,\"Make New Payment\"],[14],[0,\"\\n    \\n    \"],[11,\"form\",[]],[5,[\"action\"],[[28,[null]],\"submitForm\"],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n\"],[6,[\"unless\"],[[28,[\"isEmi\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"transaction_type\"],[13],[0,\"Transaction Type\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n          \"],[11,\"select\",[]],[15,\"id\",\"transaction_type\"],[15,\"class\",\"form-control\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"transaction_type\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n            \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"Select type\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"types\"]]],null,{\"statements\":[[0,\"              \"],[11,\"option\",[]],[16,\"value\",[28,[\"type\"]],null],[16,\"selected\",[33,[\"if\"],[[33,[\"eq\"],[[28,[\"type\"]],[28,[\"transaction_type\"]]],null],\"selected\"],null],null],[13],[1,[28,[\"type\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"type\"]},null],[0,\"          \"],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isEmi\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"transaction_type\"],[13],[0,\"Transaction Type\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n          \"],[11,\"input\",[]],[15,\"type\",\"text\"],[15,\"id\",\"transaction_type\"],[16,\"value\",[26,[\"transaction_type\"]],null],[15,\"class\",\"form-control\"],[15,\"disabled\",\"\"],[13],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"transaction_amount\"],[13],[0,\"Transaction Amount\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n        \"],[11,\"input\",[]],[15,\"type\",\"number\"],[15,\"id\",\"transaction_amount\"],[16,\"value\",[26,[\"transaction_amount\"]],null],[15,\"class\",\"form-control\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"transaction_amount\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[16,\"disabled\",[26,[\"isEmi\"]],null],[13],[14],[0,\"\\n      \"],[14],[0,\"\\n  \\n\"],[6,[\"if\"],[[28,[\"isDirect\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"accNo\"],[13],[0,\"Account Number\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n          \"],[11,\"select\",[]],[15,\"id\",\"accNo\"],[15,\"class\",\"form-control\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"accNo\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n            \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"Select Account Number\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"accounts\"]]],null,{\"statements\":[[0,\"              \"],[11,\"option\",[]],[16,\"value\",[28,[\"account\",\"acc_no\"]],null],[13],[1,[28,[\"account\",\"acc_no\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"account\"]},null],[0,\"          \"],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"  \\n      \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn-primary\"],[13],[0,\"Proceed\"],[14],[0,\"\\n      \\n\"],[6,[\"unless\"],[[28,[\"isEmi\"]]],null,{\"statements\":[[6,[\"link-to\"],[\"banks.bank.transactions\",[28,[\"bankId\"]]],null,{\"statements\":[[0,\"          \"],[11,\"button\",[]],[15,\"class\",\"btn-secondary\"],[13],[0,\"Cancel\"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[]},null],[0,\"      \\n\"],[6,[\"if\"],[[28,[\"isEmi\"]]],null,{\"statements\":[[0,\"        \"],[11,\"button\",[]],[15,\"class\",\"btn-secondary\"],[5,[\"action\"],[[28,[null]],\"cancel\"]],[13],[0,\"Cancel\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"  \\n\"],[6,[\"if\"],[[28,[\"errorMessage\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[0,\"* \"],[1,[26,[\"errorMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[1,[33,[\"notify-box\"],null,[[\"message\",\"type\"],[[28,[\"notification\",\"message\"]],[28,[\"notification\",\"type\"]]]]],false],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/transaction-input.hbs" } });
});
define("banker/templates/components/view-account", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "9diMPMIz", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"account-card-wrapper\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"account-card\"],[13],[0,\"\\n    \"],[11,\"h2\",[]],[13],[0,\"Account Details\"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"account-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Account Number:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"acc\",\"acc_no\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"account-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Account Type:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"acc\",\"acc_type\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"account-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Account Balance:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"acc\",\"acc_balance\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"account-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Branch Name:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"acc\",\"branch_name\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"account-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Status:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"acc\",\"acc_status\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n\"],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"acc\",\"acc_status\"]],[28,[\"status\",\"ACTIVE\"]]],null]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"view-wrap\"],[13],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"view-btn\"],[5,[\"action\"],[[28,[null]],\"loans\"]],[13],[0,\"View Loans\"],[14],[0,\"\\n         \"],[11,\"button\",[]],[15,\"class\",\"view-btn\"],[5,[\"action\"],[[28,[null]],\"transactions\"]],[13],[0,\"View Transactions\"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/view-account.hbs" } });
});
define("banker/templates/components/view-accounts", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "55Mt54+y", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"accounts-list\"],[13],[0,\"\\n  \"],[11,\"button\",[]],[15,\"class\",\"new-account-btn\"],[5,[\"action\"],[[28,[null]],\"addNewAccount\"]],[13],[0,\"New Account\"],[14],[0,\"\\n\\n  \"],[11,\"div\",[]],[15,\"class\",\"filters\"],[13],[0,\"\\n    \"],[11,\"label\",[]],[15,\"for\",\"accountType\"],[13],[0,\"Type \"],[14],[0,\"\\n    \"],[11,\"select\",[]],[15,\"id\",\"accountType\"],[16,\"value\",[26,[\"selectedAccountType\"]],null],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"selectedAccountType\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"All\"],[14],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"savings\"],[13],[0,\"Savings\"],[14],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"business\"],[13],[0,\"Business\"],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"label\",[]],[15,\"for\",\"accountStatus\"],[13],[0,\"Status \"],[14],[0,\"\\n    \"],[11,\"select\",[]],[15,\"id\",\"accountStatus\"],[16,\"value\",[26,[\"selectedAccountStatus\"]],null],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"selectedAccountStatus\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"All\"],[14],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"active\"],[13],[0,\"Active\"],[14],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"inactive\"],[13],[0,\"Inactive\"],[14],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"pending\"],[13],[0,\"Pending\"],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[11,\"button\",[]],[15,\"class\",\"clear\"],[5,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"selectedAccountType\"]]],null],\"\"]],[5,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"selectedAccountStatus\"]]],null],\"\"]],[13],[0,\"Clear\"],[14],[0,\"\\n  \"],[14],[0,\"\\n\\n\\n  \"],[11,\"table\",[]],[15,\"class\",\"accounts-table\"],[13],[0,\"\\n    \"],[11,\"thead\",[]],[13],[0,\"\\n      \"],[11,\"tr\",[]],[13],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Account No\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Type\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Status\"],[14],[0,\"\\n\"],[6,[\"unless\"],[[33,[\"eq\"],[[28,[\"role\"]],[28,[\"userRole\",\"CUSTOMER\"]]],null]],null,{\"statements\":[[0,\"        \"],[11,\"th\",[]],[13],[0,\"Username\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"unless\"],[[33,[\"eq\"],[[28,[\"role\"]],[28,[\"userRole\",\"MANAGER\"]]],null]],null,{\"statements\":[[0,\"        \"],[11,\"th\",[]],[13],[0,\"BranchName\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"unless\"],[[33,[\"eq\"],[[28,[\"role\"]],[28,[\"userRole\",\"CUSTOMER\"]]],null]],null,{\"statements\":[[0,\"          \"],[11,\"th\",[]],[13],[0,\"Actions\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"filteredAccounts\"]]],null,{\"statements\":[[0,\"        \"],[11,\"tr\",[]],[5,[\"action\"],[[28,[null]],\"viewAccount\",[28,[\"account\"]]]],[13],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"account\",\"acc_no\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"account\",\"acc_type\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"account\",\"acc_status\"]],false],[14],[0,\"\\n\"],[6,[\"unless\"],[[33,[\"eq\"],[[28,[\"role\"]],[28,[\"userRole\",\"CUSTOMER\"]]],null]],null,{\"statements\":[[0,\"          \"],[11,\"td\",[]],[13],[1,[28,[\"account\",\"username\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"unless\"],[[33,[\"eq\"],[[28,[\"role\"]],[28,[\"userRole\",\"MANAGER\"]]],null]],null,{\"statements\":[[0,\"          \"],[11,\"td\",[]],[13],[1,[28,[\"account\",\"branch_name\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"unless\"],[[33,[\"eq\"],[[28,[\"role\"]],[28,[\"userRole\",\"CUSTOMER\"]]],null]],null,{\"statements\":[[0,\"            \"],[11,\"td\",[]],[13],[0,\"\\n              \"],[11,\"button\",[]],[5,[\"action\"],[[28,[null]],\"editAccount\",[28,[\"account\"]]]],[13],[0,\"Edit\"],[14],[0,\"\\n            \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"        \"],[14],[0,\"\\n\"]],\"locals\":[\"account\"]},null],[0,\"    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/view-accounts.hbs" } });
});
define("banker/templates/components/view-loan", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "uNFElefF", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"loan-card-wrapper\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"loan-card\"],[13],[0,\"\\n    \"],[11,\"h2\",[]],[13],[0,\"Loan Details\"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"loan-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Loan Id:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"loan\",\"loan_id\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"loan-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Loan Type:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"loan\",\"loan_type\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"loan-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Loan Amount:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[0,\"Rs.\"],[1,[28,[\"loan\",\"loan_amount\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"loan-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Interest:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"loan\",\"loan_interest\"]],false],[0,\"%\"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"loan-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Duration:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"loan\",\"loan_duration\"]],false],[0,\" Months\"],[14],[0,\"\\n    \"],[14],[0,\"\\n     \"],[11,\"div\",[]],[15,\"class\",\"loan-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Status:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"loan\",\"loan_status\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n     \"],[11,\"div\",[]],[15,\"class\",\"loan-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Availed Date:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"loan\",\"loan_availed_date\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"loan-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Account Number:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"loan\",\"acc_number\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n\"],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"loan\",\"loan_status\"]],[28,[\"status\",\"APPROVED\"]]],null]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"view-wrap\"],[13],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"view-btn\"],[5,[\"action\"],[[28,[null]],\"toEmis\",[28,[\"loan\"]]]],[13],[0,\"View Emis\"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/view-loan.hbs" } });
});
define("banker/templates/components/view-loans", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Q69/v5GI", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"loans-list\"],[13],[0,\"\\n  \"],[11,\"button\",[]],[15,\"class\",\"new-loan-btn\"],[5,[\"action\"],[[28,[null]],\"addNewLoan\"]],[13],[0,\"New Loan\"],[14],[0,\"\\n\\n  \"],[11,\"div\",[]],[15,\"class\",\"filters\"],[13],[0,\"\\n    \"],[11,\"label\",[]],[15,\"for\",\"loanType\"],[13],[0,\"Type\"],[14],[0,\"\\n    \"],[11,\"select\",[]],[15,\"id\",\"loanType\"],[16,\"value\",[26,[\"selectedLoanType\"]],null],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"selectedLoanType\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"All\"],[14],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"homeloan\"],[13],[0,\"Home Loan\"],[14],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"businessloan\"],[13],[0,\"Business Loan\"],[14],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"educationloan\"],[13],[0,\"Education Loan\"],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"label\",[]],[15,\"for\",\"loanStatus\"],[13],[0,\"Status\"],[14],[0,\"\\n    \"],[11,\"select\",[]],[15,\"id\",\"loanStatus\"],[16,\"value\",[26,[\"selectedLoanStatus\"]],null],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"selectedLoanStatus\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"All\"],[14],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"approved\"],[13],[0,\"Approved\"],[14],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"pending\"],[13],[0,\"Pending\"],[14],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"rejected\"],[13],[0,\"Rejected\"],[14],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"closed\"],[13],[0,\"Closed\"],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"button\",[]],[15,\"class\",\"clear\"],[5,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"selectedLoanType\"]]],null],\"\"]],[5,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"selectedLoanStatus\"]]],null],\"\"]],[13],[0,\"Clear\"],[14],[0,\"\\n  \"],[14],[0,\"\\n\\n  \"],[11,\"table\",[]],[15,\"class\",\"loans-table\"],[13],[0,\"\\n    \"],[11,\"thead\",[]],[13],[0,\"\\n      \"],[11,\"tr\",[]],[13],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Loan ID\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Loan Type\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Loan Status\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Account Number\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Amount\"],[14],[0,\"\\n\"],[6,[\"unless\"],[[33,[\"eq\"],[[28,[\"role\"]],[28,[\"userRole\",\"CUSTOMER\"]]],null]],null,{\"statements\":[[0,\"        \"],[11,\"th\",[]],[13],[0,\"Action\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"filteredLoans\"]]],null,{\"statements\":[[0,\"        \"],[11,\"tr\",[]],[5,[\"action\"],[[28,[null]],\"viewLoan\",[28,[\"loan\"]]]],[13],[0,\"\\n           \"],[11,\"td\",[]],[13],[1,[28,[\"loan\",\"loan_id\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"loan\",\"loan_type\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"loan\",\"loan_status\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"loan\",\"acc_number\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[0,\"Rs.\"],[1,[28,[\"loan\",\"loan_amount\"]],false],[14],[0,\"\\n\"],[6,[\"unless\"],[[33,[\"eq\"],[[28,[\"role\"]],[28,[\"userRole\",\"CUSTOMER\"]]],null]],null,{\"statements\":[[0,\"            \"],[11,\"td\",[]],[13],[0,\"\\n              \"],[11,\"button\",[]],[15,\"class\",\"view-btn\"],[5,[\"action\"],[[28,[null]],\"editLoan\",[28,[\"loan\"]]]],[13],[0,\"Edit\"],[14],[0,\"\\n            \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"        \"],[14],[0,\"\\n\"]],\"locals\":[\"loan\"]},null],[0,\"    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/view-loans.hbs" } });
});
define("banker/templates/components/view-transaction", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "1BS0Z6Lz", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"transaction-card-wrapper\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"transaction-card\"],[13],[0,\"\\n    \"],[11,\"h2\",[]],[13],[0,\"Transaction Details\"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"transaction-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Transaction Id:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"transaction\",\"transaction_id\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"transaction-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Transaction Type:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"transaction\",\"transaction_type\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"transaction-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Transaction Amount:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[0,\"Rs.\"],[1,[28,[\"transaction\",\"transaction_amount\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"transaction-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Status:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"transaction\",\"transaction_status\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"transaction-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Date and Time:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"transaction\",\"transaction_datetime\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"transaction-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Account Number:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"transaction\",\"acc_number\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n   \\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/view-transaction.hbs" } });
});
define("banker/templates/components/view-transactions", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "pJ9Uqduc", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"transactions-list\"],[13],[0,\"\\n  \"],[11,\"button\",[]],[15,\"class\",\"new-transaction-btn\"],[5,[\"action\"],[[28,[null]],\"addNewTransaction\"]],[13],[0,\"New Transaction\"],[14],[0,\"\\n\\n  \"],[11,\"div\",[]],[15,\"class\",\"filters\"],[13],[0,\"\\n    \"],[11,\"label\",[]],[15,\"for\",\"transactionType\"],[13],[0,\"Type\"],[14],[0,\"\\n    \"],[11,\"select\",[]],[15,\"id\",\"transactionType\"],[16,\"value\",[26,[\"selectedTransactionType\"]],null],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"selectedTransactionType\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"All\"],[14],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"emi\"],[13],[0,\"EMI\"],[14],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"debit\"],[13],[0,\"Debit\"],[14],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"credit\"],[13],[0,\"Credit\"],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"label\",[]],[15,\"for\",\"transactionStatus\"],[13],[0,\"Status\"],[14],[0,\"\\n    \"],[11,\"select\",[]],[15,\"id\",\"transactionStatus\"],[16,\"value\",[26,[\"selectedTransactionStatus\"]],null],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"selectedTransactionStatus\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"All\"],[14],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"success\"],[13],[0,\"Success\"],[14],[0,\"\\n      \"],[11,\"option\",[]],[15,\"value\",\"pending\"],[13],[0,\"Pending\"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \\n    \"],[11,\"button\",[]],[15,\"class\",\"clear\"],[5,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"selectedTransactionType\"]]],null],\"\"]],[5,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"selectedTransactionStatus\"]]],null],\"\"]],[13],[0,\"Clear\"],[14],[0,\"\\n  \"],[14],[0,\"\\n\\n  \"],[11,\"table\",[]],[15,\"class\",\"transactions-table\"],[13],[0,\"\\n    \"],[11,\"thead\",[]],[13],[0,\"\\n      \"],[11,\"tr\",[]],[13],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Transaction ID\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Transaction Type\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Account Number\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Amount\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Date and Time\"],[14],[0,\"\\n      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"filteredTransactions\"]]],null,{\"statements\":[[0,\"        \"],[11,\"tr\",[]],[5,[\"action\"],[[28,[null]],\"viewTransaction\",[28,[\"transaction\"]]]],[13],[0,\"\\n           \"],[11,\"td\",[]],[13],[1,[28,[\"transaction\",\"transaction_id\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"transaction\",\"transaction_type\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"transaction\",\"acc_number\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[0,\"Rs.\"],[1,[28,[\"transaction\",\"transaction_amount\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"transaction\",\"transaction_datetime\"]],false],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[\"transaction\"]},null],[0,\"    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/view-transactions.hbs" } });
});
define("banker/templates/login", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ReGcfSnU", "block": "{\"statements\":[[0,\"\\n\"],[1,[33,[\"auth-form\"],null,[[\"isSignup\",\"onLogin\",\"toSignup\"],[false,[33,[\"action\"],[[28,[null]],\"login\"],null],[33,[\"action\"],[[28,[null]],\"toggleMode\"],null]]]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/login.hbs" } });
});
define("banker/templates/register", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "A1DaQ2EA", "block": "{\"statements\":[[0,\"\\n\"],[1,[33,[\"auth-form\"],null,[[\"isSignup\",\"onSignup\",\"toLogin\"],[true,[33,[\"action\"],[[28,[null]],\"signup\"],null],[33,[\"action\"],[[28,[null]],\"toggleMode\"],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/register.hbs" } });
});
define("banker/templates/super-admin-login", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "2cA4znvo", "block": "{\"statements\":[[0,\"\\n\"],[1,[33,[\"auth-form\"],null,[[\"isSuper\",\"toSuperAdmin\"],[true,[33,[\"action\"],[[28,[null]],\"SuperAdminLogin\"],null]]]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/super-admin-login.hbs" } });
});
define("banker/templates/users", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "lod6kaI3", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/users.hbs" } });
});
define("banker/templates/users/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Bv7zEUUB", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"filters\"],[13],[0,\"\\n  \"],[11,\"label\",[]],[15,\"for\",\"userRole\"],[13],[0,\"Role\"],[14],[0,\"\\n  \"],[11,\"select\",[]],[15,\"id\",\"userRole\"],[16,\"value\",[26,[\"selectedUserRole\"]],null],[16,\"onchange\",[33,[\"action\"],[[28,[null]],\"updateUserRole\"],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n    \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"All\"],[14],[0,\"\\n    \"],[11,\"option\",[]],[15,\"value\",\"admin\"],[13],[0,\"Admin\"],[14],[0,\"\\n    \"],[11,\"option\",[]],[15,\"value\",\"customer\"],[13],[0,\"Customer\"],[14],[0,\"\\n    \"],[11,\"option\",[]],[15,\"value\",\"manager\"],[13],[0,\"Manager\"],[14],[0,\"\\n  \"],[14],[0,\"\\n\\n  \"],[11,\"label\",[]],[15,\"for\",\"userStatus\"],[13],[0,\"Status\"],[14],[0,\"\\n  \"],[11,\"select\",[]],[15,\"id\",\"userStatus\"],[16,\"value\",[26,[\"selectedUserStatus\"]],null],[16,\"onchange\",[33,[\"action\"],[[28,[null]],\"updateUserStatus\"],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n    \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"All\"],[14],[0,\"\\n     \"],[11,\"option\",[]],[15,\"value\",\"pending\"],[13],[0,\"Pending\"],[14],[0,\"\\n    \"],[11,\"option\",[]],[15,\"value\",\"active\"],[13],[0,\"Active\"],[14],[0,\"\\n    \"],[11,\"option\",[]],[15,\"value\",\"inactive\"],[13],[0,\"Inactive\"],[14],[0,\"\\n   \\n  \"],[14],[0,\"\\n   \"],[11,\"button\",[]],[15,\"class\",\"clear\"],[5,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"selectedUserRole\"]]],null],\"\"]],[5,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"selectedUserStatus\"]]],null],\"\"]],[13],[0,\"Clear\"],[14],[0,\"\\n  \\n\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"users-list\"],[13],[0,\"\\n  \"],[11,\"table\",[]],[15,\"class\",\"users-table\"],[13],[0,\"\\n    \"],[11,\"thead\",[]],[13],[0,\"\\n      \"],[11,\"tr\",[]],[13],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Username\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Role\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Status\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Actions\"],[14],[0,\"\\n      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"filteredUsers\"]]],null,{\"statements\":[[0,\"        \"],[11,\"tr\",[]],[5,[\"action\"],[[28,[null]],\"viewUser\",[28,[\"user\"]]]],[13],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"user\",\"username\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"user\",\"user_role\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"user\",\"user_status\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[0,\"\\n            \"],[11,\"button\",[]],[5,[\"action\"],[[28,[null]],\"editUser\",[28,[\"user\"]]]],[13],[0,\"Edit\"],[14],[0,\"\\n\"],[6,[\"if\"],[[33,[\"eq\"],[[28,[\"user\",\"user_status\"]],[28,[\"status\",\"PENDING\"]]],null]],null,{\"statements\":[[0,\"            \"],[11,\"button\",[]],[5,[\"action\"],[[28,[null]],\"deleteUser\",[28,[\"user\"]]],[[\"bubbles\"],[false]]],[13],[0,\"Delete\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"          \"],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[\"user\"]},null],[0,\"    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n \"],[1,[33,[\"notify-box\"],null,[[\"message\",\"type\"],[[28,[\"notification\",\"message\"]],[28,[\"notification\",\"type\"]]]]],false],[0,\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/users/index.hbs" } });
});
define("banker/templates/users/user", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "T61ZsWzC", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/users/user.hbs" } });
});
define("banker/templates/users/user/edit", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "y0Nn05EQ", "block": "{\"statements\":[[11,\"body\",[]],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"user-form\"],[13],[0,\"\\n    \"],[11,\"h2\",[]],[13],[0,\"Edit User\"],[14],[0,\"\\n    \\n    \"],[11,\"form\",[]],[5,[\"action\"],[[28,[null]],\"submitForm\"],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"userId\"],[13],[0,\"User ID\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n        \"],[11,\"input\",[]],[15,\"type\",\"text\"],[15,\"id\",\"userId\"],[16,\"value\",[26,[\"userId\"]],null],[15,\"class\",\"form-control\"],[15,\"disabled\",\"\"],[13],[14],[0,\"\\n      \"],[14],[0,\"\\n\\n      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"user_status\"],[13],[0,\"User Status\"],[11,\"span\",[]],[15,\"style\",\"color:rgb(237, 69, 69);\"],[13],[0,\"*\"],[14],[14],[0,\"\\n        \"],[11,\"select\",[]],[15,\"id\",\"user_status\"],[15,\"class\",\"form-control\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"user_status\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n          \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"Select Status\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"statuses\"]]],null,{\"statements\":[[0,\"            \"],[11,\"option\",[]],[16,\"value\",[28,[\"status\"]],null],[16,\"selected\",[33,[\"if\"],[[33,[\"eq\"],[[28,[\"status\"]],[28,[\"user_status\"]]],null],\"selected\"],null],null],[13],[1,[28,[\"status\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"status\"]},null],[0,\"        \"],[14],[0,\"\\n      \"],[14],[0,\"\\n\\n      \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn-primary\"],[13],[0,\"Update User\"],[14],[0,\"\\n      \\n\"],[6,[\"link-to\"],[\"users\"],null,{\"statements\":[[0,\"        \"],[11,\"button\",[]],[15,\"class\",\"btn-secondary\"],[5,[\"action\"],[[28,[null]],\"cancel\"]],[13],[0,\"Cancel\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"errorMessage\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[0,\"* \"],[1,[26,[\"errorMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[1,[33,[\"notify-box\"],null,[[\"message\",\"type\"],[[28,[\"notification\",\"message\"]],[28,[\"notification\",\"type\"]]]]],false],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/users/user/edit.hbs" } });
});
define("banker/templates/users/user/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "XZAq4Sdc", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"user-card-wrapper\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"user-card\"],[13],[0,\"\\n    \"],[11,\"h2\",[]],[13],[0,\"User Details\"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"user-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"User ID:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"user\",\"user_id\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"user-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Full Name:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"user\",\"fullname\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"user-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Username:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"user\",\"username\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"user-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Phone Number:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"user\",\"user_phonenumber\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"user-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Address:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"user\",\"user_address\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"user-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Role:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"user\",\"user_role\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"user-field\"],[13],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-label\"],[13],[0,\"Status:\"],[14],[0,\"\\n      \"],[11,\"span\",[]],[15,\"class\",\"field-value\"],[13],[1,[28,[\"user\",\"user_status\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n   \\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/users/user/index.hbs" } });
});
define('banker/utils/util', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var role = {
        ADMIN: 'ADMIN',
        MANAGER: 'MANAGER',
        CUSTOMER: 'CUSTOMER',
        SUPERADMIN: 'SUPERADMIN'
    };

    var status = {
        PENDING: 'pending',
        ACTIVE: 'active',
        INACTIVE: 'inactive'
    };

    var accountType = {
        SAVINGS: 'savings',
        BUSINESS: 'business'
    };

    var loanStatus = {
        APPROVED: 'approved',
        CLOSED: 'closed',
        PENDING: 'pending',
        REJECTED: 'rejected'
    };

    var loanType = {
        BUSINESSLOAN: 'businessloan',
        HOMELOAN: 'homeloan',
        EDUCATIONLOAN: 'educationloan'
    };

    var transactionStatus = {
        PENDING: 'pending',
        SUCCESS: 'success'
    };

    var transactionType = {
        DEBIT: 'debit',
        CREDIT: 'credit',
        EMI: 'emi'
    };

    var getSessionData = function getSessionData() {
        var value = '; ' + document.cookie;
        var parts = value.split('; sessionData=');
        if (parts.length === 2) {
            var cookieData = decodeURIComponent(parts.pop().split(';').shift());
            return JSON.parse(cookieData);
        }
        return null;
    };
    exports.role = role;
    exports.status = status;
    exports.accountType = accountType;
    exports.loanStatus = loanStatus;
    exports.loanType = loanType;
    exports.transactionStatus = transactionStatus;
    exports.transactionType = transactionType;
    exports.getSessionData = getSessionData;
});


define('banker/config/environment', ['ember'], function(Ember) {
  var prefix = 'banker';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("banker/app")["default"].create({"name":"banker","version":"0.0.0+7e8576eb"});
}
//# sourceMappingURL=banker.map
