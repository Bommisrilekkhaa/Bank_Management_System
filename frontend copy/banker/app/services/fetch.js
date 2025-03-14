import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),

  fetch(url,method,data)
  {
      return $.ajax({
        url: url,
        type: method,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: (response) => {
          return response;
        },
        error: (error) => {
          if (error.responseJSON) {
            alert(`Error: ${error.responseJSON.message}`);
          } else {
            console.error("An error occurred in server!");
          }
          throw error.responseJSON || error;
        }
      });
    },
  
});
 