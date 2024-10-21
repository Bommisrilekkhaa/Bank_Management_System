import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  branchId:'',

  fetchBranches(bankid) {
    let bankId=localStorage.getItem('bankId');
    let url = `http://localhost:8080/banker/api/v1/`;
      if(bankId!="*")
      {
        url=url +`banks/${bankId}`;
      }
      
      url=url+`/branches`;
    return $.ajax({
      url: url,
      type: 'GET',
      contentType: 'application/json',
      credentials: 'include',
      xhrFields: {
        withCredentials: true 
      },
      success: (response) => {
        console.log("branches");
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
  

  
  
  fetchBranch(bankid) {
    let bankId=localStorage.getItem('bankId');
    let url = `http://localhost:8080/banker/api/v1/`;
    let branchId = localStorage.getItem('branchId');
      if(bankId!="*")
      {
        url=url +`banks/${bankId}`;
      }
      if(branchId!="*")
        {
          url=url +`/branches/${branchId}`;
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
        console.error("Error fetching branch:", error);
        if (error.responseJSON) {
          alert(`Error: ${error.responseJSON.message}`);
        } else {
          alert("An error occurred while fetching branch.");
        }
        throw error.responseJSON || error;
      }
    });
  },

 
  createBranch(branchDetails) {
    let bankId=localStorage.getItem('bankId');
    const { name, address, manager_id } = branchDetails;
    let url = `http://localhost:8080/banker/api/v1/`;
    if(bankId!="*")
    {
      url=url +`banks/${bankId}`;
    }
    
    url=url+`/branches`;
    console.log("insert...");
    return $.ajax({
      url: url,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        branch_name:name,
        branch_address:address,
        manager_id:manager_id
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

 
  updateBranch(branchDetails) {
    let bankId=localStorage.getItem('bankId');
    const { branchId, name, address, manager_id } = branchDetails;
    let url = `http://localhost:8080/banker/api/v1/`;
    if(bankId!="*")
    {
      url=url +`banks/${bankId}`;
    }
    
  
    if(branchId!='*')
    {
      url=url+`/branches/${branchId}`;
    }
    return $.ajax({
      url: url,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        branch_name:name,
        branch_address:address,
        manager_id:manager_id
      }),
      success: (response) => {
        return response;
      },
      error: (error) => {
        throw error.responseJSON || error;
      }
    });
  },

 
  deleteBranch(bankid, branch_id) {
    let bankId=localStorage.getItem('bankId');
    let url = `http://localhost:8080/banker/api/v1/`;
    if(bankId!="*")
    {
      url=url +`banks/${bankId}`;
    }
    
   
    if(branch_id!='*')
    {
      url=url+`/branches/${branch_id}`;
    }
    return $.ajax({
      url: url,
      type: 'DELETE',
      contentType: 'application/json',
      success: (response) => {
        console.log("Branch deleted successfully");
        return response;
      },
      error: (error) => {
        console.error("Error deleting branch:", error);
        throw error.responseJSON || error;
      }
    });
  }
});
