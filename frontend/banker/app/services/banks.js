import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({
    ajax: Ember.inject.service(),
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
      },
      fetchBank(bankId) {
        return $.ajax({
          url: `http://localhost:8080/banker/api/v1/banks/${bankId}`,
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
      },

      updateBank(main_branch_id, bankData) {
        let bankId=localStorage.getItem("bankId");
        return $.ajax({
          url: `http://localhost:8080/banker/api/v1/banks/${bankId}`,
          type: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify({
            bank_name:bankData.bank_name,
            bank_code:bankData.bank_code,
            admin_id:bankData.admin_id,
            main_branch_id:main_branch_id

          }), 
          credentials: 'include',
          xhrFields: {
            withCredentials: true 
          },
          success: (response) => {
            alert('Bank updated successfully!');
            return response;
          },
          error: (error) => {
            console.error("Error updating bank:", error);
            if (error.responseJSON) {
              alert(`Error: ${error.responseJSON.message}`);
            } else {
              alert("An error occurred while updating the bank.");
            }
            throw error.responseJSON || error;
          }
        });
      }
});
