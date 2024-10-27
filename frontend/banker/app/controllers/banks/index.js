import Ember from 'ember';
import {methods} from '../../utils/util';
export default Ember.Controller.extend({
  fetchService: Ember.inject.service('fetch'),
  bankId: localStorage.getItem("bankId"),
  
  banks: [],

  loadBanks() {

    let  url= `http://localhost:8080/banker/api/v1/banks`;
    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      console.log(response);
      this.set('banks', response);
    }).catch((error) => {
      console.error("Failed to load banks:", error);
    });
  },

  actions: {
    viewBank(bank) {
      localStorage.setItem('bankId', bank.bank_id);
      this.transitionToRoute('banks.bank', bank.bank_id).then((newRoute) => {
        newRoute.controller.setProperties({
          bankId: this.get('bankId')
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    },
    addNewBank() {
        this.transitionToRoute('banks.new').then(()=>{
          
        }).catch((error) => {
          console.error("Transition failed", error);
        });
          
      },
}
});