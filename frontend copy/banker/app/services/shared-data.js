import Ember from 'ember';

export default Ember.Service.extend({
    bankId:'*',
    branchId:'*',
    accNo:'*',
    transactionId:'*',
    loanId:'*',
    userId:'*',
    
    // changedBranchId() {
    //     if(this.get('branchId')=='*')
    //     {
    //         this.trigger('branchChanged');
    //         let targetController = this.controllerFor('application');
    //         targetController.set('branch_name', 'all');

        // }
    // }
  
});
