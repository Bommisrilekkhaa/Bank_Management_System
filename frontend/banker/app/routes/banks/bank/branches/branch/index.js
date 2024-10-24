import Ember from 'ember';
import { getSessionData,role } from '../../../../../utils/util';
export default Ember.Route.extend({
  beforeModel()
  {
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
    else if(userrole == role.CUSTOMER){

        this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
        return;
    }
  },
    setupController(controller, model) {
      this._super(controller, model);
      controller.loadBranch();
    }
});