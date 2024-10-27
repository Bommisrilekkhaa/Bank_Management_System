import Ember from 'ember';
import { status,methods } from '../../../utils/util';
export default Ember.Controller.extend({

  notification: Ember.inject.service('notify'),
    fetchService: Ember.inject.service('fetch'),
    statuses: [status.PENDING,status.ACTIVE,status.INACTIVE],

    actions:{

        submitForm() {
            
          let userId = localStorage.getItem('userId');
          let url = `http://localhost:8080/banker/api/v1`;
          let bankId=localStorage.getItem('bankId');
          if(bankId!="*")
          {
            url=url +`/banks/${bankId}`;
          }
          if(userId!="*")
          {
            url=url+`/users/${userId}`;
        
          }
            const userData = {
               
                user_status:(this.get('user_status')=='')?0:((this.get('user_status')==status.PENDING)?0:((this.get('user_status')==status.ACTIVE)?1:2)),
         
              };

              this.get('fetchService').fetch(url,methods.PUT,userData).then(() => {
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
