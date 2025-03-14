import Ember from 'ember';
import { getSessionData,role } from '../../../../utils/util';
export default Ember.Route.extend({
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
  }

});
