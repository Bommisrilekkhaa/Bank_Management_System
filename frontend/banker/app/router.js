import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('index', {path:"/banker"})
  this.route('login',{path:"/banker/login"});
  this.route('register',{path:"/banker/register"});
  // this.route('accounts',{path:"/banker/banks/:bankId/accounts"});
  this.route('inputform',{path:"/banker/inputform"});

  this.route('users', {path:"/banker/users"},function() {
    this.route('user', {path:"/:userId"},function() {
      this.route('dashboard');
    });
  });

  this.route('banks', {path:"/banker/banks"},function() {
    this.route('bank', {path:"/:bankId"},function() {
      this.route('accounts', function() {
        this.route('account', {path:"/:accNo"},
            function() {
              this.route('transactions', 
                  function() {
                    this.route('transaction',{path:"/:transactionId"});
                  });
              this.route('loans', 
                    function() {
                      this.route('loan',{path:"/:loanId"});
                    });
              this.route('edit');
            });
        this.route('new');
      });
      this.route('branches', function() {
        this.route('branch',{path:"/:branchId"});
      });
    });
  });
});

export default Router;
