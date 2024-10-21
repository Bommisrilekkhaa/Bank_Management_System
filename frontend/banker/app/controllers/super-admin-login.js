import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service(),
    actions:{
        SuperAdminLogin(credentials)
        {
            credentials.isSuperAdmin = true;
            this.get('session').login(credentials)
            .then(() => {
            
                this.transitionToRoute('users');
            
            })
            .catch((error) => {
            this.set('errorMessage', error.message || 'Login failed');
            });
               
        }
    }
    
});
