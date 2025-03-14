import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
 

  this.route('login',{path:"/banker/login"});
  this.route('register',{path:"/banker/register"});

  this.route('users', {path:"/banker/users"},function() {
    this.route('user',{path:"/:userId"},function() {
      this.route('edit');
    });
  });

  this.route('super-admin-login',{path:"/banker/super-admin-login"});

  this.route('banks', {path:"/banker/banks"},function() {
    this.route('bank', {path:"/:bankId"},function() {
      this.route('accounts', function() {
        this.route('account', {path:"/:accNo"},
            function() {
              this.route('transactions', 
                  function() {
                    this.route('transaction', {path:"/:transactionId"});
                    this.route('new');
                  });
              this.route('loans', 
                    function() {
                      this.route('loan', {path:"/:loanId"}, function() {
                        this.route('edit');
                        this.route('emi');
                      });
                      this.route('new');
                    });
              this.route('edit');
            });
        this.route('new');
      });
      this.route('branches', function() {
        this.route('branch', {path:"/:branchId"}, function() {
          this.route('edit');
        });
        this.route('new');
      });
      this.route('loans', function() {
        this.route('loan', {path:"/:loanId"},function() {
          this.route('edit');
          this.route('emi');
        });
        this.route('new');
      });
      this.route('transactions', function() {
        this.route('transaction',{path:"/:transactionId"});
        this.route('new');
      });
      this.route('users', {path:"/users"},function() {
        this.route('user',{path:"/:userId"},function() {
          this.route('dashboard');
        });
      });
      this.route('edit');
    });
    this.route('new');
  });

  this.route('not-found',{path:"/*path"});
});

export default Router;
