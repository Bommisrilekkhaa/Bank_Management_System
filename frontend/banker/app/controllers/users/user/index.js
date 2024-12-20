import Ember from 'ember';
import { methods } from '../../../utils/util';
export default Ember.Controller.extend({
    fetchService: Ember.inject.service('fetch'),
    sharedData:Ember.inject.service('shared-data'),
    loadUser(userId) {
      let bankId=this.get('sharedData').get('bankId');
      let url = `http://localhost:8080/banker/api/v1`;
      if(bankId!="*")
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
