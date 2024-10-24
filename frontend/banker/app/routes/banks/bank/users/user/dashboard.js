import Ember from 'ember';
import { getSessionData,role } from '../../../../../utils/util';
export default Ember.Route.extend({

    beforeModel() {

        let sessionData = getSessionData();

        if (!sessionData) {
            this.transitionTo('login');
            return;
        }
        let userrole = sessionData.user_role;

        if (userrole == role.SUPERADMIN) {
            this.transitionTo('users');
            return;
        }
    },
    setupController(controller, model) {
        let userrole = getSessionData().user_role;

        if (userrole == role.ADMIN) {
            controller.fetchAdminDashboard();
        }
        else if (userrole == role.MANAGER) {
            controller.fetchManagerDashboard();
        }
        else {
            controller.fetchCustomerDashboard();
        }

    }



});
