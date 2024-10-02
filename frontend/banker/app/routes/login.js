import Ember from 'ember';

export default Ember.Route.extend({

    beforeModel() {
        let loginController = this.controllerFor('login');
        let userId = loginController.get('userId');
    
        if(document.cookie !='')
        {
            this.transitionTo('users.user.dashboard',userId);
        }
    }
});
