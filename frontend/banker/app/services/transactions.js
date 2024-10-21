import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({

  ajax: Ember.inject.service(),
 
  fetchTransactions(accNo, bankid) {
    let url = `http://localhost:8080/banker/api/v1/`;
    let bankId =localStorage.getItem('bankId');
    let branchId = localStorage.getItem("branchId");
    let accno = localStorage.getItem('accNo');
    if(bankId!="*")
    {
      url=url +`banks/${bankId}`;
    }
    if(branchId!='*')
    {
      url=url+`/branches/${branchId}`;
    }
    if(accno!="*")
    {
      url = url+`/accounts/${accno}`;
    }
    url=url+`/transactions`;

    
    return $.ajax({
      url: url,
      type: 'GET',
      contentType: 'application/json',
      credentials: 'include',
      xhrFields: {
        withCredentials: true 
      },
      success: (response) => {
        console.log("transactions");
        return response;
      },
      error: (error) => {
        console.error("Error fetching transactions:", error);
        if (error.responseJSON) {
          alert(`Error: ${error.responseJSON.message}`);
        } else {
          alert("An error occurred while fetching transactions.");
        }
        throw error.responseJSON || error;
      }
    });
},

fetchTransaction() {
  let transactionId = localStorage.getItem("transactionId");
  let url = `http://localhost:8080/banker/api/v1/`;
  let bankId =localStorage.getItem('bankId');
  let branchId = localStorage.getItem("branchId");
  let accno = localStorage.getItem('accNo');
  if(bankId!="*")
  {
    url=url +`banks/${bankId}`;
  }
  if(branchId!='*')
  {
    url=url+`/branches/${branchId}`;
  }
  if(accno!="*")
  {
    url = url+`/accounts/${accno}`;
  }
  if(transactionId!="*")
  {

    url=url+`/transactions/${transactionId}`;
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
      console.log("transactions");
      return response;
    },
    error: (error) => {
      console.error("Error fetching transactions:", error);
      if (error.responseJSON) {
        alert(`Error: ${error.responseJSON.message}`);
      } else {
        alert("An error occurred while fetching transactions.");
      }
      throw error.responseJSON || error;
    }
  });
},
  createTransaction(details) {

    let url = `http://localhost:8080/banker/api/v1/`;
    let bankId = details.bankId;
    let branchId =details.branchId;
    let accno = details.accNo;
    if(bankId!="*")
    {
      url=url +`banks/${bankId}`;
    }
    if(branchId!='*')
    {
      url=url+`/branches/${branchId}`;
    }
    if(accno!="*")
    {
      url = url+`/accounts/${accno}`;
    }
    url=url+`/transactions`;

   
    return $.ajax({
      url: url,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        transaction_type: details.transaction_type,
        transaction_amount:details.transaction_amount,
        acc_number:details.accNo
      }),
      success: (response) => {
        console.log("transactions");
        return response;
      },
      error: (error) => {
        console.log("insert...err");
        throw error.responseJSON || error;
      }
    });
   
  },

  

});
