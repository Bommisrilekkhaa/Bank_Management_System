import Ember from 'ember';
import { getSessionData,role } from '../../../utils/util';
export default Ember.Route.extend({

sharedData:Ember.inject.service('shared-data'),
  beforeModel() {
    
    let sessionData = getSessionData();

    if (!sessionData) {
      this.transitionTo('login');
      return;
    }

    this.get('sharedData').set('accNo', '*');
    this.get('sharedData').set('loanId', '*');
    this.get('sharedData').set('transactionId', '*');
    if(sessionData.user_role != role.MANAGER)
    {
      this.get('sharedData').set('branchId', '*');
    }
  },
  setupController(controller) {
    // console.log(this.get('sharedData'));
    controller.loadBanks(this.get('sharedData').get('bankId'));
  }

});