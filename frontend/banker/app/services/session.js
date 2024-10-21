import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),

  login(credentials) {
    let bankId=localStorage.getItem('bankId');
      const { username, password, isSuperAdmin} = credentials;

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
          console.log(xhr);
          return response;
        },
        error: (error) => {
          alert("Invalid credentials!!");
          throw error.responseJSON || error;
        }
      });
  },

  signup(credentials) {
      const { username, password, selectedRole, name, dob, pno, addr } = credentials;

      // console.log(credentials+'signup');
     
      return $.ajax({
        url: `http://localhost:8080/banker/api/v1/auth?action=register`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 
          username, 
          password, 
          user_role: selectedRole, 
          full_name:name, 
          date_of_birth:dob, 
          user_phonenumber: pno, 
          user_address: addr 
        }),
        success: (response) => {
          return response;
        },
        error: (error) => {
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
