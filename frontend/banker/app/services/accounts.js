import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),

 
  fetchAccounts(bankId) {
    let url1 = `http://localhost:8080/banker/api/v1/banks/${bankId}`;
    let url3 = `/accounts`;
    let url =``;
    if(localStorage.getItem("branchId")!="*")
    {
      url = url1+`/branches/${localStorage.getItem("branchId")}`+url3;
    }
    else
    {
      url = url1+url3;
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
    const {  acc_type,acc_status, username,bankId} = accountDetails;
    let branchId =localStorage.getItem('branchId');
    console.log("insert...");
    return $.ajax({
      url: `http://localhost:8080/banker/api/v1/banks/${bankId}/branches/${branchId}/accounts`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        // acc_no,
        acc_type,
        username:username,
        // acc_balance,
        acc_status,
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
    const {  accNo,acc_type,  acc_status, fullname,username, branch_name ,bankId} = accountDetails;

    return $.ajax({
      url: `http://localhost:8080/banker/api/v1/banks/${bankId}/branches/${localStorage.getItem('branchId')}/accounts/${accNo}`,
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

 
});
