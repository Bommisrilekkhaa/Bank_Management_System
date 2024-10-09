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
  userId:'',
  getUserIdFromCookie() {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${'sessionData'}=`);
    if (parts.length === 2) {
        let cookieData = decodeURIComponent(parts.pop().split(';').shift());
        let sessionData = JSON.parse(cookieData);  // Parse the JSON string
        return sessionData.user_id;  // Extract user_id
    }
  },
  actions: {
    login(credentials) {
      // console.log('Login action triggered'); 
      // console.log(credentials);
      this.get('session').login(credentials)
        .then(() => {
          this.set('userId',this.getUserIdFromCookie());
          if (this.get('userId')) {
            // Transition to the dashboard route using the dynamic userId
            this.transitionToRoute('banks.bank.users.user.dashboard',localStorage.getItem('bankId'), this.get('userId')); 
          } else {
            this.set('errorMessage', 'User ID not found in cookies');
          }
        })
        .catch((error) => {
          this.set('errorMessage', error.message || 'Login failed');
        });
    },

    signup(credentials) {
      // console.log('signup action triggered'); 
     
      this.get('session').signup(credentials)
        .then(() => {
          this.transitionToRoute('login'); 
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
