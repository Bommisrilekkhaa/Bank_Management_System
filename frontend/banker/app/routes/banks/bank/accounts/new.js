import Ember from 'ember';
import { getSessionData,role } from '../../../../utils/util';
export default Ember.Route.extend({
  sharedData:Ember.inject.service('shared-data'),
  beforeModel() {

    let sessionData = getSessionData();

    if (!sessionData) {
      this.transitionTo('super-admin-login');
      return;
    }

    let userrole = sessionData.user_role;

    if (userrole == role.SUPERADMIN) {
      this.transitionTo('users');
      return;
    }
  },
  resetController(isExiting) {
    if (isExiting) {
      this.get('sharedData').set('branchId','*');
    }
  }


});
