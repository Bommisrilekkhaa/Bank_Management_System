import Ember from 'ember';
import { getSessionData ,role} from '../utils/util';
export default Ember.Route.extend({
  model(params) {
    console.log('Attempted to access unknown path:', params.path);
  },
  redirect() {
    let bankId = localStorage.getItem('bankId');
    
    let sessionData = getSessionData();

    if (!sessionData) {
      this.transitionTo('login');
      return;
    }

    let userId = sessionData.user_id;
    let userrole = sessionData.user_role;

    if (userrole !== role.SUPERADMIN) {
      this.transitionTo('banks.bank.users.user.dashboard', bankId, userId);
      return;
    }
    else{
        this.transitionTo('users');
        return;
    }

  }
});
