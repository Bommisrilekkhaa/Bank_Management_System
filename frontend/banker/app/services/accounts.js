import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),

 
  fetchAccounts(bankId) {
    return $.ajax({
      url: `http://localhost:8080/banker/api/v1/banks/${bankId}/accounts`,
      type: 'GET',
      contentType: 'application/json',
      credentials: 'include',
      xhrFields: {
        withCredentials: true 
      },
      success: (response) => {
        console.log("accounts");
        return response;
      },
      error: (error) => {
        console.error("Error fetching accounts:", error);
        if (error.responseJSON) {
          alert(`Error: ${error.responseJSON.message}`);
        } else {
          alert("An error occurred while fetching accounts.");
        }
        throw error.responseJSON || error;
      }
    });
},

  
  createAccount(accountDetails) {
    const {  acc_type,acc_status, username,bankId,branchId } = accountDetails;

    console.log("insert...");
    return $.ajax({
      url: `http://localhost:8080/banker/api/v1/banks/${bankId}/branches/${branchId}/accounts`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        // acc_no,
        acc_type,
        // acc_balance,
        acc_status,
        username
      }),
      
      success: (response) => {
        return response;
      },
      error: (error) => {
        console.log("insert...err");
        throw error.responseJSON || error;
      }
    });
  },

  // Update an account
  updateAccount(accountDetails) {
    const {  acc_no,acc_type,  acc_status, fullname,username, branch_name ,bankId,branchId} = accountDetails;

    return $.ajax({
      url: `http://localhost:8080/banker/api/v1/banks/${bankId}/branches/${branchId}/accounts/${acc_no}`,
      type: 'PUT',
      contentType: 'application/json',
      
      data: JSON.stringify({
        
        acc_type,
        // acc_balance,
        fullname,
        acc_status,
        username,
        branch_name
      }),
      success: (response) => {
        return response;
      },
      error: (error) => {
        throw error.responseJSON || error;
      }
    });
  },

  fetchBranches(bankId) {
    return $.ajax({
      url: `http://localhost:8080/banker/api/v1/banks/${bankId}/branches`,
      type: 'GET',
      contentType: 'application/json',
      credentials: 'include',
      xhrFields: {
        withCredentials: true 
      },
      success: (response) => {
        // console.log("branches");
        return response;
      },
      error: (error) => {
        console.error("Error fetching branches:", error);
        // if (error.responseJSON) {
        //   alert(`Error: ${error.responseJSON.message}`);
        // } else {
        //   alert("An error occurred while fetching branches.");
        // }
        throw error.responseJSON || error;
      }
    });
  },

  

  updateUser(userData) {

    return $.ajax({
      url: `http://localhost:8080/banker/api/v1/users/${userData.userId}`,
      type: 'PUT',
      contentType: 'application/json',
      
      data: JSON.stringify({
        
        
        full_name:userData.fullname
      }),
      success: (response) => {
        return response;
      },
      error: (error) => {
        throw error.responseJSON || error;
      }
    });
  },

  fetchBanks() {
    return $.ajax({
      url: `http://localhost:8080/banker/api/v1/banks`,
      type: 'GET',
      contentType: 'application/json',
      credentials: 'include',
      xhrFields: {
        withCredentials: true 
      },
      success: (response) => {
        // console.log("banks");
        return response;
      },
      error: (error) => {
        console.error("Error fetching banks:", error);
        if (error.responseJSON) {
          alert(`Error: ${error.responseJSON.message}`);
        } else {
          alert("An error occurred while fetching banks.");
        }
        throw error.responseJSON || error;
      }
    });
  }
});
