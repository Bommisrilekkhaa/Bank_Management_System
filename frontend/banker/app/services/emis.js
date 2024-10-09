import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({
    ajax: Ember.inject.service(),

    fetchEmis(loanId) {
        let bankId = localStorage.getItem('bankId');
        return $.ajax({
            url: `http://localhost:8080/banker/api/v1/banks/${bankId}/loans/${loanId}/emis`,
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
                console.error("Error fetching EMIs:", error);
                if (error.responseJSON) {
                    alert(`Error: ${error.responseJSON.message}`);
                } else {
                    alert("An error occurred while fetching EMIs.");
                }
                throw error.responseJSON || error;
            }
        });
    },

    makePayment(emiId) {
        let bankId=localStorage.getItem('bankId');
        let loanId=localStorage.getItem('loanId');
        return $.ajax({
            url: `http://localhost:8080/banker/api/v1/banks/${bankId}/loans/${loanId}/emis`,
            type: 'POST',
            contentType: 'application/json',
            credentials: 'include',
            xhrFields: {
                withCredentials: true
            },
            success: (response) => {
                return response;
            },
            error: (error) => {
                console.error("Error making payment:", error);
                if (error.responseJSON) {
                    alert(`Error: ${error.responseJSON.message}`);
                } else {
                    alert("An error occurred while making the payment.");
                }
                throw error.responseJSON || error;
            }
        });
    }
});
