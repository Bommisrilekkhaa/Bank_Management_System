import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel()
    {
        let value = `; ${document.cookie}`;
        let parts = value.split(`; ${'sessionData'}=`);
        if (parts.length === 2) {
          let cookieData = decodeURIComponent(parts.pop().split(';').shift());
          let sessionData = JSON.parse(cookieData);
        if(document.cookie !='')
        {
            this.transitionTo('banks.bank.users.user.dashboard',localStorage.getItem('bankId'),sessionData.user_id);
        }
        }
    }
});
