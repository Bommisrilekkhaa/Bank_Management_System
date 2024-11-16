import Ember from 'ember';
import { getSessionData,role } from '../../../../utils/util';
export default Ember.Route.extend({
  sharedData:Ember.inject.service('shared-data'),
  beforeModel()
  {
 
    let bankId = this.get('sharedData').get('bankId');
    let sessionData = getSessionData();

    if (!sessionData) {
      this.transitionTo('login');
      return;
    }

    let userId = sessionData.user_id;
    let userrole = sessionData.user_role;

    if (userrole == role.SUPERADMIN) {
      this.transitionTo('users');
      return;
    }
    else if(userrole == role.CUSTOMER || userrole == role.MANAGER){

        this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
        return;
    }

    this.get('sharedData').set('accNo','*'); 
    this.get('sharedData').set('loanId','*');  
    this.get('sharedData').set('transactionId','*');
    this.get('sharedData').set('branchId','*');
    let targetController = this.controllerFor('application');
    console.log(targetController);
    targetController.set('branch_name', 'all');
  },
      setupController(controller) {
        
        controller.loadBranches(1);
      }
    
});
