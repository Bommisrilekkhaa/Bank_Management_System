import Ember from 'ember';

export default Ember.Component.extend({
    dashboardService: Ember.inject.service('dashboard'),
    
    
      userId: Ember.computed(() => {
        let value = `; ${document.cookie}`;
        let parts = value.split(`; ${'sessionData'}=`);
        if (parts.length === 2) {
          let cookieData = decodeURIComponent(parts.pop().split(';').shift());
          let sessionData = JSON.parse(cookieData);
          return sessionData.user_id; 
        }
      }),
      init()
      {
            this._super(...arguments);
          this.get('dashboardService').fetchManagerDashboard().then((response) => {
              this.set('branches', response);
              let array =this.get('branches');
                    for (let i = 0; i < array.length; i++) {
                    let item = array[i];
                    if(item['manager_id']==this.get('userId'))
                    {
                        this.set('branch',item);
                        localStorage.setItem('branchId',this.get('branch').branch_id)
                        // console.log(this.get('branch'));
                        break;
                    }
                    }
              
          
          }).catch((error) => {
            console.error("Failed to load dashboard:", error);
          });
      },
});
