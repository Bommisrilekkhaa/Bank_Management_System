import Ember from 'ember';

export default Ember.Controller.extend({

    session: Ember.inject.service(),
    actions:{
        logout() {
            // console.log("logout");
            this.get('session').logout()
              .then(() => {
                this.transitionToRoute('login'); 
              });
          }
    }
});
