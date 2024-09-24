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
    username: '',
    password: '',
    selectedRole: '',
    name: '',
    dob: '',
    addr: '',
    pno: '',
    confirmPassword: '',
    errorMessage: '',

    isSignup: false,

    actions: {
      submitForm: function submitForm() {
        var username = this.get('username');
        var password = this.get('password');
        var selectedRole = this.get('selectedRole');

        if (!username || !password) {
          this.set('errorMessage', 'Username and password are required.');
          return;
        }

        // if (password.length < 8) {
        //   this.set('errorMessage', 'Password must be at least 8 characters long.');
        //   return;
        // }

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
        console.log('Submit button pressed' + action);
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
      },
      toggleMode: function toggleMode() {
        var action = this.get('isSignup') ? 'toLogin' : 'toSignup';
        if (action == 'toLogin') this.set('isSignup', false);else this.set('isSignup', true);

        this.sendAction(action);
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

                console.log("logout");
                this.get('session').logout().then(function () {
                    _this.transitionToRoute('login');
                });
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

        console.log('Login action triggered');
        // const credentials = {
        //   username: this.get('username'),
        //   password: this.get('password'),
        //   selectedRole: this.get('selectedRole')
        // };
        console.log(credentials);
        this.get('session').login(credentials).then(function () {
          _this.transitionToRoute('dashboard');
        }).catch(function (error) {
          _this.set('errorMessage', error.message || 'Login failed');
        });
      },
      signup: function signup(credentials) {
        var _this2 = this;

        console.log('signup action triggered');
        // const credentials = {
        //   username: this.get('username'),
        //   password: this.get('password'),
        //   selectedRole: this.get('selectedRole'),
        //   name: this.get('name'),
        //   dob: this.get('dob'),
        //   addr: this.get('addr'),
        //   pno: this.get('pno')
        // };

        this.get('session').signup(credentials).then(function () {
          _this2.transitionToRoute('dashboard');
        }).catch(function (error) {
          _this2.set('errorMessage', error.message || 'Signup failed');
        });
      },


      // checkLogin() {
      //   this.get('session').checkLoginStatus()
      //     .then((response) => {
      //       console.log('User is logged in:', response);
      //     })
      //     .catch(() => {
      //       this.set('errorMessage', 'User is not logged in');
      //     });
      // },

      logout: function logout() {
        var _this3 = this;

        this.get('session').logout().then(function () {
          _this3.transitionToRoute('login');
        });
      },
      toggleMode: function toggleMode(isSignup) {
        console.log(isSignup);
        this.transitionToRoute('register');
      },
      todashboard: function todashboard() {
        this.transitionToRoute('dashboard');
      },
      tologin: function tologin() {
        this.transitionToRoute('login');
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

        console.log('signup action triggered');
        // const credentials = {
        //   username: this.get('username'),
        //   password: this.get('password'),
        //   selectedRole: this.get('selectedRole'),
        //   name: this.get('name'),
        //   dob: this.get('dob'),
        //   addr: this.get('addr'),
        //   pno: this.get('pno')
        // };

        this.get('session').signup(credentials).then(function () {
          _this.transitionToRoute('dashboard');
        }).catch(function (error) {
          _this.set('errorMessage', error.message || 'Signup failed');
        });
      },
      toggleMode: function toggleMode(isSignup) {
        console.log(isSignup);
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
  });

  exports.default = Router;
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


      console.log(credentials);
      return Ember.$.ajax({
        url: 'http://localhost:8080/banker/Login?action=login',
        type: 'POST',
        credentials: 'include',
        contentType: 'application/json',
        data: JSON.stringify({ username: username, password: password, user_role: selectedRole }),
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

      console.log(credentials + 'signup');

      return Ember.$.ajax({
        url: 'http://localhost:8080/banker/Login?action=register',
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


    // checkLoginStatus() {
    //     let login_controller = Ember.getOwner(this).lookup('controller:login');

    //     return $.ajax({
    //       url: `http://localhost:8080/banker/Login?action=check`,
    //       type: 'GET',
    //       success: (response) => {
    //         // document.cookie(response.cookie);
    //        login_controller.send('todashboard');
    //         return response;
    //       },
    //       error: (error) => {
    //         login_controller.send('tologin');
    //         throw error.responseJSON || error;
    //       }
    //     });
    // },

    logout: function logout() {

      return Ember.$.ajax({
        url: 'http://localhost:8080/banker/Login?action=logout',
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
  exports.default = Ember.HTMLBars.template({ "id": "866If33m", "block": "{\"statements\":[[11,\"body\",[]],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"main-content\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"auth-form\"],[13],[0,\"\\n      \"],[11,\"h2\",[]],[13],[1,[33,[\"if\"],[[28,[\"isSignup\"]],\"Register\",\"Login\"],null],false],[14],[0,\"\\n      \"],[11,\"form\",[]],[5,[\"action\"],[[28,[null]],\"submitForm\"],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n          \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n            \"],[11,\"label\",[]],[15,\"for\",\"role\"],[13],[0,\"Role\"],[14],[0,\"\\n            \"],[11,\"select\",[]],[15,\"id\",\"role\"],[16,\"onchange\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"selectedRole\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[0,\"\\n              \"],[11,\"option\",[]],[15,\"value\",\"\"],[15,\"disabled\",\"\"],[15,\"selected\",\"\"],[13],[0,\"Select a role\"],[14],[0,\"\\n              \"],[11,\"option\",[]],[15,\"value\",\"manager\"],[13],[0,\"Manager\"],[14],[0,\"\\n              \"],[11,\"option\",[]],[15,\"value\",\"customer\"],[13],[0,\"Customer\"],[14],[0,\"\\n            \"],[14],[0,\"\\n          \"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isSignup\"]]],null,{\"statements\":[[0,\"          \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n            \"],[11,\"label\",[]],[15,\"for\",\"name\"],[13],[0,\"Name\"],[14],[0,\"\\n            \"],[11,\"input\",[]],[15,\"id\",\"name\"],[15,\"type\",\"text\"],[16,\"value\",[26,[\"name\"]],null],[15,\"class\",\"form-control\"],[15,\"placeholder\",\"Enter your full name\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"name\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n          \"],[14],[0,\"\\n          \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n            \"],[11,\"label\",[]],[15,\"for\",\"dob\"],[13],[0,\"Date of Birth\"],[14],[0,\"\\n            \"],[11,\"input\",[]],[15,\"id\",\"dob\"],[15,\"type\",\"date\"],[16,\"value\",[26,[\"dob\"]],null],[15,\"class\",\"form-control\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"dob\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n          \"],[14],[0,\"\\n          \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n            \"],[11,\"label\",[]],[15,\"for\",\"pno\"],[13],[0,\"Phone Number\"],[14],[0,\"\\n            \"],[11,\"input\",[]],[15,\"id\",\"pno\"],[15,\"type\",\"number\"],[16,\"value\",[26,[\"pno\"]],null],[15,\"class\",\"form-control\"],[15,\"placeholder\",\"Enter your phone number\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"pno\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n          \"],[14],[0,\"\\n          \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n            \"],[11,\"label\",[]],[15,\"for\",\"addr\"],[13],[0,\"Address\"],[14],[0,\"\\n            \"],[11,\"textarea\",[]],[15,\"id\",\"addr\"],[16,\"value\",[26,[\"addr\"]],null],[15,\"class\",\"form-control\"],[15,\"placeholder\",\"Enter your address\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"addr\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n          \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"username\"],[13],[0,\"Username\"],[14],[0,\"\\n          \"],[11,\"input\",[]],[15,\"id\",\"username\"],[15,\"type\",\"text\"],[16,\"value\",[26,[\"username\"]],null],[15,\"class\",\"form-control\"],[15,\"placeholder\",\"Enter your username\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"username\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n        \"],[14],[0,\"\\n\\n        \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n          \"],[11,\"label\",[]],[15,\"for\",\"password\"],[13],[0,\"Password\"],[14],[0,\"\\n          \"],[11,\"input\",[]],[15,\"id\",\"password\"],[15,\"type\",\"password\"],[16,\"value\",[26,[\"password\"]],null],[15,\"class\",\"form-control\"],[15,\"placeholder\",\"Enter your password\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"password\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n        \"],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"isSignup\"]]],null,{\"statements\":[[0,\"          \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n            \"],[11,\"label\",[]],[15,\"for\",\"confirmPassword\"],[13],[0,\"Confirm Password\"],[14],[0,\"\\n            \"],[11,\"input\",[]],[15,\"id\",\"confirmPassword\"],[15,\"type\",\"password\"],[16,\"value\",[26,[\"confirmPassword\"]],null],[15,\"class\",\"form-control\"],[15,\"placeholder\",\"Confirm your password\"],[16,\"oninput\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"confirmPassword\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[13],[14],[0,\"\\n          \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n         \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn-primary\"],[13],[1,[33,[\"if\"],[[28,[\"isSignup\"]],\"Register\",\"Login\"],null],false],[14],[0,\"\\n        \"],[14],[0,\"\\n        \\n      \"],[14],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"switch\"],[5,[\"action\"],[[28,[null]],\"toggleMode\"]],[13],[1,[33,[\"if\"],[[28,[\"isSignup\"]],\"Switch to Login\",\"Switch to Register\"],null],false],[14],[0,\"\\n      \"],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"errorMessage\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[0,\"* \"],[1,[26,[\"errorMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/components/auth-form.hbs" } });
});
define("banker/templates/dashboard", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "YwK2AULx", "block": "{\"statements\":[[11,\"button\",[]],[5,[\"action\"],[[28,[null]],\"logout\"]],[13],[0,\"Logout\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/dashboard.hbs" } });
});
define("banker/templates/login", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "rQ71gNZm", "block": "{\"statements\":[[0,\"\\n\"],[1,[33,[\"auth-form\"],null,[[\"isSignup\",\"onLogin\",\"toSignup\"],[false,[33,[\"action\"],[[28,[null]],\"login\"],null],[33,[\"action\"],[[28,[null]],\"toggleMode\",[28,[\"isSignup\"]]],null]]]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/login.hbs" } });
});
define("banker/templates/register", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "qY72e41L", "block": "{\"statements\":[[1,[33,[\"auth-form\"],null,[[\"isSignup\",\"onSignup\",\"toLogin\"],[true,[33,[\"action\"],[[28,[null]],\"signup\"],null],[33,[\"action\"],[[28,[null]],\"toggleMode\",[28,[\"isSignup\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "banker/templates/register.hbs" } });
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
  require("banker/app")["default"].create({"name":"banker","version":"0.0.0+013c3807"});
}
//# sourceMappingURL=banker.map
