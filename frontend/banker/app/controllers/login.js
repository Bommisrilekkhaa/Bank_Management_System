import Ember from 'ember';

export default Ember.Controller.extend({
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
    login(credentials) {

      // console.log('Login action triggered'); 
      // console.log(credentials);
     
      this.get('session').login(credentials)
        .then(() => {
          this.transitionToRoute('dashboard'); 
        })
        .catch((error) => {
          this.set('errorMessage', error.message || 'Login failed');
        });
    },

    signup(credentials) {
      // console.log('signup action triggered'); 
     
      this.get('session').signup(credentials)
        .then(() => {
          this.transitionToRoute('dashboard'); 
        })
        .catch((error) => {
          this.set('errorMessage', error.message || 'Signup failed');
        });
    },

   
    logout() {
      this.get('session').logout()
        .then(() => {
          this.transitionToRoute('login'); 
        });
    },

    toggleMode() {
      // console.log(isSignup);

      this.transitionToRoute('register');


    }
  }
});
