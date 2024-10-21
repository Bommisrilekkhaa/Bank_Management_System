import Ember from 'ember';

export default Ember.Controller.extend({
  dashboardService: Ember.inject.service('dashboard'),
    
    role:Ember.computed(()=>{
        let value = `; ${document.cookie}`;
        let parts = value.split(`; ${'sessionData'}=`);
        if (parts.length === 2) {
            let cookieData = decodeURIComponent(parts.pop().split(';').shift());
            let sessionData = JSON.parse(cookieData);  
            return sessionData.user_role;  
        }
      }),

    init()
    {
      console.log("dashboard");
        this._super(...arguments);
       this.get('dashboardService').fetchAdminDashboard().then((response) => {
           this.set('branches', response);
       
      }).catch((error) => {
        console.error("Failed to load dashboard:", error);
      });
    },
    
});