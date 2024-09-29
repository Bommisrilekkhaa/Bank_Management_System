import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),

 
  fetchAccounts() {
    return $.ajax({
      url: `http://localhost:8080/banker/api/v1/accounts`,
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
    const {  acc_type,acc_status, username, branch_name } = accountDetails;

    console.log("insert...");
    return $.ajax({
      url: `http://localhost:8080/banker/api/v1/accounts`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        // acc_no,
        acc_type,
        // acc_balance,
        acc_status,
        username,
        branch_name
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
    const {  acc_no,acc_type,  acc_status, username, branch_name } = accountDetails;

    return $.ajax({
      url: `http://localhost:8080/banker/api/v1/accounts/${acc_no}`,
      type: 'PUT',
      contentType: 'application/json',
      
      data: JSON.stringify({
        
        acc_type,
        // acc_balance,
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

  fetchBranches() {
    return $.ajax({
      url: `http://localhost:8080/banker/api/v1/branch`,
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
        if (error.responseJSON) {
          alert(`Error: ${error.responseJSON.message}`);
        } else {
          alert("An error occurred while fetching branches.");
        }
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
