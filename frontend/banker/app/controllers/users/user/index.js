import Ember from 'ember';
import { methods } from '../../../utils/util';
export default Ember.Controller.extend({
    fetchService: Ember.inject.service('fetch'),
    sharedData:Ember.inject.service('shared-data'),
    userDetails: Ember.computed('user', function () {
      return [
        { label: "Full Name", value: this.get('user.fullname') },
        { label: "Username", value: this.get('user.username') },
        { label: "Role", value: this.get('user.user_role') },
        { label: "Phone Number", value: this.get('user.user_phonenumber') },
        { label: "Status", value: this.get('user.user_status') }
      ];
    }),
    loadUser(userId) {
      let bankId=this.get('sharedData').get('bankId');
      let url = `http://localhost:8080/banker/api/v1`;
      if(bankId!="*" && bankId)
      {
        url=url +`/banks/${bankId}`;
      }
     
      url=url+`/users`;
      if(userId!="*")
      {
        url=url+`/${userId}`;
      }
        this.get('fetchService').fetch(url,methods.GET).then((response) => {
          // console.log(response);
          this.set('user', response.data[0]);
        }).catch((error) => {
          console.error("Failed to load users:", error);
        });
      },
});
