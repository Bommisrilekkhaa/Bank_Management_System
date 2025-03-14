import Ember from 'ember';
import { getSessionData } from '../utils/util';
export default Ember.Service.extend({
    bankId: '*',
    branchId:'*',
    accNo:'*',
    transactionId:'*',
    loanId:'*',
    userId:'*',
    init() {
        this._super(...arguments);
        let sessionData = getSessionData();
        if (sessionData) {
          this.set('bankId', sessionData.bank_id);
        }
      }
    
    // changedBranchId() {
    //     if(this.get('branchId')=='*')
    //     {
    //         this.trigger('branchChanged');
    //         let targetController = this.controllerFor('application');
    //         targetController.set('branch_name', 'all');

        // }
    // }
  
});
