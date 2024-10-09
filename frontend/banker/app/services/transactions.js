import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({

  ajax: Ember.inject.service(),
 
  fetchTransactions(accNo, bankId) {
    let url1 = `http://localhost:8080/banker/api/v1/banks/${bankId}`;
    let url2=`/branches/${localStorage.getItem("branchId")}`;
    let url3 = `/accounts/${localStorage.getItem("accNo")}`;
    let url4 = `/transactions`;
    let url =``;
    if(localStorage.getItem("branchId")!="*" && localStorage.getItem("accNo")!='*')
    {
      url = url1+url2+url3+url4;
    }
    else if(localStorage.getItem("branchId")!="*")
    {
      url = url1+url2+url4;
    }
    else
    {
      url = url1+url4;
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
    let url1 = `http://localhost:8080/banker/api/v1/banks/${details.bankId}`;
    let url2=`/branches/${details.branchId}`;
    let url3 = `/accounts/${details.accNo}`;
    let url4 = `/transactions`;
    let url =``;
    if(details.branchId!="*" && details.accNo!='*')
    {
      url = url1+url2+url3+url4;
    }
    else if(details.branchId!="*")
    {
      url = url1+url2+url4;
    }
    else
    {
      url = url1+url4;
    }
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
