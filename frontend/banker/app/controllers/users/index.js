import Ember from 'ember';
import { status } from '../../utils/util';
export default Ember.Controller.extend({
  usersService: Ember.inject.service('users'),
  bankId: localStorage.getItem("bankId"),
  status:status,
  notification: Ember.inject.service('notify'),
  users: [],
  selectedUserRole: '',
  selectedUserStatus: '',

  filteredUsers: Ember.computed('users', 'selectedUserRole', 'selectedUserStatus', function() {
    let users = this.get('users');
    let selectedUserRole = this.get('selectedUserRole');
    let selectedUserStatus = this.get('selectedUserStatus');


    if (selectedUserRole) {
      users = users.filter(user => user.user_role === selectedUserRole);
    }

    if (selectedUserStatus) {
      users = users.filter(user => user.user_status === selectedUserStatus);
    }

    return users;
  }),

  loadUsers() {
    this.get('usersService').fetchUsers().then((response) => {
      console.log(response);
      this.set('users', response);
    }).catch((error) => {
      console.error("Failed to load users:", error);
    });
  },

  actions: {
    viewUser(user) {
      localStorage.setItem('userId', user.user_id);
      this.transitionToRoute('users.user', user.user_id).then((newRoute) => {
        newRoute.controller.setProperties({
          bankId: this.get('bankId')
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    },

    editUser(user) {
      localStorage.setItem('userId', user.user_id);
      this.transitionToRoute('users.user.edit', user.user_id).then((newRoute) => {
        newRoute.controller.setProperties({
          isEdit: true,
          userId: user.user_id,
          fullname: user.fullname,
          username: user.username,
          user_role: user.user_role,
          date_of_birth: user.date_of_birth,
          user_phonenumber: user.user_phonenumber,
          user_address: user.user_address,
          user_status: user.user_status,
          bankId: this.get('bankId')
        });
        
      }).catch((error) => {
        console.error("Failed to load users:", error);
      });
    },

    deleteUser(user) {
      if (confirm(`Are you sure you want to delete the user: ${user.fullname}?`)) {
        this.get('usersService').deleteUser(user.user_id).then(() => {
          console.log('User deleted successfully');
          this.get('notification').showNotification('User Deleted successfully!', 'success');

          Ember.run.later(() => {
            this.transitionToRoute('users');
            this.loadUsers();
           }, 2000);
        }).catch((error) => {
          console.error("Failed to load users:", error);
        });
        
      }
    },

    updateUserRole(role) {
      this.set('selectedUserRole', role);
    },

    updateUserStatus(status) {
      this.set('selectedUserStatus', status);
    }
  }
});
