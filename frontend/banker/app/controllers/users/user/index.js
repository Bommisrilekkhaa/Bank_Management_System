import Ember from 'ember';

export default Ember.Controller.extend({
    usersService: Ember.inject.service('users'),
    loadUser() {
        this.get('usersService').fetchUsers().then((response) => {
          console.log(response);
          this.set('user', response[0]);
        }).catch((error) => {
          console.error("Failed to load users:", error);
        });
      },
});
