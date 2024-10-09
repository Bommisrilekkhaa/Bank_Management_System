import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({

    ajax: Ember.inject.service(),

 
    fetchLoans(accNo, bankId) { let url1 = `http://localhost:8080/banker/api/v1/banks/${bankId}`;
    let url2=`/branches/${localStorage.getItem("branchId")}`;
    let url3 = `/accounts/${localStorage.getItem("accNo")}`;
    let url4 = `/loans`;
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
  
    
    createLoan(Details) {
      const {  accNo,bankId,branchId ,loan_type,loan_status,loan_duration,loan_amount} = Details;
  
      console.log("insert...");
      return $.ajax({
        url: `http://localhost:8080/banker/api/v1/banks/${bankId}/branches/${branchId}/accounts/${accNo}/loans`,
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
          console.log("insert...err");
          throw error.responseJSON || error;
        }
      });
    },
  
    updateLoan(loanDetails) {
      const {  accNo,bankId,branchId ,loan_type,loan_status,loan_duration,loan_amount,loan_id} = loanDetails;
  
      return $.ajax({
        url: `http://localhost:8080/banker/api/v1/banks/${bankId}/branches/${branchId}/accounts/${accNo}/loans/${loan_id}`,
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
          throw error.responseJSON || error;
        }
      });
    },
  
   
});
