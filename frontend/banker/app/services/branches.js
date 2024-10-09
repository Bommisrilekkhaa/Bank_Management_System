import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  branchId:'',

  fetchBranches(bankId) {
    let url = `http://localhost:8080/banker/api/v1/banks/${bankId}/branches`;
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

 
  createBranch(branchDetails) {
    const { name, address, branch_number, bankId } = branchDetails;

    console.log("insert...");
    return $.ajax({
      url: `http://localhost:8080/banker/api/v1/banks/${bankId}/branches`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        name,
        address,
        branch_number
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
    const { branch_id, name, address, branch_number, bankId } = branchDetails;

    return $.ajax({
      url: `http://localhost:8080/banker/api/v1/banks/${bankId}/branches/${branch_id}`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        name,
        address,
        branch_number
      }),
      success: (response) => {
        return response;
      },
      error: (error) => {
        throw error.responseJSON || error;
      }
    });
  },

 
  deleteBranch(bankId, branch_id) {
    return $.ajax({
      url: `http://localhost:8080/banker/api/v1/banks/${bankId}/branches/${branch_id}`,
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
