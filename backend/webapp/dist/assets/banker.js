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
define('banker/components/auth-form', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
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
    BankNames: [],
    isSignup: false,
    BankId: '',
    init: function init() {
      this._super.apply(this, arguments);
      // this.loadBanks();
    },


    // loadBanks() {
    //   this.get('accountsService').fetchBanks().then((response) => {
    //     this.set('bankNames', response);
    //   }).catch((error) => {
    //     console.error("Failed to load banks:", error);
    //   });
    // },

    // setBankId()
    // {
    //   for(bank in bankNames)
    //   {
    //     if(bank.bank_name == bank_name)
    //     {
    //       this.set('BankId',bank.bank_id);
    //       console.log(bankId);
    //     }
    //   }
    // },
    actions: {
      submitForm: function submitForm() {
        var username = this.get('username');
        var password = this.get('password');
        var selectedRole = this.get('selectedRole');

        if (!username || !password) {
          this.set('errorMessage', 'Username and password are required.');
          return;
        }

        if (password.length < 8) {
          this.set('errorMessage', 'Password must be at least 8 characters long.');
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

        // console.log('Submit button pressed'+action);  

        var credentials = {
          username: this.get('username'),
          password: this.get('password'),
          selectedRole: this.get('selectedRole'),
          name: this.get('name'),
          dob: this.get('dob'),
          addr: this.get('addr'),
          pno: this.get('pno')
        };
        this.sendAction(action, credentials);
        // this.setBankId();
      },
      toggleMode: function toggleMode() {
        var action = this.get('isSignup') ? 'toLogin' : 'toSignup';
        if (action == 'toLogin') this.set('isSignup', false);else this.set('isSignup', true);

        this.sendAction(action);
      }
    }
  });
});
define('banker/components/input-form', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({

    accountsService: Ember.inject.service('accounts'),
    errorMessage: '',
    branchNames: [],
    statuses: ['active', 'pending', 'inactive'],
    types: ['savings', 'business'],

    init: function init() {
      this._super.apply(this, arguments);
      this.loadBranches();
    },

    acc_no: '',
    acc_type: '',
    // acc_balance: '',
    fullname: '',
    acc_status: '',
    username: '',
    branch_name: '',
    isEdit: false,

    loadBranches: function loadBranches() {
      var _this = this;

      this.get('accountsService').fetchBranches().then(function (response) {
        _this.set('branchNames', response);
      }).catch(function (error) {
        console.error("Failed to load branches:", error);
      });
    },
    isBranchSelected: function isBranchSelected(branch) {
      return this.get('branch_name') === branch;
    },


    actions: {
      submitForm: function submitForm() {
        var _this2 = this;

        if (!this.get('types').includes(this.get('acc_type'))) {
          this.set("errorMessage", 'Please select a valid account type.');
          return;
        }

        if (!this.get('statuses').includes(this.get('acc_status'))) {
          this.set("errorMessage", "Please select a valid account status.");
          return;
        }

        if (!this.get('username') || this.get('username').trim() === '') {
          this.set("errorMessage", 'Username cannot be empty.');
          return;
        }

        if (!this.get('branch_name') || this.get('branch_name').trim() === '') {
          this.set("errorMessage", 'Please select a branch.');
          return;
        }

        var accountData = {
          acc_no: this.get('acc_no'),
          acc_type: this.get('acc_type'),
          // acc_balance: this.get('acc_balance'),
          acc_status: this.get('acc_status'),
          fullname: this.get('fullname'),
          username: this.get('username'),
          branch_name: this.get('branch_name')
        };

        if (this.get('isEdit')) {

          this.get('accountsService').updateAccount(accountData).then(function () {
            // alert('Account updated successfully!');
            _this2.resetForm();
            _this2.sendAction("toAccount");
          }).catch(function (error) {
            // alert('Error updating account');
            console.error(error);
          });
        } else {

          this.get('accountsService').createAccount(accountData).then(function () {
            // alert('Account created successfully!');
            _this2.resetForm();
            _this2.sendAction("toAccount");
          }).catch(function (error) {
            // alert('Error creating account');
            console.error(error);
          });
        }
      }
    },

    resetForm: function resetForm() {
      this.setProperties({
        acc_no: '',
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
define('banker/controllers/accounts', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    accountsService: Ember.inject.service('accounts'),

    accounts: [],
    init: function init() {
      this._super.apply(this, arguments);
      this.loadAccounts();
    },
    loadAccounts: function loadAccounts() {
      var _this = this;

      this.get('accountsService').fetchAccounts().then(function (response) {
        _this.set('accounts', response);
      }).catch(function (error) {
        console.error("Failed to load accounts:", error);
      });
    },


    actions: {
      addNewAccount: function addNewAccount() {

        this.transitionToRoute('inputform');
      },
      editAccount: function editAccount(account) {
        this.transitionToRoute('inputform').then(function (newRoute) {

          newRoute.controller.setProperties({
            isEdit: true,
            acc_no: account.acc_no,
            acc_type: account.acc_type,
            acc_balance: account.acc_balance,
            acc_status: account.acc_status,
            username: account.username,
            fullname: account.user_fullname,
            branch_name: account.branch_name
          });
        }).catch(function (error) {
          console.error("Transition failed", error);
        });
      }
    }
  });
});
define('banker/controllers/dashboard', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({

        session: Ember.inject.service(),
        actions: {
            logout: function logout() {
                var _this = this;

                this.get('session').logout().then(function () {
                    _this.transitionToRoute('login');
                });
            }
        }
    });
});
define("banker/controllers/inputform", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    actions: {
      toAccount: function toAccount() {
        this.transitionToRoute("accounts");
      }
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

    actions: {
      login: function login(credentials) {
        var _this = this;

        // console.log('Login action triggered'); 
        // console.log(credentials);
        this.get('session').login(credentials).then(function () {
          _this.transitionToRoute('dashboard');
        }).catch(function (error) {
          _this.set('errorMessage', error.message || 'Login failed');
        });
      },
      signup: function signup(credentials) {
        var _this2 = this;

        // console.log('signup action triggered'); 

        this.get('session').signup(credentials).then(function () {
          _this2.transitionToRoute('dashboard');
        }).catch(function (error) {
          _this2.set('errorMessage', error.message || 'Signup failed');
        });
      },
      logout: function logout() {
        var _this3 = this;

        this.get('session').logout().then(function () {
          _this3.transitionToRoute('login');
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
          _this.transitionToRoute('dashboard');
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
define('banker/helpers/eq', ['exports'], function (exports) {
  'use strict';

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

    return param1 === param2;
  }

  exports.default = Ember.Helper.helper(eq);
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
    this.route('dashboard', { path: "/banker/dashboard" });
    this.route('accounts', { path: "/banker/banks/:bankId/accounts" });
    this.route('inputform', { path: "/banker/inputform" });
  });

  exports.default = Router;
});
define('banker/routes/accounts', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('banker/routes/dashboard', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {
            if (document.cookie == '') {
                this.transitionTo('login');
            }
        }
    });
});
define('banker/routes/inputform', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({});
});
define('banker/routes/login', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {
            if (document.cookie != '') {
                this.transitionTo('dashboard');
            }
        }
    });
});
define('banker/routes/register', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {
            if (document.cookie != '') {
                this.transitionTo('dashboard');
            }
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

    fetchAccounts: function fetchAccounts() {
      return Ember.$.ajax({
        url: 'http://localhost:8080/banker/api/v1/accounts',
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
    createAccount: function createAccount(accountDetails) {
      var acc_type = accountDetails.acc_type,
          acc_status = accountDetails.acc_status,
          username = accountDetails.username,
          branch_name = accountDetails.branch_name;


      console.log("insert...");
      return Ember.$.ajax({
        url: 'http://localhost:8080/banker/api/v1/accounts',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          // acc_no,
          acc_type: acc_type,
          // acc_balance,
          acc_status: acc_status,
          username: username,
          branch_name: branch_name
        }),

        success: function success(response) {
          return response;
        },
        error: function error(_error2) {
          console.log("insert...err");
          throw _error2.responseJSON || _error2;
        }
      });
    },


    // Update an account
    updateAccount: function updateAccount(accountDetails) {
      var acc_no = accountDetails.acc_no,
          acc_type = accountDetails.acc_type,
          acc_status = accountDetails.acc_status,
          fullname = accountDetails.fullname,
          username = accountDetails.username,
          branch_name = accountDetails.branch_name;


      return Ember.$.ajax({
        url: 'http://localhost:8080/banker/api/v1/accounts/' + acc_no,
        type: 'PUT',
        contentType: 'application/json',

        data: JSON.stringify({

          acc_type: acc_type,
          // acc_balance,
          fullname: fullname,
          acc_status: acc_status,
          username: username,
          branch_name: branch_name
        }),
        success: function success(response) {
          return response;
        },
        error: function error(_error3) {
          throw _error3.responseJSON || _error3;
        }
      });
    },
    fetchBranches: function fetchBranches() {
      return Ember.$.ajax({
        url: 'http://localhost:8080/banker/api/v1/branch',
        type: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true
        },
        success: function success(response) {
          // console.log("branches");
          return response;
        },
        error: function error(_error4) {
          console.error("Error fetching branches:", _error4);
          // if (error.responseJSON) {
          //   alert(`Error: ${error.responseJSON.message}`);
          // } else {
          //   alert("An error occurred while fetching branches.");
          // }
          throw _error4.responseJSON || _error4;
        }
      });
    },
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
        error: function error(_error5) {
          console.error("Error fetching banks:", _error5);
          if (_error5.responseJSON) {
            alert('Error: ' + _error5.responseJSON.message);
          } else {
            alert("An error occurred while fetching banks.");
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
define('banker/services/session', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    ajax: Ember.inject.service(),

    login: function login(credentials) {
      var username = credentials.username,
          password = credentials.password,
          selectedRole = credentials.selectedRole;

      // console.log(credentials);

      return Ember.$.ajax({
        url: 'http://localhost:8080/banker/api/v1/login?action=login',
        type: 'POST',
        credentials: 'include',
        contentType: 'application/json',
        data: JSON.stringify({ username: username, password: password, user_role: selectedRole }),
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
        url: 'http://localhost:8080/banker/api/v1/login?action=register',
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
          throw _error2.responseJSON || _error2;
        }
      });
    },
    logout: function logout() {

      return Ember.$.ajax({
        url: 'http://localhost:8080/banker/api/v1/login?action=logout',
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
define("banker/templates/accounts", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "N6svI8D8", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"accounts-list\"],[13],[0,\"\\n  \"],[11,\"button\",[]],[15,\"class\",\"new-account-btn\"],[5,[\"action\"],[[28,[null]],\"addNewAccount\"]],[13],[0,\"New Account\"],[14],[0,\"\\n  \\n  \"],[11,\"table\",[]],[15,\"class\",\"accounts-table\"],[13],[0,\"\\n    \"],[11,\"thead\",[]],[13],[0,\"\\n      \"],[11,\"tr\",[]],[13],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Account No\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Type\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Balance\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Status\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Fullname\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"BranchName\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"Actions\"],[14],[0,\"\\n      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"accounts\"]]],null,{\"statements\":[[0,\"        \"],[11,\"tr\",[]],[13],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"account\",\"acc_no\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"account\",\"acc_type\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"account\",\"acc_balance\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"account\",\"acc_status\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"account\",\"user_fullname\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"account\",\"branch_name\"]],false],[14],[0,\"\\n          \"],[11,\"td\",[]],[13],[0,\"\\n            \"],[11,\"button\",[]],[5,[\"action\"],[[28,[null]],\"editAccount\",[28,[\"account\"]]]],[13],[0,\"Edit\"],[14],[0,\"\\n          \"],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[\"account\"]},null],[0,\"    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/accounts.hbs" } });
});
define("banker/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "jgsFTrz+", "block": "{\"statements\":[[0,\"\\n\"],[1,[26,[\"outlet\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/application.hbs" } });
});
define("banker/templates/components/auth-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "tvgfgsMw", "block": "{\"statements\":[[11,\"body\",[]],[13],[0,\"\\n\"],[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"auth-form\"],[13],[0,\"\\n      \"],[11,\"h2\",[]],[13],[1,[33,[\"if\"],[[28,[\"isSignup\"]],\"Register\",\"Login\"],null],false],[14],[0,\"\\n      \"],[11,\"form\",[]],[5,[\"action\"],[[28,[null]],\"submitForm\"],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isSignup\"]]],null,{\"statements\":[[0,\"          \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n            \"],[11,\"label\",[]],[15,\"for\",\"name\"],[13],[0,\"Name\"],[14],[0,\"\\n            \"],[11,\"input\",[]],[15,\"id\",\"name\"],[15,\"type\",\"text\"],[16,\"value\",[26,[\"name\"]],null],[15,\"class\",\"form-control\"],[15,\"placeholder\",\"Enter your full name\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"name\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n          \"],[14],[0,\"\\n          \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n            \"],[11,\"label\",[]],[15,\"for\",\"dob\"],[13],[0,\"Date of Birth\"],[14],[0,\"\\n            \"],[11,\"input\",[]],[15,\"id\",\"dob\"],[15,\"type\",\"date\"],[16,\"value\",[26,[\"dob\"]],null],[15,\"class\",\"form-control\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"dob\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n          \"],[14],[0,\"\\n          \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n            \"],[11,\"label\",[]],[15,\"for\",\"pno\"],[13],[0,\"Phone Number\"],[14],[0,\"\\n            \"],[11,\"input\",[]],[15,\"id\",\"pno\"],[15,\"type\",\"number\"],[16,\"value\",[26,[\"pno\"]],null],[15,\"class\",\"form-control\"],[15,\"placeholder\",\"Enter your phone number\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"pno\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n          \"],[14],[0,\"\\n          \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n            \"],[11,\"label\",[]],[15,\"for\",\"addr\"],[13],[0,\"Address\"],[14],[0,\"\\n            \"],[11,\"textarea\",[]],[15,\"id\",\"addr\"],[16,\"value\",[26,[\"addr\"]],null],[15,\"class\",\"form-control\"],[15,\"placeholder\",\"Enter your address\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"addr\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n          \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"username\"],[13],[0,\"Username\"],[14],[0,\"\\n          \"],[11,\"input\",[]],[15,\"id\",\"username\"],[15,\"type\",\"text\"],[16,\"value\",[26,[\"username\"]],null],[15,\"class\",\"form-control\"],[15,\"placeholder\",\"Enter your username\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"username\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n        \"],[14],[0,\"\\n\\n        \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"password\"],[13],[0,\"Password\"],[14],[0,\"\\n          \"],[11,\"input\",[]],[15,\"id\",\"password\"],[15,\"type\",\"password\"],[16,\"value\",[26,[\"password\"]],null],[15,\"class\",\"form-control\"],[15,\"placeholder\",\"Enter your password\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"password\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n        \"],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"isSignup\"]]],null,{\"statements\":[[0,\"          \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n            \"],[11,\"label\",[]],[15,\"for\",\"confirmPassword\"],[13],[0,\"Confirm Password\"],[14],[0,\"\\n            \"],[11,\"input\",[]],[15,\"id\",\"confirmPassword\"],[15,\"type\",\"password\"],[16,\"value\",[26,[\"confirmPassword\"]],null],[15,\"class\",\"form-control\"],[15,\"placeholder\",\"Confirm your password\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"confirmPassword\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n          \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n          \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n            \"],[11,\"label\",[]],[15,\"for\",\"role\"],[13],[0,\"Role\"],[14],[0,\"\\n            \"],[11,\"select\",[]],[15,\"id\",\"role\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"selectedRole\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[15,\"class\",\"form-control\"],[13],[0,\"\\n              \"],[11,\"option\",[]],[15,\"value\",\"\"],[15,\"disabled\",\"\"],[15,\"selected\",\"\"],[13],[0,\"Select a role\"],[14],[0,\"\\n              \"],[11,\"option\",[]],[15,\"value\",\"manager\"],[13],[0,\"Manager\"],[14],[0,\"\\n              \"],[11,\"option\",[]],[15,\"value\",\"customer\"],[13],[0,\"Customer\"],[14],[0,\"\\n\"],[6,[\"unless\"],[[28,[\"isSignup\"]]],null,{\"statements\":[[0,\"               \"],[11,\"option\",[]],[15,\"value\",\"admin\"],[13],[0,\"Admin\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"            \"],[14],[0,\"\\n          \"],[14],[0,\"\\n\"],[0,\"         \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn-primary\"],[13],[1,[33,[\"if\"],[[28,[\"isSignup\"]],\"Register\",\"Login\"],null],false],[14],[0,\"\\n        \"],[14],[0,\"\\n        \\n      \"],[14],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"switch\"],[5,[\"action\"],[[28,[null]],\"toggleMode\"]],[13],[1,[33,[\"if\"],[[28,[\"isSignup\"]],\"Switch to Login\",\"Switch to Register\"],null],false],[14],[0,\"\\n      \"],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"errorMessage\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[0,\"* \"],[1,[26,[\"errorMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"    \"],[14],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/auth-form.hbs" } });
});
define("banker/templates/components/input-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ypIYaWQL", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"account-form\"],[13],[0,\"\\n  \"],[11,\"h2\",[]],[13],[1,[33,[\"if\"],[[28,[\"isEdit\"]],\"Edit Account\",\"Create New Account\"],null],false],[14],[0,\"\\n  \\n  \"],[11,\"form\",[]],[5,[\"action\"],[[28,[null]],\"submitForm\"],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isEdit\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"acc_no\"],[13],[0,\"Account Number\"],[14],[0,\"\\n      \"],[11,\"input\",[]],[15,\"type\",\"text\"],[15,\"id\",\"acc_no\"],[16,\"value\",[26,[\"acc_no\"]],null],[15,\"class\",\"form-control\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"acc_no\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[16,\"disabled\",[26,[\"isEdit\"]],null],[13],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"acc_type\"],[13],[0,\"Account Type\"],[14],[0,\"\\n      \"],[11,\"select\",[]],[15,\"id\",\"acc_type\"],[15,\"class\",\"form-control\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"acc_type\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n        \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"Select type\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"types\"]]],null,{\"statements\":[[0,\"          \"],[11,\"option\",[]],[16,\"value\",[28,[\"type\"]],null],[16,\"selected\",[33,[\"if\"],[[33,[\"eq\"],[[28,[\"type\"]],[28,[\"acc_type\"]]],null],\"selected\"],null],null],[13],[1,[28,[\"type\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"type\"]},null],[0,\"      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"acc_status\"],[13],[0,\"Account Status\"],[14],[0,\"\\n      \"],[11,\"select\",[]],[15,\"id\",\"acc_status\"],[15,\"class\",\"form-control\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"acc_status\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n        \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"Select Status\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"statuses\"]]],null,{\"statements\":[[0,\"          \"],[11,\"option\",[]],[16,\"value\",[28,[\"status\"]],null],[16,\"selected\",[33,[\"if\"],[[33,[\"eq\"],[[28,[\"status\"]],[28,[\"acc_status\"]]],null],\"selected\"],null],null],[13],[1,[28,[\"status\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"status\"]},null],[0,\"      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"username\"],[13],[0,\"Username\"],[14],[0,\"\\n      \"],[11,\"input\",[]],[15,\"type\",\"text\"],[15,\"id\",\"username\"],[16,\"value\",[26,[\"username\"]],null],[15,\"class\",\"form-control\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"username\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n    \"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isEdit\"]]],null,{\"statements\":[[0,\"      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"for\",\"fullname\"],[13],[0,\"Fullname\"],[14],[0,\"\\n        \"],[11,\"input\",[]],[15,\"type\",\"text\"],[15,\"id\",\"fullname\"],[16,\"value\",[26,[\"fullname\"]],null],[15,\"class\",\"form-control\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"fullname\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n      \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n      \"],[11,\"label\",[]],[15,\"for\",\"branch_name\"],[13],[0,\"Branch Name\"],[14],[0,\"\\n      \"],[11,\"select\",[]],[15,\"id\",\"branch_name\"],[15,\"class\",\"form-control\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"branch_name\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n        \"],[11,\"option\",[]],[15,\"value\",\"\"],[13],[0,\"Select branch\"],[14],[0,\"\\n\"],[6,[\"each\"],[[28,[\"branchNames\"]]],null,{\"statements\":[[0,\"          \"],[11,\"option\",[]],[16,\"value\",[28,[\"branch\",\"branch_name\"]],null],[16,\"selected\",[33,[\"if\"],[[33,[\"eq\"],[[28,[\"branch\",\"branch_name\"]],[28,[\"branch_name\"]]],null],\"selected\"],null],null],[13],[1,[28,[\"branch\",\"branch_name\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"branch\"]},null],[0,\"      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn-primary\"],[13],[1,[33,[\"if\"],[[28,[\"isEdit\"]],\"Update Account\",\"Create Account\"],null],false],[14],[0,\"\\n   \\n\"],[6,[\"link-to\"],[\"accounts\",1],null,{\"statements\":[[0,\"    \"],[11,\"button\",[]],[15,\"class\",\"btn-secondary\"],[13],[0,\"Cancel\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"errorMessage\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[0,\"* \"],[1,[26,[\"errorMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/input-form.hbs" } });
});
define("banker/templates/dashboard", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "d0uyzTND", "block": "{\"statements\":[[11,\"button\",[]],[15,\"class\",\"btn-primary\"],[5,[\"action\"],[[28,[null]],\"logout\"]],[13],[0,\"Logout\"],[14],[0,\"\\n\"],[11,\"button\",[]],[15,\"class\",\"btn-primary\"],[13],[6,[\"link-to\"],[\"accounts\",[28,[\"bank\",\"bankId\"]]],null,{\"statements\":[],\"locals\":[]},null],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/dashboard.hbs" } });
});
define("banker/templates/inputform", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "P2iha0DX", "block": "{\"statements\":[[1,[33,[\"input-form\"],null,[[\"isEdit\",\"acc_no\",\"acc_type\",\"acc_balance\",\"acc_status\",\"username\",\"branch_name\",\"toAccount\"],[[28,[null,\"isEdit\"]],[28,[null,\"acc_no\"]],[28,[null,\"acc_type\"]],[28,[null,\"acc_balance\"]],[28,[null,\"acc_status\"]],[28,[null,\"username\"]],[28,[null,\"branch_name\"]],[33,[\"action\"],[[28,[null]],\"toAccount\"],null]]]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/inputform.hbs" } });
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
  exports.default = Ember.HTMLBars.template({ "id": "P3cMDazk", "block": "{\"statements\":[[1,[33,[\"auth-form\"],null,[[\"isSignup\",\"onSignup\",\"toLogin\"],[true,[33,[\"action\"],[[28,[null]],\"signup\"],null],[33,[\"action\"],[[28,[null]],\"toggleMode\"],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/register.hbs" } });
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
  require("banker/app")["default"].create({"name":"banker","version":"0.0.0+81d8493e"});
}
//# sourceMappingURL=banker.map
