import Ember from 'ember';

export default Ember.Controller.extend({
    banksService: Ember.inject.service('banks'),
    branchesService: Ember.inject.service('branches'),
    branches:[],
    bankId:localStorage.getItem('bankId'),
    init() {
        this._super(...arguments);
        console.log("Loan form initialized...");
        this.loadBranches();
    
      }, 
      loadBranches() {
        this.get('branchesService').fetchBranches(this.get('bankId')).then((response) => {
          console.log(response);
          this.set('branches', response);
        }).catch((error) => {
          console.error("Failed to load accounts:", error);
        });
      },
      actions:{
        submitForm()
        {
            this.get('banksService').updateBank(this.get('branchId'),this.get('bank')).then(() => {
                console.log("bank update successfully.");
                this.transitionToRoute('banks.bank',this.get('bankId'));
              }).catch((error) => {
                console.error("Failed to load accounts:", error);
              });
        }
      }

});
