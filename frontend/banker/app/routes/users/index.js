import Ember from 'ember';
import { getSessionData,role } from '../../utils/util';
export default Ember.Route.extend({
  sharedData:Ember.inject.service('shared-data'),
  beforeModel()
  {
    let bankId = this.get('sharedData').get('bankId');
    
    let sessionData = getSessionData();

    if (!sessionData) {
      this.transitionTo('super-admin-login');
      return;
    }

    let userId = sessionData.user_id;
    let userrole = sessionData.user_role;

    if (userrole !== role.SUPERADMIN) {
      this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
      return;
    }

   this.get('sharedData').set('accNo','*'); 
   this.get('sharedData').set('loanId','*'); 
   this.get('sharedData').set('transactionId','*');
   this.get('sharedData').set('branchId','*');
   this.get('sharedData').set('bankId',"*");
   this.get('sharedData').set('userId',"*");
  },
   
      setupController(controller) {
        controller.loadUsers(1);
      }
    
});
