import Ember from 'ember';
import $ from 'jquery';
export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  fetchUsers(bankid) {
    let bankId=localStorage.getItem('bankId');
    let userId=localStorage.getItem('userId');
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

   
    return $.ajax({
      url: url,
      type: 'GET',
      contentType: 'application/json',
      credentials: 'include',
      xhrFields: {
        withCredentials: true 
      },
      success: (response) => {
        return response;
      },
      error: (error) => {
        console.error("Error fetching users:", error);
        if (error.responseJSON) {
          alert(`Error: ${error.responseJSON.message}`);
        } else {
          alert("An error occurred while fetching users.");
        }
        throw error.responseJSON || error;
      }
    });
  },

  fetchManagers()
  {
    let bankId=localStorage.getItem('bankId');
    let url = `http://localhost:8080/banker/api/v1`;
    if(bankId!="*")
    {
      url=url +`/banks/${bankId}`;
    }
   
    url=url+`/users?filter_manager=true`;

   
    return $.ajax({
      url: url,
      type: 'GET',
      contentType: 'application/json',
      credentials: 'include',
      xhrFields: {
        withCredentials: true 
      },
      success: (response) => {
        return response;
      },
      error: (error) => {
        console.error("Error fetching managers:", error);
        if (error.responseJSON) {
          alert(`Error: ${error.responseJSON.message}`);
        } else {
          alert("An error occurred while fetching managers.");
        }
        throw error.responseJSON || error;
      }
    });
  },

  fetchAdmins()
  {
    let bankId=localStorage.getItem('bankId');
    let url = `http://localhost:8080/banker/api/v1`;
    if(bankId!="*")
    {
      url=url +`/banks/${bankId}`;
    }
   
    url=url+`/users?filter_admin=true`;

   
    return $.ajax({
      url: url,
      type: 'GET',
      contentType: 'application/json',
      credentials: 'include',
      xhrFields: {
        withCredentials: true 
      },
      success: (response) => {
        return response;
      },
      error: (error) => {
        console.error("Error fetching admins:", error);
        if (error.responseJSON) {
          alert(`Error: ${error.responseJSON.message}`);
        } else {
          alert("An error occurred while fetching admins.");
        }
        throw error.responseJSON || error;
      }
    });
  },
  deleteUser(userId) {
    let bankId=localStorage.getItem('bankId');
    let url = `http://localhost:8080/banker/api/v1`;
    if(bankId!="*")
    {
      url=url +`/banks/${bankId}`;
    }
   if(userId!="*")
   {
     url=url+`/users/${userId}`;

   }

    return $.ajax({
        url: url,
        type: 'DELETE',
        contentType: 'application/json',
        success: (response) => {
          console.log("user deleted successfully");
          return response;
        },
        error: (error) => {
          console.error("Error deleting user:", error);
          throw error.responseJSON || error;
        }
      });
  },


  updateUser(userData) {
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
    return $.ajax({
        url: url,
        type: 'PUT',
        contentType: 'application/json',
      data: JSON.stringify({
       
        user_status: userData.user_status
      }),
      success: (response) => {
        return response;
      },
      error: (error) => {
        throw error.responseJSON || error;
      }
    });
  }
});
