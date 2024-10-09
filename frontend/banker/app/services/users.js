import Ember from 'ember';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),
    bankId: localStorage.getItem('bankId'),
  fetchUsers(bankId) {
    let url = `http://localhost:8080/banker/api/v1/banks/${bankId}/users`;
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


  deleteUser(bankId,userId) {
    return $.ajax({
        url: `http://localhost:8080/banker/api/v1/banks/${bankId}/users/${userId}`,
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
    return $.ajax({
        url: `http://localhost:8080/banker/api/v1/banks/${this.get('bankId')}/users/${userData.user_id}`,
        type: 'PUT',
        contentType: 'application/json',
      data: JSON.stringify({
        full_name: userData.fullname,
        username: userData.username,
        user_role: userData.user_role,
        user_phonenumber: userData.user_phonenumber,
        user_address: userData.user_address,
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
