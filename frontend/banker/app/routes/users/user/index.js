import Ember from 'ember';
import { getSessionData,role } from '../../../utils/util';
export default Ember.Route.extend({

    sharedData:Ember.inject.service('shared-data'),
    beforeModel() {

        let bankId =this.get('sharedData').get('bankId');

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
    },
    setupController(controller, model) {
        controller.loadUser(  this.get('sharedData').get('userId'));
    }
});