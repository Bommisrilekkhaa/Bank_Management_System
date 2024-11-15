import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  sharedData:Ember.inject.service('shared-data'),
  login(credentials) {
    let bankId=this.get('sharedData').get('bankId');
      const { username, password, isSuperAdmin} = credentials;
    if(isSuperAdmin)
    {
      bankId=-1;
    }
      // console.log(credentials);

      let url = `http://localhost:8080/banker/api/v1/auth?action=login`;
      if(isSuperAdmin)
      {
        url=url+`&isSuperAdmin=true`;
      }
      return $.ajax({
        url: url,
        type: 'POST',
        credentials:'include',
        contentType: 'application/json',
        data: JSON.stringify({ username, password,bank_id:bankId}),
        xhrFields:{
          withCredentials:true
        },
        success: (response,txtStatus, xhr) => {
          // console.log(xhr);
          return response;
        },
        error: (error) => {
          alert("Invalid credentials!!");
          throw error.responseJSON || error;
        }
      });
  },

  signup(credentials) {
      const { username, password, user_role,   full_name, date_of_birth,  user_phonenumber,   user_address  } = credentials;

      // console.log(credentials+'signup');
     
      return $.ajax({
        url: `http://localhost:8080/banker/api/v1/auth?action=register`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 
          username, 
          password, 
          user_role,
          full_name, 
          date_of_birth, 
          user_phonenumber, 
          user_address 
        }),
        success: (response) => {
          return response;
        },
        error: (error) => {
          alert("Error:"+error.responseJSON.message );
          throw error.responseJSON || error;
        }
      });
  },


  logout() {
     
      return $.ajax({
        url: `http://localhost:8080/banker/api/v1/auth?action=logout`,
        type: 'GET',
        credentials:'include',
        xhrFields:{
          withCredentials:true
        },
        success: (response) => {
          document.cookie =document.cookie+ '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          return response;
        },
        error: (error) => {
          throw error.responseJSON || error;
        }
      });
  }
});
