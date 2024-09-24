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
  this.route('dashboard',{path:"/banker/dashboard"});
});

export default Router;
