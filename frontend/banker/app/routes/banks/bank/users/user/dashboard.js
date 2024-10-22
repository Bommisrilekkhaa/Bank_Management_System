import Ember from 'ember';

export default Ember.Route.extend({

    getSessionData() {
        let value = `; ${document.cookie}`;
        let parts = value.split(`; sessionData=`);
        if (parts.length === 2) {
            let cookieData = decodeURIComponent(parts.pop().split(';').shift());
            return JSON.parse(cookieData);
        }
        return null;
    },
    beforeModel() {

        let sessionData = this.getSessionData();

        if (!sessionData) {
            this.transitionTo('login');
            return;
        }
        let role = sessionData.user_role;

        if (role == 'SUPERADMIN') {
            this.transitionTo('users');
            return;
        }
    },
    setupController(controller, model) {
        let role = this.getSessionData().user_role;

        if (role == 'ADMIN') {
            controller.fetchAdminDashboard();
        }
        else if (role == 'MANAGER') {
            controller.fetchManagerDashboard();
        }
        else {
            controller.fetchCustomerDashboard();
        }

    }



});
