import Ember from 'ember';
import { status } from '../../../utils/util';
export default Ember.Controller.extend({

  notification: Ember.inject.service('notify'),
    usersService: Ember.inject.service('users'),
    statuses: [status.PENDING,status.ACTIVE,status.INACTIVE],

    actions:{

        submitForm() {
            
           
            const userData = {
               
                user_status: this.get('user_status')
              };

              this.get('usersService').updateUser(userData).then(() => {
                console.log("User updated successfully!");
                this.resetForm();
                this.get('notification').showNotification('User Edited successfully!', 'success');
                Ember.run.later(() => {
                  this.transitionToRoute('users');
                  }, 2000);
              }).catch((error) => {
                console.error('Error updating user:', error);
              });
        },
      
        toUsers()
        {
            this.transitionToRoute("banks.bank.users",localStorage.getItem("bankId"));
        }
      },
      resetForm() {
        this.setProperties({
          userId:'',
          user_status: '',
          isEdit: false
        });
      }
});
