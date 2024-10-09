import Ember from 'ember';

export default Ember.Controller.extend({
  usersService: Ember.inject.service('users'),
  bankId: localStorage.getItem("bankId"),
  
  init() {
  },
  users: [],

  loadUsers() {
    console.log(this.get('bankId'));
    this.get('usersService').fetchUsers(this.get('bankId')).then((response) => {
      console.log(response);
      this.set('users', response);
    }).catch((error) => {
      console.error("Failed to load users:", error);
    });
  },

  actions: {
    viewUser(user) {
      localStorage.setItem('userId', user.user_id);
      this.transitionToRoute('banks.bank.users.user', this.get('bankId'), user.user_id).then((newRoute) => {
        newRoute.controller.setProperties({
          bankId: this.get('bankId'),
          User: user
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    },

   

    editUser(user) {
      this.transitionToRoute('banks.bank.users.user.edit', this.get('bankId'), user.user_id).then((newRoute) => {
        newRoute.controller.setProperties({
          isEdit: true,
          userId: user.user_id,
          fullname: user.fullname,
          username: user.username,
          user_role: user.user_role,
          date_of_birth:user.date_of_birth,
          user_phonenumber: user.user_phonenumber,
          user_address: user.user_address,
          user_status:user.user_status,
          bankId: this.get('bankId')
        });

        this.loadUsers();
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    },

    deleteUser(user) {
      if (confirm(`Are you sure you want to delete the user: ${user.fullname}?`)) {
        this.get('usersService').deleteUser(this.get('bankId'), user.user_id).then(() => {
          console.log('User deleted successfully');
          this.loadUsers();
        }).catch((error) => {
          console.error("Failed to delete user:", error);
          alert('Error occurred while deleting the user.');
        });
      }
    }
  }
});
