import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),

 
  fetchAccounts(bankid) {
    let url = `http://localhost:8080/banker/api/v1/`;
    let branchId = localStorage.getItem("branchId");
    let bankId = localStorage.getItem('bankId');
    if(bankId!="*")
    {
      url=url +`banks/${bankId}`;
    }
    if(branchId!='*')
    {
      url=url+`/branches/${branchId}`;
    }
    url=url+`/accounts`;

   
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



fetchActiveAccounts(bankid) {
  let url = `http://localhost:8080/banker/api/v1/`;
  let branchId = localStorage.getItem("branchId");
  let bankId = localStorage.getItem('bankId');
  if(bankId!="*")
  {
    url=url +`banks/${bankId}`;
  }
  if(branchId!='*')
  {
    url=url+`/branches/${branchId}`;
  }
  url=url+`/accounts?acc_status=1`;

 
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

fetchAccount(bankid) {
  let url = `http://localhost:8080/banker/api/v1/`;
  let bankId = localStorage.getItem('bankId');
    let branchId = localStorage.getItem("branchId");
    let accNo = localStorage.getItem('accNo');
    if(bankId!="*")
    {
      url=url +`banks/${bankId}`;
    }
    if(branchId!='*')
    {
      url=url+`/branches/${branchId}`;
    }
    if(accNo!="*")
    {
      url = url+`/accounts/${accNo}`;
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
      console.error("Error fetching account:", error);
      if (error.responseJSON) {
        alert(`Error: ${error.responseJSON.message}`);
      } else {
        alert("An error occurred while fetching account.");
      }
      throw error.responseJSON || error;
    }
  });
},
  createAccount(accountDetails) {
    let bankId = localStorage.getItem('bankId');
    const {  acc_type,acc_status, username} = accountDetails;
    let url = `http://localhost:8080/banker/api/v1/`;
    let branchId = localStorage.getItem("branchId");
    if(bankId!="*")
    {
      url=url +`banks/${bankId}`;
    }
    if(branchId!='*')
    {
      url=url+`/branches/${branchId}`;
    }
    url=url+`/accounts`;

   
    return $.ajax({
      url: url,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        acc_type,
        username:username,
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

  updateAccount(accountDetails) {
    const {  acc_type,  acc_status, fullname,username} = accountDetails;
    
    let url = `http://localhost:8080/banker/api/v1/`;
    let bankId = localStorage.getItem('bankId');
    let branchId = localStorage.getItem("branchId");
    let accNo = localStorage.getItem('accNo');
    if(bankId!="*")
    {
      url=url +`banks/${bankId}`;
    }
    if(branchId!='*')
    {
      url=url+`/branches/${branchId}`;
    }
    if(accNo!="*")
    {
      url = url+`/accounts/${accNo}`;
    }

    
    return $.ajax({
      url: url,
      type: 'PUT',
      contentType: 'application/json',
      
      data: JSON.stringify({
        
        acc_type,
        fullname,
        acc_status,
        username
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
