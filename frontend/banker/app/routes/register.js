import Ember from 'ember';
import {getSessionData} from '../utils/util';
export default Ember.Route.extend({
    beforeModel()
    {
          let sessionData = getSessionData();
        if(document.cookie !='')
        {
            this.transitionTo('banks.bank.users.user.dashboard',localStorage.getItem('bankId'),sessionData.user_id);
        }
        
    }
});
