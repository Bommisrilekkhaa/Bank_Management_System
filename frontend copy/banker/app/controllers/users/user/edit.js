import Ember from 'ember';
import { status,methods } from '../../../utils/util';
export default Ember.Controller.extend({

  sharedData:Ember.inject.service('shared-data'),
  notification: Ember.inject.service('notify'),
    fetchService: Ember.inject.service('fetch'),
    statuses:  [status.INACTIVE,status.ACTIVE],

    actions:{

        submitForm() {
         
              if (!this.get('statuses').includes(this.get('user_status'))) {
                this.set("errorMessage", "Please select a valid user status.");
                return;
              }
           
          let userId = this.get('sharedData').get('userId');
          let url = `http://localhost:8080/banker/api/v1`;
          let bankId= this.get('sharedData').get('bankId');
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
                // console.log("User updated successfully!");
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
            this.transitionToRoute("banks.bank.users",this.get('sharedData').get("bankId"));
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
