import Ember from 'ember';
import $ from 'jquery';
export default Ember.Service.extend({
    ajax: Ember.inject.service(),
   
      getSessionData(){
        let value = `; ${document.cookie}`;
        let parts = value.split(`; sessionData=`);
        if (parts.length === 2) {
          let cookieData = decodeURIComponent(parts.pop().split(';').shift());
          return JSON.parse(cookieData);
        }
        return null;
      },
  

    fetchCustomerDashboard() {
      let sessionData=this.getSessionData();
      let bankId=localStorage.getItem('bankId');
        let url = `http://localhost:8080/banker/api/v1/banks/${bankId}/users/${sessionData.user_id}/dashboard`;
       
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
            console.error("Error fetching dashboard:", error);
            if (error.responseJSON) {
              alert(`Error: ${error.responseJSON.message}`);
            } else {
              alert("An error occurred while fetching dashboard.");
            }
            throw error.responseJSON || error;
          }
        });
      },

      fetchAdminDashboard() {
        let sessionData=this.getSessionData();
        let bankId=localStorage.getItem('bankId');
        let url = `http://localhost:8080/banker/api/v1/banks/${bankId}/users/${sessionData.user_id}/dashboard`;
     
        return $.ajax({
          url: url,
          method: 'GET',
          contentType: 'application/json',
          credentials: 'include',
          xhrFields: {
            withCredentials: true
          }, 
          success: (response) => {
              return response;
            },
            error: (error) => {
                console.error("Error fetching dashboard:", error);
                if (error.responseJSON) {
                    alert(`Error: ${error.responseJSON.message}`);
                } else {
                    alert("An error occurred while fetching dashboard.");
                }
                throw error.responseJSON || error;
            }
        });
      },

      fetchManagerDashboard() {
        let sessionData=this.getSessionData();
        let bankId=localStorage.getItem('bankId');
        let url = `http://localhost:8080/banker/api/v1/banks/${bankId}/users/${sessionData.user_id}/dashboard`;
     
        return $.ajax({
          url: url,
          method: 'GET',
          contentType: 'application/json',
          credentials: 'include',
          xhrFields: {
            withCredentials: true
          }, 
          success: (response) => {
              return response;
            },
            error: (error) => {
                console.error("Error fetching dashboard:", error);
                if (error.responseJSON) {
                    alert(`Error: ${error.responseJSON.message}`);
                } else {
                    alert("An error occurred while fetching dashboard.");
                }
                throw error.responseJSON || error;
            }
        });
      },
});
