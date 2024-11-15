import Ember from 'ember';
import { getSessionData } from '../utils/util';
export default Ember.Route.extend({

    sharedData:Ember.inject.service('shared-data'),
    beforeModel() {
        let sessionData = getSessionData();
        if(document.cookie !='')
        {
            this.transitionTo('banks.bank.users.user.dashboard', this.get('sharedData').get('bankId'),sessionData.user_id);
        }
    }
    
});
