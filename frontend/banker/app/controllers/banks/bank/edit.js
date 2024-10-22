import Ember from 'ember';

export default Ember.Controller.extend({

  notification: Ember.inject.service('notify'),
    banksService: Ember.inject.service('banks'),
    branchesService: Ember.inject.service('branches'),
    branches:[],
    bankId:localStorage.getItem('bankId'),
 
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
                // console.log("bank update successfully.");
                this.get('notification').showNotification('Bank Edited successfully!', 'success');

                Ember.run.later(() => {
                 this.transitionToRoute('banks.bank',this.get('bankId'));
                 }, 2000);
              }).catch((error) => {
                console.error("Failed to load accounts:", error);
              });
        },
        cancel()
        {
          this.transitionToRoute('banks.bank');
        }
      }

});
