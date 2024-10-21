
  import Ember from 'ember';

export default Ember.Controller.extend({
  banksService: Ember.inject.service('banks'),
  bankId: localStorage.getItem("bankId"),
  
  banks: [],

  loadBanks() {
    this.get('banksService').fetchBanks().then((response) => {
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