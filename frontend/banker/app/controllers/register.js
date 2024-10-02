import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service(),
  username:'',
  password: '',
  selectedRole: '',
  name: '',
  dob: '',
  addr: '',
  pno: '',
  errorMessage: '',
    actions: {
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

          toggleMode()
          {
            // console.log(isSignup);
              this.transitionToRoute('login');
          }
    }
});
