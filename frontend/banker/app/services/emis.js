import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({
    ajax: Ember.inject.service(),

    fetchEmis(loanId) {
        let bankId = localStorage.getItem('bankId');
        let url = `http://localhost:8080/banker/api/v1/`;
   
        if(bankId!="*")
        {
        url=url +`banks/${bankId}`;
        }
   
        if(loanId!='*')
        {
        url=url+`/loans/${loanId}`;
        }
        url=url+`/emis`;
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
        let url = `http://localhost:8080/banker/api/v1/`;
   
        if(bankId!="*")
        {
        url=url +`banks/${bankId}`;
        }
    
        if(loanId!='*')
        {
            url=url+`/loans/${loanId}/emis`;
        }
        return $.ajax({
            url: url,
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
