import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({

    ajax: Ember.inject.service(),

 
    fetchLoans(accNo, bankid) { 
    let url = `http://localhost:8080/banker/api/v1/`;
    let bankId = localStorage.getItem("bankId");
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
    url=url+`/loans`;
    return $.ajax({
      url: url,
        type: 'GET',
        contentType: 'application/json',
        credentials: 'include',
        xhrFields: {
          withCredentials: true 
        },
        success: (response) => {
          console.log("loans");
          return response;
        },
        error: (error) => {
          console.error("Error fetching loans:", error);
          if (error.responseJSON) {
            alert(`Error: ${error.responseJSON.message}`);
          } else {
            alert("An error occurred while fetching loans.");
          }
          throw error.responseJSON || error;
        }
      });
  },
  fetchLoan(accNo, bankid) { 
    let bankId = localStorage.getItem("bankId");
    let url = `http://localhost:8080/banker/api/v1/`;
    let branchId = localStorage.getItem("branchId");
    let accno = localStorage.getItem('accNo');
    let loanId = localStorage.getItem('loanId');
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
    if(loanId!="*")
      {
        url = url+`/loans/${loanId}`;
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
          console.error("Error fetching loan:", error);
          if (error.responseJSON) {
            alert(`Error: ${error.responseJSON.message}`);
          } else {
            alert("An error occurred while fetching loan.");
          }
          throw error.responseJSON || error;
        }
      });
  },
    
    createLoan(Details) {
      const { loan_type,loan_status,loan_duration,loan_amount} = Details;
    let url = `http://localhost:8080/banker/api/v1/`;
    let bankId = localStorage.getItem("bankId");
    let branchid = localStorage.getItem("branchId");
    let accno = Details.accNo
    if(bankId!="*")
    {
      url=url +`banks/${bankId}`;
    }
    if(branchid!='*')
    {
      url=url+`/branches/${branchid}`;
    }
    if(accno!="*")
    {
      url = url+`/accounts/${accno}`;
    }
    url=url+`/loans`;
      console.log("insert...");
      return $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          
          loan_type,
          loan_amount,
          loan_duration,
          loan_status,
          
        }),
        
        success: (response) => {
          return response;
        },
        error: (error) => {
          // console.log("insert...err");
          if (error.responseJSON) {
            alert(`Error: ${error.responseJSON.message}`);
          } else {
            alert("An error occurred while creating loan.");
          }
          throw error.responseJSON || error;
        }
      });
    },
  
    updateLoan(loanDetails) {
      const {  loan_type,loan_status,loan_duration,loan_amount,loan_id} = loanDetails;
    let url = `http://localhost:8080/banker/api/v1/`;
    let bankId = localStorage.getItem("bankId");
    let branchid = localStorage.getItem("branchId");
    let accno = localStorage.getItem('accNo');
    if(bankId!="*")
    {
      url=url +`banks/${bankId}`;
    }
    if(branchid!='*')
    {
      url=url+`/branches/${branchid}`;
    }
    if(accno!="*")
    {
      url = url+`/accounts/${accno}`;
    }
    if(loan_id!="*")
    {

      url=url+`/loans/${loan_id}`;
    }
      return $.ajax({
        url: url,
        type: 'PUT',
        contentType: 'application/json',
        
        data: JSON.stringify({
          
          loan_type,
          loan_amount,
          loan_duration,
          loan_status
        }),
        success: (response) => {
          return response;
        },
        error: (error) => {
          if (error.responseJSON) {
            alert(`Error: ${error.responseJSON.message}`);
          } else {
            alert("An error occurred while updating loan.");
          }
          throw error.responseJSON || error;
        }
      });
    },
  
   
});
